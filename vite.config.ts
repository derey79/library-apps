import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: process.cwd(), // 💡 Force runtime engine root evaluation
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
  // 🧠 TAMBAHKAN BLOK BUILD INI DI SINI
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20000, // Mulai memecah otomatis untuk file di atas 20KB
          groups: [
            {
              name: 'vendor',
              test: /node_modules/, // Memisahkan seluruh library pihak ketiga ke chunk terpisah
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
