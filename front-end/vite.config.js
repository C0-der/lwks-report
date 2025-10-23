import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['react-bootstrap', 'bootstrap'],
          charts: ['recharts'],
          router: ['react-router-dom'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.onrender.com', // Replace with your actual backend URL
        changeOrigin: true,
        secure: false
      }
    }
  }
})