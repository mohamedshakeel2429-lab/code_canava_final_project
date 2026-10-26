import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set port to 3000 (alternative dev port) with fallback
const PORT = parseInt(process.env.PORT || '3000', 10)

export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
