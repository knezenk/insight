# Architecture

> Decisões técnicas, trade-offs, fluxo de dados e estratégia geral do Insight.

---

## 1. Visão geral

Insight é um **API Gateway / BFF** (Backend for Frontend) que agrega dados de múltiplas
APIs externas, normaliza, faz cache, aplica regras de autorização e expõe uma API REST
consistente para o frontend.

```
                    ┌──────────────────────────┐
                    │   APIs externas (live)   │
                    │   • Clipping              │
                    │   • NLP                   │
                    │   • Social listening      │
                    │   • Audience              │
                    └──────────┬───────────────┘
                               │ (HTTP, modo FAKE_DATA=0)
                               │
                    ┌──────────▼───────────────┐
┌────────────┐      │     Insight API          │       ┌──────────────┐
│  Browser   │◄────►│  (NestJS · BFF)          │◄─────►│  Redis cache │
│  (React)   │ HTTP │  • Auth · JWT            │       └──────────────┘
└────────────┘      │  • Cache · Adapters      │
                    │  • Aggregation           │       ┌──────────────┐
                    │  • Rate limit · CORS     │──────►│   Logs JSON  │
                    │  • Observability         │       │  (pino/OTel) │
                    └──────────────────────────┘       └──────────────┘
```

**Não há banco de dados local.** Toda persistência é feita pelas APIs externas.
A camada de cache Redis serve apenas para reduzir latência e custo de chamadas.

---

## 2. Stack decisions

| Camada | Escolha | Por quê |
| --- | --- | --- |
| **Backend** | NestJS 10 | Modularidade, DI nativa, decorators, ecossistema maduro. Curva de aprendizado conhecida. |
| **Frontend** | React 18 + Vite + TS | Build rápido, HMR, ecossistema abundante. TS pega bugs em tempo de design. |
| **State server** | TanStack Query | Cache automático, retry, refetch on focus, devtools. Substitui Redux para dados de servidor. |
| **State client** | Zustand | API mínima, persist middleware nativo, sem boilerplate. |
| **HTTP cliente** | axios + interceptors | Refresh token transparente, retry, cancelToken. |
| **Cache** | Redis (ioredis) | Latência sub-ms, TTL nativo, pub/sub disponível para futuro. |
| **Auth** | JWT access + refresh | Stateless, escalável horizontalmente. OAuth-ready via Passport. |
| **Logs** | pino + nestjs-pino | JSON estruturado, ordens de magnitude mais rápido que winston. |
| **Charts** | Recharts | Composable, declarativo, suficiente para o nível de visualização atual. |
| **UI primitives** | Radix + Tailwind | Acessibilidade ARIA por padrão, design system consistente. |
| **Tests API** | Jest + Supertest | Padrão NestJS, integração completa. |
| **Tests Web** | Vitest + Testing Library + Playwright | Vitest = drop-in replacement de Jest 4× mais rápido. |
| **DevOps** | Docker multi-stage + docker-compose + nginx | Reproducibilidade, deploy simples, isolamento. |

---

## 3. Arquitetura de modo dado (FAKE_DATA)

Núcleo da decisão: **sem `if`s espalhados pelo código**. Implementamos via
**Strategy Pattern + Dependency Injection**.

```
                 ProvidersModule
                      │
        ┌─────────────┴─────────────┐
        │  if (config.fakeData)     │  ← decisão tomada UMA VEZ no boot
        │     return MockProvider   │
        │  else                     │
        │     return HttpProvider   │
        └─────────────┬─────────────┘
                      │ injeta o token CLIPPING_PROVIDER
                      ▼
              ClippingService
              (não sabe se é mock ou http)
                      │
                      ▼
              ClippingController
              (também não sabe)
```

**Vantagens:**

- Consumidores (`Service`, `Controller`) ficam **agnósticos** ao modo
- Adicionar um novo provider exige apenas: implementar interface + adicionar factory
- Testes unitários trocam o provider trivialmente (`useValue: mockProvider`)
- Em produção (`FAKE_DATA=0`) o build poderia até excluir os mocks via tree-shake

**Como adicionar um novo domínio:**

1. Criar interface em `adapters/providers/<dom>/<dom>.provider.interface.ts`
2. Criar `<dom>-mock.provider.ts` e `<dom>-http.provider.ts` implementando a interface
3. Adicionar `<DOM>_PROVIDER` em `tokens.ts`
4. Adicionar factory em `providers.module.ts`
5. Injetar pelo token no service (`@Inject(CLIPPING_PROVIDER)`)

---

## 4. Fluxo de uma requisição

```
User clica → React Router navega → Page renderiza → useQuery dispara
   ↓
axios → interceptor adiciona Bearer JWT → POST /api/v1/clipping
   ↓
nginx (rate limit) → forward to NestJS
   ↓
NestJS: ThrottlerGuard → JwtAuthGuard → WorkspaceGuard
   ↓
Controller → Service → CacheService.wrap(...)
   ↓                                   ↓
   ├─── HIT? returna cached            └─── MISS? chama Provider
   │                                                   ↓
   │                                            MockProvider OR HttpProvider
   │                                                   ↓
   ↓                                              (se HTTP) axios → API externa
TransformInterceptor envelopa em ApiResponse<T>
   ↓
GlobalExceptionFilter (se erro) → ApiError
   ↓
Response JSON com x-request-id header
   ↓
TanStack Query cacheia → Component re-renderiza
```

---

## 5. Segurança

- **Auth**: JWT assinado HS256 (RS256 quando OAuth integrar). Access 15min, refresh 7d.
- **Headers**: helmet (HSTS, X-Frame-Options, CSP, Referrer-Policy)
- **CORS**: lista branca de origins via env (`API_CORS_ORIGINS`)
- **Rate limit**: ThrottlerModule global + nginx por IP. Auth endpoints com limite agressivo.
- **Validação**: class-validator em TODO body/query. `forbidNonWhitelisted: true`.
- **Workspace isolation**: `WorkspaceGuard` impede usuário acessar workspace alheio.
- **Logging seguro**: payload sensível (passwords, tokens) automaticamente sanitizado pelo pino.
- **Secrets**: nunca logados, nunca no git, sempre via env. `.env` no `.gitignore`.

---

## 6. Cache

- **Camada única**: Redis (sem cache em memória dos services, evita inconsistência)
- **Estratégia**: cache-aside via `CacheService.wrap(key, ttl, fetcher)`
- **Chaves**: `<scope>:<sha1(payload normalizado)>` — determinístico, curto
- **TTLs por tipo**:
  - default: 60s
  - scores: 300s (caro de calcular)
  - dictionary: 3600s (raramente muda)
- **Invalidação**: pattern-based via `invalidatePattern()` para casos pontuais
- **Degradação graceful**: se Redis cai, services continuam funcionando (apenas mais devagar)

---

## 7. Observabilidade

- **Logs estruturados**: pino (JSON em prod, pretty em dev)
- **Request ID**: `x-request-id` propagado em todo o stack
- **Tracing**: OpenTelemetry-ready (env `OTEL_ENABLED=true`)
- **Métricas Prometheus**: endpoint `/metrics` (planejado · adicionar `@willsoto/nestjs-prometheus`)
- **Health checks**: `/health` (memory, deps) + `/healthz` (liveness simples)
- **Sentry**: DSN opcional via env

---

## 8. Escalabilidade

- API stateless → escala horizontal trivial atrás de LB
- Sessions via JWT → sem afinidade de sessão necessária
- Cache em Redis cluster (não local) → consistente entre instâncias
- Workers para PDF (futuro) → fila Bull no Redis
- Frontend é static → CDN-friendly (CloudFront, Fastly)
- Rate limit no Redis (`@nestjs/throttler` storage Redis) para limit consistente

---

## 9. Trade-offs aceitos

| Decisão | Trade-off | Mitigação |
| --- | --- | --- |
| BFF + cache (sem DB local) | Latência depende das APIs externas | Redis com TTL agressivo · circuit breaker futuro |
| In-memory user repo (MVP) | Não escala, perde dados em restart | Substituir por SSO/Auth0 antes de produção |
| Mock = dataset pré-gerado | Mock pode "aceitar" filtros que API real recusaria | Validação compartilhada via `@insight/shared` DTOs |
| Single Redis instance | SPOF | Sentinel ou cluster em produção |
| Tokens HS256 | Compartilha secret entre instâncias | RS256 quando integrar SSO real |
