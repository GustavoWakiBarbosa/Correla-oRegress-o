import path from 'path'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'
import Vue from '@vitejs/plugin-vue'
import pugPlugin from 'vite-plugin-pug'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    Pages(),
    Layouts(),
    pugPlugin(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: ''
        })
      ],
      dts: 'src/components.d.ts'
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        'vee-validate',
        {
          'vue-screen': [
            'useGrid'
          ]
        }
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3'
    })
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
    ]
  }
})
