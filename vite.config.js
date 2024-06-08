import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'

import {
  ElementUiResolver
} from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    Components({
      version: 2.7,
      directives: false,
      resolvers: [
        ElementUiResolver()
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  envDir: fileURLToPath(new URL('./env', import.meta.url))
})

// 
