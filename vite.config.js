import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://advaitacademy.in', // Replace with actual domain
      dynamicRoutes: [
        '/',
        '/about',
        '/courses',
        '/contact',
        '/gallery',
      ]
    })
  ],
  server: {
    watch: {
      ignored: ['**/src/assets/**']
    }
  }
})
