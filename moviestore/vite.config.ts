import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { configDotenv } from 'dotenv'

configDotenv({ path: path.resolve(__dirname, '../../.env')})

const target = process.env.API_TARGET ?? 'http://localhost:5000'
console.log('API TARGET:', target)

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@hugeicons/core-free-icons"]
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: ['..']
    },
    proxy: {
      '/api': {
        // target: target,
        target: 'http://backend:5000',
        changeOrigin: true
      }
    }
  }
})

