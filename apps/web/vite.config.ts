import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
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
          target: env.VITE_API_BASE_URL?.replace('/api/v1', '') ?? 'http://localhost:3002',
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
