import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer/', // To handle buffer polyfills
    },
  },
  define: {
    global: 'globalThis', // Fixes global issues
  },
  optimizeDeps: {
    include: ['@lit-protocol/lit-node-client', '@lit-protocol/constants'],
  },
});
