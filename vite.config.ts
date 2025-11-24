import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
      events: 'events'
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  }
})
