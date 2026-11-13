import https from 'node:https'
import dns from 'node:dns'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { APPROVED_INDEXABLE_ROUTES, EXCLUDED_FROM_SITEMAP } from './src/routes/routeManifest.js'

dns.setDefaultResultOrder('ipv4first')
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch (_) {}

const proxyAgent = new https.Agent({
  keepAlive: true,
  lookup: (hostname, options, callback) => {
    const cb = typeof options === 'function' ? options : callback
    const opts = typeof options === 'object' ? options : {}
    dns.resolve4(hostname, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        if (opts.all) {
          return cb(null, addresses.map((a) => ({ address: a, family: 4 })))
        }
        return cb(null, addresses[0], 4)
      }
      dns.lookup(hostname, opts, cb)
    })
  }
})

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
        secure: true,
        agent: proxyAgent,
        rewrite: (path) => path.replace(/^\/supabase-api/, '')
      }
    }
  }
})
