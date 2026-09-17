import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'

function autoVersionPlugin() {
  return {
    name: 'auto-version-generator',
    buildStart() {
      const versionData = {
        version: Date.now(),
        buildTime: new Date().toISOString(),
      }
      if (!existsSync('./public')) {
        mkdirSync('./public', { recursive: true })
      }
      writeFileSync('./public/version.json', JSON.stringify(versionData, null, 2))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), autoVersionPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
            if (id.includes('swiper') || id.includes('react-icons')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})

