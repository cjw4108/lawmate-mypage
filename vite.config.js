import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getTargetPath() {
  const candidates = [
    path.resolve(__dirname, '../../LawMate/src/main/resources/static/js/vue-app'),
    path.resolve(__dirname, '../IdeaProjects/LawMate/src/main/resources/static/js/vue-app'),
    path.resolve(__dirname, '../LawMate/src/main/resources/static/js/vue-app'),
    path.resolve(__dirname, '../src/main/resources/static/js/vue-app'),
  ]

  for (const p of candidates) {
    console.log(`🔍 폴더 체크 중: ${path.dirname(p)} -> 존재여부: ${fs.existsSync(path.dirname(p))}`);
    if (fs.existsSync(path.dirname(p))) return p
  }

  return candidates[2]
}

const targetPath = getTargetPath()
console.log('🚀 현재 감지된 빌드 경로:', targetPath)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: targetPath,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
