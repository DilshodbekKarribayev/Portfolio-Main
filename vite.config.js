import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Portfolio-Main/' : '/',
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          if (id.includes('motion')) return 'motion-vendor'
          if (id.includes('gsap')) return 'gsap-vendor'
          if (id.includes('lucide-react')) return 'icons-vendor'
          if (id.includes('cobe') || id.includes('react-clock')) return 'ui-vendor'
          return 'vendor'
        },
      },
    },
  },
})
