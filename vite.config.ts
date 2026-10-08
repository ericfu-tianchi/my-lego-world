import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: { target: 'es2022', chunkSizeWarningLimit: 4000, rollupOptions: { input: mode === 'single' ? { main: 'index.html' } : { main: 'index.html', catalog: 'catalog.html' },
    // the baked LDraw geometry is ~67 MB of modules: spread it over six chunks so each stays under Cloudflare Pages' 25 MiB file limit
    output: mode === 'single' ? {} : { manualChunks: (id) => { const m = /src\/parts\/ldraw\/(.+)\.ts$/.exec(id); if (!m) return undefined; let h = 0; for (const ch of m[1]) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return `parts-${h % 6}`; } } } },
  worker: { format: 'iife' },
}));
