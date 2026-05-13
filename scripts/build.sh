#!/usr/bin/env bash
# Build completo de produção
set -euo pipefail

echo "→ Limpando builds anteriores..."
rm -rf apps/api/dist apps/web/dist packages/*/dist

echo "→ Build de packages compartilhados..."
pnpm --filter @insight/shared build
pnpm --filter @insight/ui build

echo "→ Build da API..."
pnpm --filter @insight/api build

echo "→ Build do Web..."
pnpm --filter @insight/web build

echo "✓ Build completo. Artefatos em apps/*/dist e packages/*/dist"
