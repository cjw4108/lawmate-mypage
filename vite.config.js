import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // 아까 에러 났던 부분 수정 완료!
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
        // [핵심] Sass의 모든 잔소리(Deprecation)를 조용하게 만듭니다.
        silenceDeprecations: [
          'import',
          'color-functions',
          'global-builtin',
          'slash-div', // 지금 뜨고 있는 슬래시(/) 경고 차단!
        ],
      },
    },
  },
})
