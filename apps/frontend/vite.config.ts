import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para el frontend
// Decidí agregar open: '/login' para ir directo a login
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: '/login', // Abre navegador automáticamente en http://localhost:3000/login
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
