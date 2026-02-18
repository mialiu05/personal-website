import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
    server: {
      port: 5173,
      host: '0.0.0.0',
      strictPort: false,
      open: true,
    },
    preview: {
      port: 5173,
      strictPort: false,
      open: true,
    },
    plugins: [
      react(),
      compression({ algorithm: 'gzip' }),
      compression({ algorithm: 'brotliCompress', ext: '.br' }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
});
