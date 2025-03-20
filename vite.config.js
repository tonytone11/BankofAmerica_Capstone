import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // In vite.config.js
  server: {
    proxy: {
      '/football-api': {
        target: 'https://api-football-v1.p.rapidapi.com/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/football-api/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: false
  }
});