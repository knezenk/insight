# API Reference

> Especificação dos endpoints REST. Todos versionados via URI: `/api/v1/...`.
> Swagger live em `http://localhost:3001/api/docs`.

---

## Convenções globais

### Envelope de resposta

Toda resposta de sucesso retorna:

```json
{
  "data": <payload>,
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO 8601",
    "cached": false,
    "source": "mock" | "http"
  }
}
```

Toda resposta de erro retorna:

```json
{
  "statusCode": 400,
  "code": "BAD_REQUEST",
  "message": "Descrição humana",
  "details": { /* opcional */ },
  "timestamp": "ISO 8601",
  "path": "/api/v1/...",
  "requestId": "uuid"
}
```

### Headers obrigatórios

| Header | Quando | Descrição |
| --- | --- | --- |
| `Authorization: Bearer <jwt>` | Todos endpoints autenticados | Access token JWT |
| `Content-Type: application/json` | POST/PUT/PATCH | |
| `X-Request-Id` | Opcional | Echo do request id (gerado se ausente) |

### Códigos de erro padrão

| Status | Code | Significado |
| --- | --- | --- |
| 400 | `BAD_REQUEST` | Body/query mal formado |
| 401 | `UNAUTHORIZED` | Token ausente, expirado ou inválido |
| 403 | `FORBIDDEN` | Sem permissão para o recurso |
| 404 | `NOT_FOUND` | Recurso inexistente |
| 408 | `REQUEST_TIMEOUT` | API externa não respondeu a tempo |
| 422 | `UNPROCESSABLE_ENTITY` | Validação de DTO falhou |
| 429 | `RATE_LIMIT_EXCEEDED` | Throttler |
| 500 | `INTERNAL_ERROR` | Erro inesperado |
| 502 | `BAD_GATEWAY` | API externa retornou erro |
| 503 | `SERVICE_UNAVAILABLE` | Dependência indisponível (Redis, etc) |

---

## Autenticação

### POST `/api/v1/auth/login`

**Request body:**

```json
{ "email": "rafael@target360.com.br", "password": "360rafa" }
```

**Response 200:**

```json
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900,
    "user": {
      "id": "rafael",
      "email": "rafael@target360.com.br",
      "name": "Rafael Barbosa",
      "role": "super_admin",
      "workspaces": ["mjsp", "btg", "..."]
    }
  }
}
```

**Errors:** `401 UNAUTHORIZED`

**Rate limit:** `RATE_LIMIT_AUTH_MAX` por minuto por IP (default 10).

---

### POST `/api/v1/auth/refresh`

**Request body:** `{ "refreshToken": "..." }`

**Response 200:** mesmo formato de `/login`.

**Errors:** `401 UNAUTHORIZED` (refresh inválido ou expirado).

---

## Clipping

Todos os endpoints abaixo exigem `Authorization: Bearer <token>` e respeitam
`WorkspaceGuard` (usuário só lê seu próprio workspace).

### GET `/api/v1/clipping`

Lista paginada de matérias.

**Query params:**

| Param | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `workspace` | string | sim | slug do workspace |
| `from` | ISO 8601 | não | data inicial |
| `to` | ISO 8601 | não | data final |
| `segments` | array | não | `PREMIUM`, `NACIONAL_TV`, `NACIONAL_DIGITAL`, `ESPECIALIZADO`, `REGIONAL`, `HOSTIL_ESTRUTURAL` |
| `mediaTypes` | array | não | `tv`, `radio`, `print`, `online`, `social` |
| `sentiments` | array de números | não | `-3 -2 -1 1 2 3` |
| `categories` | array | não | filtro por categoria |
| `sources` | array | não | filtro por veículo |
| `searchQuery` | string | não | full-text |
| `page` | int ≥ 1 | não | default 1 |
| `pageSize` | int 1-200 | não | default 25 |

**Response 200:**

```json
{
  "data": {
    "items": [{ /* ClippingItemDto */ }],
    "total": 1025,
    "page": 1,
    "pageSize": 25,
    "totalPages": 41,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": { ... }
}
```

**Cache:** TTL 60s · chave determinística sobre o filter.

**Retry:** automático em status 5xx · 3 tentativas · backoff exponencial.

---

### GET `/api/v1/clipping/:id`

Detalhe de uma matéria.

**Path:** `:id` (string)
**Query:** `workspace=<slug>`

**Response 200:** `ClippingItemDto` ou 404.

---

## Scores

Cada endpoint retorna um cálculo derivado das matérias do período.
**TTL de cache: 300s** (cálculos são caros).

### GET `/api/v1/scores/ivn`

```
Query: workspace, from, to (todos obrigatórios)

Response 200: IvnScoreDto {
  workspace, period, ivn, ivnPrev, variation, diagnosis
}
```

Fórmula completa em [`METRICS.md#ivn`](METRICS.md#ivn).

### GET `/api/v1/scores/indice360`

`Indice360Dto` com componentes detalhadas. Veja [`METRICS.md#indice-360`](METRICS.md#indice-360).

### GET `/api/v1/scores/risk`

`ReputationalRiskDto` com drivers ponderados. Veja [`METRICS.md#risk`](METRICS.md#risk).

### GET `/api/v1/scores/financial`

`FinancialImpactDto`.

---

## Alertas

### GET `/api/v1/alerts?workspace=<slug>`

Lista alertas ativos · ordenados por `triggeredAt desc`.

**Response:** `AlertDto[]`

**Refetch:** frontend re-busca a cada 60s automaticamente.

---

## Narrativas

### GET `/api/v1/narratives?workspace=<slug>&from=<>&to=<>`

Lista narrativas dominantes do período · ordenadas por volume.

**Response:** `NarrativeDto[]`

---

## Influenciadores

### GET `/api/v1/influencers?workspace=<slug>`

**Response:** `InfluencerDto[]` ordenado por `mentionsCount desc`.

---

## Competitivo

### GET `/api/v1/competitive?workspace=<slug>&from=<>&to=<>`

**Response:** `CompetitiveDto` com SoV calculado.

---

## Reports

### POST `/api/v1/reports`

Enfileira a geração de um PDF.

**Body:**

```json
{
  "type": "audit_full",
  "workspace": "mjsp",
  "from": "2026-04-01T00:00:00Z",
  "to": "2026-04-30T23:59:59Z",
  "recipients": ["client@example.com"]
}
```

**Tipos válidos:**
`audit_full`, `daily_brief`, `crisis`, `competitive`, `influencers_map`,
`narratives_map`, `sector_intelligence`, `social`, `release`, `custom`

**Response 200:** `ReportJobDto` com `id` e `status: queued`.

### GET `/api/v1/reports/:id`

Status do job. Possíveis status: `queued`, `rendering`, `ready`, `failed`.

---

## Health

### GET `/health`

Liveness + readiness completo. Inclui memory + dependências.

**Response 200/503** conforme estado.

### GET `/healthz`

Liveness simples (sempre 200 se processo está vivo).

---

## OpenAPI / Swagger

Documentação interativa em `/api/docs`. Exporta JSON em `/api/docs-json`.
