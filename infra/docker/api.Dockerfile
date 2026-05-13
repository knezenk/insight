# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────
# INSIGHT · API · multi-stage Dockerfile
# Stages: deps · build · development · production
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
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

# ─── build ─────────────────────────────────────────────────────────
FROM deps AS build
COPY apps/api apps/api/
COPY packages/shared packages/shared/
COPY tsconfig.base.json ./
RUN pnpm --filter @insight/shared build && \
    pnpm --filter @insight/api build

# ─── development ───────────────────────────────────────────────────
FROM deps AS development
COPY apps/api apps/api/
COPY packages/shared packages/shared/
COPY tsconfig.base.json ./
EXPOSE 3001
CMD ["pnpm", "--filter", "@insight/api", "dev"]

# ─── production ────────────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nestjs && \
    chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/api/v1/health || exit 1
CMD ["node", "apps/api/dist/main.js"]
