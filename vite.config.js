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
})

