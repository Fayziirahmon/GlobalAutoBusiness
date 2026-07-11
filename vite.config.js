import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Frontend'dagi /api so'rovlarini backend (Express) serverga yo'naltiradi.
      // Backend 5000-portda ishlaydi (server/server.ts).
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
