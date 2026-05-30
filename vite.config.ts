import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  // 🪐 補正殻：お兄ちゃんの本物のリポジトリ名「3D-pocketbell-deep」に完全固定！
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
