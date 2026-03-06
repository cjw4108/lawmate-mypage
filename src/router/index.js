import { createRouter, createWebHistory } from 'vue-router'
import MyPageView from '../views/MyPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // [추가] 처음 주소로 들어오면 바로 /mypage로 보내버립니다!
    {
      path: '/',
      redirect: '/mypage',
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPageView,
    },
  ],
})

export default router
