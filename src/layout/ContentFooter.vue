<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/mypage'}">LawMate</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; 2026
        <i class="fa fa-heart heart"></i> by
        LawMate Team.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ContentFooter'
}
</script>

<style>
</style>