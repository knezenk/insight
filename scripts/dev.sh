#!/usr/bin/env bash
# Setup completo de desenvolvimento
set -euo pipefail

echo "→ Verificando pré-requisitos..."
command -v node >/dev/null 2>&1 || { echo "✗ Node 20+ é obrigatório"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "→ Instalando pnpm..."; npm install -g pnpm@9; }
command -v docker >/dev/null 2>&1 || { echo "✗ Docker é obrigatório (para Redis)"; exit 1; }

echo "→ Instalando dependências..."
pnpm install --frozen-lockfile=false

if [ ! -f .env ]; then
  echo "→ Criando .env a partir de .env.example..."
  cp .env.example .env
fi

echo "→ Subindo Redis..."
docker compose up -d redis

echo "→ Aguardando Redis estar healthy..."
sleep 3

echo "✓ Setup concluído. Execute: pnpm dev"
