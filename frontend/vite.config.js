import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            if (
              id.endsWith('EventForm.jsx') ||
              id.includes('/src/components/admin/EventForm.jsx') ||
              id.includes('\\src\\components\\admin\\EventForm.jsx')
            ) {
              return 'event-form'
            }
            return
          }

          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
            return 'react-core'
          }
          if (id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'motion-icons'
          }
          if (id.includes('@radix-ui') || id.includes('embla-carousel-react') || id.includes('vaul')) {
            return 'ui-kit'
          }
          if (id.includes('recharts') || id.includes('date-fns')) {
            return 'analytics'
          }
          if (id.includes('@tiptap') || id.includes('prosemirror')) {
            return 'editor'
          }
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('qrcode')) {
            return 'documents'
          }
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'maps'
          }
          if (id.includes('@mui')) {
            return 'mui'
          }
          if (id.includes('@vercel')) {
            return 'vercel'
          }

          if (
            id.includes('react-hook-form') ||
            id.includes('@hookform') ||
            id.includes('zod')
          ) {
            return 'forms'
          }

          return 'vendor'
        }
      }
    }
  }
})
