// uno.config.ts
import { defineConfig, presetUno } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),

  ],
  transformers: [
    transformerDirectives(),
  ],
})
