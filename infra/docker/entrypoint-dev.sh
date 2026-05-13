#!/bin/sh
set -e
cd /app

# Build: `deps` já corre `pnpm install`. Aqui repetimos de forma idempotente
# para alinhar node_modules quando mudam package.json no host ou após binds.
if [ "${SKIP_PNPM_INSTALL:-0}" != "1" ]; then
  echo "[insight-dev] pnpm install --prod=false"
  pnpm install --prod=false
fi

exec "$@"
