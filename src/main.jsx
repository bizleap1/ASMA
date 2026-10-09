import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './context/NotificationContext'

const rootElement = document.getElementById('root')

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

const prerenderRoute = rootElement?.getAttribute('data-route')
const currentPath = typeof window !== 'undefined' ? (window.location.pathname.replace(/\/$/, '') || '/') : '/'
const normalizedPrerender = prerenderRoute ? (prerenderRoute.replace(/\/$/, '') || '/') : null

// Safely hydrate when the prerendered route matches the client URL.
// Fall back to clean createRoot when navigating to client-only routes (e.g. /admin, /dashboard, /login) or when route mismatched.
const canHydrate = Boolean(
  rootElement &&
  rootElement.hasChildNodes() &&
  prerenderRoute &&
  currentPath === normalizedPrerender
)

if (canHydrate) {
  hydrateRoot(rootElement, app)
} else if (rootElement) {
  createRoot(rootElement).render(app)
}
