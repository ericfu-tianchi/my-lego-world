import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: { target: 'es2022', chunkSizeWarningLimit: 4000, rollupOptions: { input: mode === 'single' ? { main: 'index.html' } : { main: 'index.html', catalog: 'catalog.html' } } },
  worker: { format: 'iife' },
}));
