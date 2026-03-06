<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm" style="height: 70px;">
    <div class="container-xl d-flex align-items-center justify-content-between">
      <router-link to="/home" class="navbar-brand d-flex align-items-center me-auto">
        <img src="/src/assets/img/logo.png" alt="LawMate" style="max-height: 35px;">
      </router-link>

      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <li class="nav-item" style="margin-right: 20px;"><router-link to="/legal-dictionary" class="nav-link text-dark">법률백과</router-link></li>
          <li class="nav-item" style="margin-right: 20px;"><router-link to="/category" class="nav-link text-dark">가이드</router-link></li>
          <li class="nav-item" style="margin-right: 20px;"><router-link to="/qna/list" class="nav-link text-dark">Q&A</router-link></li>
          <li class="nav-item" style="margin-right: 20px;"><router-link to="/consult/consultList" class="nav-link text-dark">상담신청</router-link></li>
          <li class="nav-item" style="margin-right: 20px;"><router-link to="/docs" class="nav-link text-dark">서류양식</router-link></li>
          <li class="nav-item" style="margin-right: 20px;"><router-link to="/ai/consult" class="nav-link text-dark">AI 상담</router-link></li>
        </ul>

        <ul class="navbar-nav ml-auto align-items-center">
          <li class="nav-item" style="margin-right: 30px; position: relative;">
            <router-link to="/cart" title="내 서류함" style="text-decoration: none;">
              <i class="bi bi-folder2" style="font-size: 28px; color: #1e293b;"></i>
              <span id="cartCount" style="position: absolute; top: 0px; right: -5px; background: #ef4444; color: white; border-radius: 10px; min-width: 18px; height: 18px; padding: 0 4px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 600; line-height: 1;">0</span>
            </router-link>
          </li>

          <template v-if="!loginUser">
            <li class="nav-item">
              <router-link to="/login" class="btn btn-primary rounded-pill px-4 text-white">로그인</router-link>
            </li>
          </template>

          <base-dropdown v-else tag="li">
            <template #title>
              <a href="#" class="btn btn-primary rounded-pill px-4 text-white">
                {{ loginUser.userId }}님
                <i class="bi bi-chevron-down ms-1"></i>
              </a>
            </template>

            <template v-if="loginUser.role === 'ROLE_USER'">
              <router-link class="dropdown-item" to="/mypage">마이페이지</router-link>
              <a class="dropdown-item" href="#">상담 내역</a>
              <a class="dropdown-item" href="#">문서 관리</a>
            </template>

            <template v-if="loginUser.role === 'ROLE_LAWYER'">
              <router-link class="dropdown-item" to="/mypage">변호사 마이페이지</router-link>
            </template>

            <template v-if="loginUser.role === 'ROLE_ADMIN'">
              <router-link class="dropdown-item text-danger fw-bold" to="/admin/main">관리자 페이지</router-link>
            </template>

            <div class="divider"></div>
            <a class="dropdown-item text-danger" href="#" @click.prevent="logout">로그아웃</a>
          </base-dropdown>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      loginUser: null // 데이터 연동 전 임시 상태
    }
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
    },
    logout() {
      console.log("Logout triggered");
    }
  }
}
</script>

<style>
.navbar-nav .nav-link {
  color: #1e293b !important;
}
.btn-primary {
  background-color: #0d6efd;
  border: none;
}
</style>
