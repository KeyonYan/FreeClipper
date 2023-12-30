import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: ['src/client/index.ts'],
      fileName: 'client',
      name: 'vueInspectorClient',
    },
  },
})
