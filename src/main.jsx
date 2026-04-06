import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ── PWA: Register Service Worker ──────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = import.meta.env.BASE_URL + 'service-worker.js'
    navigator.serviceWorker
      .register(swPath, { scope: import.meta.env.BASE_URL })
      .then((reg) => console.log('[SW] Registered, scope:', reg.scope))
      .catch((err) => console.warn('[SW] Registration failed:', err))
  })
}

// ── PWA: Capture install prompt (beforeinstallprompt) ─────────────────────────
// Stored on window so any component can trigger it
window.__pwaInstallPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaInstallPrompt = e
  // Dispatch custom event so components can react
  window.dispatchEvent(new CustomEvent('pwa-installable'))
})

