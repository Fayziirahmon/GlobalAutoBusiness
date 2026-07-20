import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The project lives in a OneDrive folder, which locks files while syncing.
    // Vite's watcher crashes (EBUSY) on locked files such as the Google Search
    // Console verification html, so we exclude those from watching (they are
    // still served normally from /public).
    watch: {
      ignored: ['**/google*.html', '**/*.MP4', '**/*.mp4'],
    },
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
