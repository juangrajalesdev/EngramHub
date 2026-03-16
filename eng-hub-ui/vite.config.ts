import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests to avoid CORS errors when developing locally against Engram CLI
      '/api/engram': {
        target: 'http://127.0.0.1:7437',
        changeOrigin: true,
        // Rewrite the path: /api/engram/timeline becomes /timeline
        rewrite: (path) => path.replace(/^\/api\/engram/, ''),
      },
    },
  },
})
