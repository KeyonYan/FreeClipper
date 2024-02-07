import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json')
  const pkg = readJsonFile('package.json')
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
    }),
  ],
  resolve: {
    alias: {
      // In dev mode, make sure fast refresh works
      '/@react-refresh': path.resolve(
        'node_modules/@vitejs/plugin-react-swc/refresh-runtime.js',
      ),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/notionapi': {
        target: 'https://api.notion.com/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/notionapi/, ''),
      },
    },
  },
})
