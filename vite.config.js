import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import pkg from './package.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // React Compiler memoizes components and hooks automatically – fewer re-renders on slow devices.
    babel({ presets: [reactCompilerPreset()] })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  test: {
    include: ['tests/unit/**/*.test.js']
  },
  build: {
    // The app ships inside an evergreen Android/iOS WebView, so no legacy transpilation is needed.
    target: 'es2022',
    cssTarget: 'chrome111'
  }
})
