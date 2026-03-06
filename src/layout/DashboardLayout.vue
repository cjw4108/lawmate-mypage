<template>
  <div class="wrapper">
    <side-bar>
      <template #content>
        <mobile-menu></mobile-menu>
      </template>

      <sidebar-link to="/clients">
        <i class="nc-icon nc-badge"></i>
        <p>고객 관리 대시보드</p>
      </sidebar-link>

      <sidebar-link to="/history">
        <i class="nc-icon nc-chat-round"></i>
        <p>상담 승인 대기</p>
      </sidebar-link>

      <sidebar-link to="/admin/schedule">
        <i class="nc-icon nc-watch-time"></i>
        <p>상담 및 재판 일정</p>
      </sidebar-link>

      <sidebar-link to="/mypage">
        <i class="nc-icon nc-circle-09"></i>
        <p>내 정보 관리</p>
      </sidebar-link>

      <sidebar-link to="/documents">
        <i class="nc-icon nc-notes"></i>
        <p>법률 문서 양식</p>
      </sidebar-link>

      <sidebar-link to="/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>알림 센터</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import MobileMenu from './MobileMenu.vue'

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      // Vue 3에서도 전역 플러그인이 잘 등록되었다면 그대로 작동합니다.
      if (this.$sidebar && this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    },
  },
}
</script>
