import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site under /Pulli/. The data and components use
// absolute /img and /catalogues paths, so prefix them with the base at build.
const prefixAssets = (base) => ({
  name: 'prefix-assets',
  transform(code, id) {
    if (base === '/' || !id.includes('/src/')) return
    return code.replace(/(["'`])\/(img|catalogues)\//g, `$1${base}$2/`)
  },
})

export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/Pulli/' : '/'
  return {
    base,
    plugins: [react(), prefixAssets(base)],
  }
})
