# syntax=docker/dockerfile:1.7
# INSIGHT · monorepo · API + Web (dev + production)
# Targets: development-api · development-web · production-api · production-web
#
# Dependências:
#   · build: estágio `deps` → `pnpm install --prod=false` (sem lockfile obrigatório)
#   · dev:   `infra/docker/entrypoint-dev.sh` → reexecuta install no arranque (idempotente)
#

ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
COPY pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod=false

FROM deps AS build-api
COPY apps/api apps/api/
COPY packages/shared packages/shared/
COPY tsconfig.base.json ./
RUN pnpm --filter @insight/shared build && \
    pnpm --filter @insight/api build

FROM deps AS development-api
COPY infra/docker/entrypoint-dev.sh /usr/local/bin/entrypoint-dev.sh
RUN chmod +x /usr/local/bin/entrypoint-dev.sh
COPY apps/api apps/api/
COPY packages/shared packages/shared/
COPY tsconfig.base.json ./
# Evita corrida nest --watch: apaga dist antes do 1.º emit do tsc → MODULE_NOT_FOUND.
RUN pnpm --filter @insight/shared build && pnpm --filter @insight/api build
EXPOSE 3002
ENTRYPOINT ["/usr/local/bin/entrypoint-dev.sh"]
CMD ["pnpm", "--filter", "@insight/api", "dev"]

FROM base AS production-api
ENV NODE_ENV=production
COPY --from=build-api /app/apps/api/dist ./apps/api/dist
COPY --from=build-api /app/apps/api/package.json ./apps/api/
COPY --from=build-api /app/packages/shared/dist ./packages/shared/dist
COPY --from=build-api /app/packages/shared/package.json ./packages/shared/
COPY pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nestjs && \
    chown -R nestjs:nodejs /app
USER nestjs
ENV API_PORT=3002
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:3002/api/v1/health || exit 1
CMD ["node", "apps/api/dist/main.js"]

FROM deps AS build-web
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY apps/web apps/web/
COPY packages/shared packages/shared/
COPY packages/ui packages/ui/
COPY tsconfig.base.json ./
RUN pnpm --filter @insight/shared build && \
    pnpm --filter @insight/ui build && \
    pnpm --filter @insight/web build

FROM deps AS development-web
COPY infra/docker/entrypoint-dev.sh /usr/local/bin/entrypoint-dev.sh
RUN chmod +x /usr/local/bin/entrypoint-dev.sh
COPY apps/web apps/web/
COPY packages packages/
COPY tsconfig.base.json ./
EXPOSE 5173
ENTRYPOINT ["/usr/local/bin/entrypoint-dev.sh"]
CMD ["pnpm", "--filter", "@insight/web", "dev", "--host", "0.0.0.0"]

FROM nginx:1.27-alpine AS production-web
COPY --from=build-web /app/apps/web/dist /usr/share/nginx/html
COPY infra/nginx/web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
