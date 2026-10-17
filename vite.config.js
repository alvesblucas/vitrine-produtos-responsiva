import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // O GitHub Pages publica o site na subpasta /<nome-do-repositório>/.
  base: '/vitrine-produtos-responsiva/',
})
