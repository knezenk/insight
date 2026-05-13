# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────
# INSIGHT · WEB · multi-stage Dockerfile
# Stages: deps · build · development · production (nginx static)
# ─────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ─── deps ──────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# ─── build ─────────────────────────────────────────────────────────
FROM deps AS build
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY apps/web apps/web/
COPY packages/shared packages/shared/
COPY packages/ui packages/ui/
COPY tsconfig.base.json ./
RUN pnpm --filter @insight/shared build && \
    pnpm --filter @insight/ui build && \
    pnpm --filter @insight/web build

# ─── development ───────────────────────────────────────────────────
FROM deps AS development
COPY apps/web apps/web/
COPY packages packages/
COPY tsconfig.base.json ./
EXPOSE 5173
CMD ["pnpm", "--filter", "@insight/web", "dev", "--host", "0.0.0.0"]

# ─── production (static + nginx) ──────────────────────────────────
FROM nginx:1.27-alpine AS production
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY infra/nginx/web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
