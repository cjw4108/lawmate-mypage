import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'slash-div'],
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../IdeaProjects/LawMate/src/main/resources/static/js/vue-app'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
