import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    emptyOutDir: false,
  },
})
