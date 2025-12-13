import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // pdfjs-dist uses top-level await
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
})
