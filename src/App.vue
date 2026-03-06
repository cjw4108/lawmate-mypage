<template>
  <div :class="{'nav-open': $sidebar && $sidebar.showSidebar}">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  // 알림 애니메이션 관련 스타일 (Vue 3 명칭 반영)
  .vue-notifyjs.notifications {
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;
    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }
    .list-enter-from { // Vue 2의 .list-enter에서 변경
      opacity: 0;
      transform: scale(1.1);
    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }
</style>