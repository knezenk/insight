# Insight

> Plataforma de inteligência midiática multi-tenant · arquitetura enterprise · production-ready.

[![Node](https://img.shields.io/badge/node-20.x-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-orange)](https://pnpm.io)
[![License](https://img.shields.io/badge/license-UNLICENSED-red)]()

---

## Visão geral

Insight é um produto SaaS de inteligência midiática que monitora menções,
classifica sentimento, calcula scores quantitativos (Risco Reputacional,
Impacto Financeiro, IVN, Índice 360), identifica narrativas dominantes,
mapeia influenciadores e gera relatórios analíticos.

O sistema é construído como **API Gateway / BFF** — ele NÃO mantém banco de dados próprio.
Todos os dados vêm de APIs externas. O backend agrega, normaliza, faz cache e
expõe uma API REST consistente para o frontend.

### Modo Mock × Modo Produção

Uma única variável controla todo o comportamento de fonte de dados:

```env
FAKE_DATA=1    # Usa MockProvider (dados sintéticos coerentes) — default em dev
FAKE_DATA=0    # Usa HttpProvider (consome APIs externas reais)
```

A troca é feita via **adapter pattern** com **dependency injection** — sem `if`s
espalhados pelo código. Detalhes em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Stack

| Camada              | Tecnologia                                               |
| ------------------- | -------------------------------------------------------- |
| **Backend**         | NestJS 10 · TypeScript · Pino · class-validator · Swagger |
| **Frontend**        | React 18 · TypeScript · Vite · TanStack Query · Zustand   |
| **UI**              | Tailwind · shadcn/ui · Recharts · Radix Primitives        |
| **Cache**           | Redis (ioredis)                                           |
| **HTTP Client**     | undici (backend) · axios (frontend)                       |
| **Auth**            | JWT (access + refresh) · OAuth-ready                      |
| **Tests**           | Jest (backend) · Vitest + Testing Library · Playwright    |
| **Observabilidade** | pino · OpenTelemetry · Prometheus metrics                 |
| **DevOps**          | Docker multi-stage · docker-compose · nginx · GH Actions  |
| **Lint/Format**     | ESLint · Prettier · Husky · lint-staged · commitlint      |

Justificativas de cada escolha em [`docs/ARCHITECTURE.md#stack-decisions`](docs/ARCHITECTURE.md#stack-decisions).

---

## Estrutura do monorepo

```
insight/
├── apps/
│   ├── api/                  # Backend NestJS (BFF + API Gateway)
│   └── web/                  # Frontend React + Vite
├── packages/
│   ├── shared/               # DTOs, types, constants compartilhados
│   └── ui/                   # Componentes UI compartilhados
├── docs/                     # Documentação técnica
├── infra/
│   ├── docker/               # Dockerfiles
│   └── nginx/                # nginx.conf de produção
├── scripts/                  # Utilitários de build/deploy
├── docker-compose.yml        # Stack de desenvolvimento
├── pnpm-workspace.yaml
└── package.json
```

Detalhamento completo em [`docs/STRUCTURE.md`](docs/STRUCTURE.md).

---

## Quickstart

### Pré-requisitos

- Node.js 20+ ([`.nvmrc`](.nvmrc))
- pnpm 9+ (`npm install -g pnpm`)
- Docker + Docker Compose (apenas para Redis local)

### Setup local

```bash
# 1. Clonar
git clone https://github.com/knezenk/insight.git
cd insight

# 2. Instalar dependências
pnpm install

# 3. Configurar ambiente (pnpm local; opcional para `docker compose` na raiz — ver infra/docker/compose.stack.env)
cp .env.example .env

# 4. Subir Redis local
docker compose up -d redis

# 5. Rodar API + Web em paralelo
pnpm dev
```

Disponível em:

- **API** → http://localhost:3002/api/v1
- **API Docs (Swagger)** → http://localhost:3002/api/docs
- **Web** → http://localhost:5173

### Comandos úteis

```bash
pnpm dev              # API + Web em paralelo (modo watch)
pnpm dev:api          # apenas backend
pnpm dev:web          # apenas frontend
pnpm build            # build de produção (todos os pacotes)
pnpm test             # todos os testes
pnpm test:cov         # com cobertura
pnpm test:e2e         # Playwright E2E
pnpm lint             # ESLint
pnpm lint:fix         # ESLint --fix
pnpm format           # Prettier --write
pnpm typecheck        # tsc --noEmit em todos os pacotes
pnpm docker:up        # sobe stack completa (api + web + redis + nginx)
pnpm docker:down      # encerra stack
```

---

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitetura, decisões técnicas, trade-offs
- [`docs/API.md`](docs/API.md) — especificação completa de todos os endpoints
- [`docs/METRICS.md`](docs/METRICS.md) — engenharia de métricas (fórmulas, cálculos)
- [`docs/STRUCTURE.md`](docs/STRUCTURE.md) — organização dos diretórios
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — estratégia de deploy + produção
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — guia de contribuição
- **Swagger live** → http://localhost:3002/api/docs (após subir a API)

---

## Deploy

```bash
# Build das imagens
docker compose -f docker-compose.yml -f docker-compose.prod.yml build

# Subir em produção
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Logs
pnpm docker:logs
```

Detalhes completos em [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Licença

UNLICENSED · Proprietary
