import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  // 🪐 補正殻：GitHub PagesのURL（リポジトリ名）にベースパスを完全吸着させる
  base: process.env.NODE_ENV === 'production' ? '/3D-pocketbell-deep/' : '/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
})
