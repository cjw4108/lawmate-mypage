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
    if (fs.existsSync(path.dirname(p))) return p
  }

  return candidates[2]
}

const targetPath = getTargetPath()
console.log('🚀 현재 감지된 빌드 경로:', targetPath)

export default defineConfig({
  base: '/js/vue-app/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 🚀 아래 server 설정을 추가하세요!
  server: {
    proxy: {
      // 1. 일반 API 요청 프록시
      '/api': {
        target: 'https://cityless-lapsible-marianna.ngrok-free.dev',
        changeOrigin: true,
        secure: false, // ngrok의 https를 허용하기 위해 false
      },
      // 2. 웹소켓(SockJS) 요청 프록시 (채팅용)
      '/ws-stomp': {
        target: 'https://cityless-lapsible-marianna.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        ws: true // 웹소켓 연결 허용
      }
    }
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
