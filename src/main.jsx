import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts: no network round-trip on startup and they work offline.
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/outfit/wght.css'
import './index.css'
import { i18nReady } from './i18n'
import App from './App'

// Render once the active language is loaded so there's no flash of raw keys.
await i18nReady

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
