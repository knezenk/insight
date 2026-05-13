# Insight · Container setup

Setup completo de containerização: `Dockerfile` multi-stage único que builda
**API (NestJS)** e **Web (React+Vite servido por nginx)** em targets separados,
mais um `docker-compose.yml` com perfis `dev` e `prod`.

**Sem banco de dados** — Insight é BFF/API Gateway. Persistência fica nas APIs
externas (configuradas em `.env`).

---

## Arquivos

| Arquivo | Função |
| --- | --- |
| `Dockerfile` | Build multi-stage · 4 targets: `api-dev`, `api`, `web-dev`, `web` |
| `docker-compose.yml` | Orquestração · perfis `dev` (hot-reload) e `prod` (build otimizado) |
| `nginx.conf` | Config do nginx que serve os estáticos do web e faz proxy `/api/` → API |
| `.env.example` | Template das variáveis · copie como `.env` |

---

## Setup

1. **Posicionar os arquivos** dentro do repo, ao lado das pastas `apps/` e `packages/`:

```
insight/
├── apps/
├── packages/
├── _container_setup/         ← esta pasta
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx.conf
│   ├── .env.example
│   └── README.md
└── ...
```

Os caminhos do compose (`context: ..` e bind mounts `../apps/...`) já apontam
um nível acima, então tudo funciona desta posição.

2. **Criar o `.env` real:**

```bash
cd _container_setup
cp .env.example .env
# Edita o .env e troca os valores sensíveis:
#  • JWT_SECRET → openssl rand -base64 64
#  • TOKENs das APIs externas (se FAKE_DATA=0)
#  • API_CORS_ORIGINS → URL real do frontend
```

3. **`.env` NUNCA é commitado.** Já está incluído no `.gitignore` do repo.

---

## Comandos

### Desenvolvimento (hot reload · API + Web com bind mount)

```bash
docker compose --profile dev up
```

Acessível em:
- Web (Vite) → http://localhost:5173
- API → http://localhost:3001/api/v1
- Swagger → http://localhost:3001/api/docs

### Produção (imagens otimizadas)

```bash
docker compose --profile prod up -d --build
```

Acessível em:
- Web (nginx) → http://localhost:8080
- API direta → http://localhost:3001 (se quiser bypassar o nginx)

### Outros

```bash
docker compose logs -f api          # acompanha logs da API
docker compose logs -f web          # acompanha logs do web
docker compose down                 # encerra
docker compose down -v              # encerra e remove volumes
docker compose build --no-cache     # rebuild forçado sem cache
```

---

## Build manual de imagens (sem compose)

```bash
# API de produção
docker build --target api -t insight-api:1.0.0 -f _container_setup/Dockerfile .

# Web de produção
docker build --target web -t insight-web:1.0.0 \
  --build-arg VITE_API_BASE_URL=/api/v1 \
  -f _container_setup/Dockerfile .

# Rodar manualmente
docker run -d --name insight-api -p 3001:3001 --env-file _container_setup/.env insight-api:1.0.0
```

---

## Push para registry (ex: GitHub Container Registry)

```bash
# Autentica (usar PAT com scope write:packages · NUNCA senha)
echo "$GHCR_TOKEN" | docker login ghcr.io -u <user> --password-stdin

# Tag + push
docker tag insight-api:1.0.0 ghcr.io/knezenk/insight-api:1.0.0
docker tag insight-web:1.0.0 ghcr.io/knezenk/insight-web:1.0.0
docker push ghcr.io/knezenk/insight-api:1.0.0
docker push ghcr.io/knezenk/insight-web:1.0.0
```

---

## Segurança · checklist antes de subir em produção

- [ ] `JWT_SECRET` regenerado com `openssl rand -base64 64`
- [ ] `API_CORS_ORIGINS` apontando para domínio real (não `*`)
- [ ] `FAKE_DATA=0` (a menos que seja staging de demo)
- [ ] Todas as URLs/tokens de APIs externas preenchidas
- [ ] HTTPS na frente (Traefik / Caddy / ingress / Cloudflare)
- [ ] Logs estruturados sendo coletados (Loki, CloudWatch, Datadog)
- [ ] Healthchecks integrados ao orquestrador (compose já tem; K8s precisa de probe)
- [ ] `.env` NUNCA no repositório · usar secret manager em K8s

---

## Troubleshooting

**Containers não conseguem se comunicar?**
Verifique que estão na mesma network `insight-net`. O nginx no container web
chama `http://api:3001` (nome do serviço no compose), não `localhost`.

**`pnpm: command not found` durante build?**
Verifique se `RUN corepack enable` rodou. Pode precisar especificar `corepack`
explicitamente em distros mais antigas.

**Bind mount não atualiza no Windows/Mac?**
A flag `:cached` ajuda. Para máxima performance, considere usar Mutagen ou
docker-sync.

**Build do web falha por falta de memória?**
Aumente o limite do Docker Desktop em Preferences → Resources → Memory.
A build do Vite + Rollup pode precisar de 4 GB.
