import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { APPROVED_INDEXABLE_ROUTES, EXCLUDED_FROM_SITEMAP } from './src/routes/routeManifest.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://www.asmaonline.in',
      dynamicRoutes: APPROVED_INDEXABLE_ROUTES.filter(r => r !== '/'),
      exclude: EXCLUDED_FROM_SITEMAP,
      generateRobotsTxt: true,
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin/', '/dashboard']
        }
      ]
    })
  ],
  server: {
    watch: {
      ignored: ['**/src/assets/**']
    },
    proxy: {
      '/supabase-api': {
        target: 'https://cgzztjavrreugujsxlah.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-api/, '')
      }
    }
  }
})
