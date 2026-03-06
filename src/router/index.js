import { createRouter, createWebHistory } from 'vue-router'
// 레이아웃 및 뷰 컴포넌트 임포트
import DashboardLayout from '../layout/DashboardLayout.vue'
import MyPageView from '../views/MyPageView.vue'

// 페이지 컴포넌트 임포트 (경로가 실제 파일 위치와 맞는지 확인 필요)
import Overview from '../pages/Overview.vue'
import UserProfile from '../pages/UserProfile.vue'
import TableList from '../pages/TableList.vue'
import Typography from '../pages/Typography.vue'
import Icons from '../pages/Icons.vue'
import Notifications from '../pages/Notifications.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/mypage', // 접속 시 마이페이지로 자동 이동
    children: [
      {
        path: 'mypage',
        name: 'MyPage',
        component: MyPageView,
      },
      {
        path: 'clients',
        name: 'Clients',
        component: Overview, // 의뢰인 관리 페이지
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: Typography, // 상담 및 재판 일정 (임시)
      },
      {
        path: 'documents',
        name: 'Documents',
        component: Icons, // 법률 문서 양식 (임시)
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications, // 알림 센터
      },
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile,
      },
    ],
  },
  // 404 페이지 설정
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
})

export default router
