import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import pkg from './package.json' with { type: 'json' }
import editionPlugin from './scripts/edition-plugin.js'

// `vite build` builds the full 18+ edition, `vite build --mode teen` the 13+ store edition (docs/editions.md).
// Unit tests (mode 'test') see the raw, untransformed content of both editions.
export default defineConfig(({ mode }) => {
  const edition = mode === 'teen' ? 'teen' : 'full'
  return {
    plugins: [
      mode !== 'test' && editionPlugin(edition),
      react(),
      // React Compiler memoizes components and hooks automatically – fewer re-renders on slow devices.
      babel({ presets: [reactCompilerPreset()] })
    ],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __EDITION__: JSON.stringify(edition)
    },
    test: {
      include: ['tests/unit/**/*.test.js']
    },
    build: {
      // The app ships inside an evergreen Android/iOS WebView, so no legacy transpilation is needed.
      target: 'es2022',
      cssTarget: 'chrome111'
    }
  }
})
