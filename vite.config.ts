import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: process.cwd(),
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 🛠️ PERBAIKAN UTAMA: Menggunakan rollupOptions standar untuk stabilitas Vercel
  build: {
    minify: true, // Mengaktifkan kompresi kode maksimal
    sourcemap: false, // Matikan sourcemap untuk mencegah kegagalan visual node sync di Vercel
    rollupOptions: {
      // ✅ Menggunakan Rollup standar (bukan rolldownOptions)
      output: {
        manualChunks(id) {
          // Memisahkan otomatis seluruh library node_modules ke file 'vendor.js'
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
