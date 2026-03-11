<template>
  <div class="wrapper">
    <side-bar title="" logo="">
      <template v-if="userRole === 'ROLE_LAWYER'">
        <sidebar-link to="/clients">
          <i class="nc-icon nc-badge"></i>
          <p>고객 관리 대시보드</p>
        </sidebar-link>
        <sidebar-link to="/history">
          <i class="nc-icon nc-chat-round"></i>
          <p>상담 승인 대기</p>
        </sidebar-link>
        <sidebar-link to="/schedule">
          <i class="nc-icon nc-watch-time"></i>
          <p>일정 관리</p>
        </sidebar-link>
      </template>

      <sidebar-link to="/mypage">
        <i class="nc-icon nc-circle-09"></i>
        <p>내 정보 관리</p>
      </sidebar-link>
      <sidebar-link to="/documents">
        <i class="nc-icon nc-notes"></i>
        <p>내 서류함</p>
      </sidebar-link>
      <sidebar-link to="/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>고객 센터</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <dashboard-content @click="toggleSidebar"></dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>

<script>
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'

export default {
  components: {
    ContentFooter,
    DashboardContent,
  },
  data() {
    return {
      // 💡 ROLE_USER를 기본값으로 설정
      userRole: window.LAW_MATE_USER?.role || 'ROLE_USER',
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar?.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    },
  },
}
</script>

<style scoped>
/* 💡 JSP 헤더와 디자인이 섞이지 않도록 사이드바의 형태를 강제로 고정합니다 */
.wrapper {
  margin-top: 70px; /* JSP 헤더 높이만큼 여백 */
}

/* 사이드바 배경과 위치 강제 지정 */
:deep(.sidebar) {
  top: 70px !important;
  background-color: #1f2937 !important; /* 사이드바 본래의 어두운 색상 */
  display: block !important;
  z-index: 1001 !important;
}

/* 사이드바 안의 글자가 리스트처럼 보이지 않게 점 제거 */
:deep(.sidebar-wrapper ul) {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* 본문 영역이 사이드바에 가려지지 않게 여백 부여 */
.main-panel {
  margin-left: 260px; /* 사이드바 기본 너비 */
  min-height: calc(100vh - 70px);
  background-color: #f7f7f8;
}

/* 모바일 메뉴 관련 유령 텍스트 숨김 */
:deep(.nav-mobile-menu),
:deep(.sidebar .logo) {
  display: none !important;
}
</style>
