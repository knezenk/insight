# Estrutura do projeto

```
insight/
├── apps/
│   ├── api/                       Backend NestJS (BFF)
│   │   ├── src/
│   │   │   ├── adapters/          Strategy + DI · troca Mock × Http
│   │   │   │   ├── providers/     Implementações por domínio
│   │   │   │   └── strategies/    Algoritmos compartilhados (ex. mock generator)
│   │   │   ├── common/            Filtros, guards, interceptors, decorators, utils
│   │   │   ├── config/            AppConfigService — única fonte de env
│   │   │   ├── infrastructure/    Cache, logger, observability (sem regra de negócio)
│   │   │   ├── modules/           Módulos NestJS por domínio (auth, clipping, scores...)
│   │   │   ├── app.module.ts
│   │   │   └── main.ts            Bootstrap (helmet, swagger, CORS, validation)
│   │   ├── test/                  E2E setup
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   └── web/                       Frontend React + Vite
│       ├── src/
│       │   ├── app/               Bootstrap React (Providers, App, ProtectedRoute)
│       │   ├── components/
│       │   │   ├── charts/        Gráficos Recharts isolados
│       │   │   ├── common/        ErrorBoundary, Toast, LoadingScreen
│       │   │   ├── layout/        Sidebar, Topbar, AppLayout
│       │   │   └── ui/            Primitives (Button, Card, Input, Badge…)
│       │   ├── features/          (reservado · slices por domínio futuras)
│       │   ├── hooks/             TanStack Query wrappers (useClipping, useIvn…)
│       │   ├── lib/               http (axios + interceptors), helpers
│       │   ├── pages/             Páginas de rota (lazy-loaded)
│       │   ├── services/          Camada REST · zero regra
│       │   ├── stores/            Zustand (auth, workspace, period)
│       │   ├── styles/            Tailwind globals
│       │   ├── test/              Setup Vitest
│       │   └── main.tsx
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── shared/                    Contratos compartilhados (DTOs, types, fórmulas)
│   │   └── src/
│   │       ├── dtos/              Tipos cross-camada (HTTP)
│   │       ├── types/             Enums, envelopes
│   │       ├── constants/         Pesos, bandas
│   │       └── utils/             Cálculos puros (calculateIvn, calculateIndice360)
│   └── ui/                        Hooks/components transversais (cn, useDebounce)
│
├── docs/
│   ├── ARCHITECTURE.md            Decisões técnicas, trade-offs, fluxo
│   ├── API.md                     Spec REST completa
│   ├── METRICS.md                 Engenharia de métricas (este arquivo)
│   ├── STRUCTURE.md               (este arquivo)
│   ├── DEPLOYMENT.md              Deploy local + produção
│   └── CONTRIBUTING.md            Convenções
│
├── infra/
│   ├── docker/
│   │   ├── Dockerfile             Monorepo (API + Web · dev + prod targets)
│   │   ├── compose.stack.env      Defaults para docker compose (sem .env obrigatório)
│   │   └── entrypoint-dev.sh      pnpm install no arranque dos containers dev
│   └── nginx/
│       ├── nginx.conf             Gateway de produção (TLS, rate limit, gzip)
│       └── web.conf               Server estático do bundle React
│
├── scripts/
│   ├── dev.sh                     Setup completo de dev (Redis, deps, .env)
│   └── build.sh                   Build de produção em ordem
│
├── .github/
│   └── workflows/
│       └── ci.yml                 Lint, typecheck, test, build, docker
│
├── .husky/                        Pre-commit + commit-msg hooks
├── .vscode/                       Settings/extensions recomendadas
│
├── docker-compose.yml             Stack dev (api + web + redis + nginx)
├── docker-compose.prod.yml        Overlay de produção
├── .env.example                   Template de env
├── tsconfig.base.json             Base TS para todos os pacotes
├── pnpm-workspace.yaml
├── package.json                   Root (scripts, devDeps, lint-staged)
└── README.md
```

## Princípios de organização

- **Por domínio, não por tipo**: dentro de cada module agrupa controller + service + dto.
- **Adapters isolados**: nenhum service sabe se está usando mock ou http.
- **`@insight/shared` é a fonte da verdade** dos contratos cross-camada.
- **Cálculos puros vivem em `packages/shared/src/utils/`** — backend e frontend usam o mesmo código.
- **Pages são lazy** — code splitting automático via React.lazy.
- **Stores Zustand** apenas para estado client (auth, workspace, period).
  Tudo que vem do servidor é responsabilidade do TanStack Query.
