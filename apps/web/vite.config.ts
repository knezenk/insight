import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const raw = loadEnv(mode, process.cwd(), '');
  const viteApiBase = env.VITE_API_BASE_URL || '/api/v1';
  // Browser: URL relativa (/api/v1) = mesmo host → sem CORS. O proxy encaminha para a API.
  // Docker: defina API_PROXY_TARGET=http://api:3002 no compose (nome do serviço na rede).
  const apiProxyTarget =
    raw.API_PROXY_TARGET?.trim() ||
    (viteApiBase.startsWith('http')
      ? viteApiBase.replace(/\/api\/v1\/?$/, '')
      : 'http://127.0.0.1:3002');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@insight/shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@insight/ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      allowedHosts: ['insight.iclipping.com.br'],
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'data-vendor': ['@tanstack/react-query', 'axios', 'zustand'],
            'chart-vendor': ['recharts'],
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
            ],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      coverage: { reporter: ['text', 'lcov', 'html'] },
    },
  };
});
