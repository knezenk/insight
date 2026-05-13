# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────
# INSIGHT · Dockerfile único (monorepo) · multi-stage
#
# Builda API (NestJS) e Web (React+Vite) em estágios separados.
# A imagem final é uma "runtime" enxuta · sem código-fonte, sem deps de dev.
#
# Targets disponíveis (use --target):
#   • api-dev          API com hot-reload (dev)
#   • api              API de produção
#   • web-dev          Web com Vite dev server (dev)
#   • web              Web estático servido por nginx (produção)
#
# Build:
#   docker build --target api -t insight-api:latest .
#   docker build --target web -t insight-web:latest .
# ─────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=20-alpine
ARG NGINX_VERSION=1.27-alpine

# ═════════════════════════════════════════════════════════════════════
# STAGE · base · pnpm habilitado, workdir, user não-root
# ═════════════════════════════════════════════════════════════════════
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NODE_ENV=production
WORKDIR /app
RUN corepack enable && \
    addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodeapp -G nodejs

# ═════════════════════════════════════════════════════════════════════
# STAGE · deps · instala deps de produção e dev em cache layer separado
# ═════════════════════════════════════════════════════════════════════
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# ═════════════════════════════════════════════════════════════════════
# STAGE · build · compila packages compartilhados + API + Web
# ═════════════════════════════════════════════════════════════════════
FROM deps AS build
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY tsconfig.base.json ./
COPY packages packages/
COPY apps apps/
RUN pnpm --filter @insight/shared build && \
    pnpm --filter @insight/ui build && \
    pnpm --filter @insight/api build && \
    pnpm --filter @insight/web build

# ═════════════════════════════════════════════════════════════════════
# TARGET · api-dev · hot-reload (monta /app via bind no compose)
# ═════════════════════════════════════════════════════════════════════
FROM deps AS api-dev
ENV NODE_ENV=development
COPY tsconfig.base.json ./
COPY packages packages/
COPY apps/api apps/api/
USER nodeapp
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/healthz || exit 1
CMD ["pnpm", "--filter", "@insight/api", "dev"]

# ═════════════════════════════════════════════════════════════════════
# TARGET · api · produção · só os artefatos compilados
# ═════════════════════════════════════════════════════════════════════
FROM base AS api
ENV NODE_ENV=production
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
USER nodeapp
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/healthz || exit 1
CMD ["node", "apps/api/dist/main.js"]

# ═════════════════════════════════════════════════════════════════════
# TARGET · web-dev · Vite dev server (monta /app via bind no compose)
# ═════════════════════════════════════════════════════════════════════
FROM deps AS web-dev
ENV NODE_ENV=development
COPY tsconfig.base.json ./
COPY packages packages/
COPY apps/web apps/web/
USER nodeapp
EXPOSE 5173
CMD ["pnpm", "--filter", "@insight/web", "dev", "--host", "0.0.0.0"]

# ═════════════════════════════════════════════════════════════════════
# TARGET · web · produção · estáticos servidos por nginx
# ═════════════════════════════════════════════════════════════════════
FROM nginx:${NGINX_VERSION} AS web
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY _container_setup/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
