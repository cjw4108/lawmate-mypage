<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <edit-profile-form />
        </div>
        <div class="col-md-4">
          <user-card />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * [Vue 3 번역본]
 * 1. export default 대신 <script setup>을 사용합니다.
 * 2. 컴포넌트를 import만 하면 바로 템플릿에서 쓸 수 있습니다. (따로 등록 안 해도 됨!)
 */
import EditProfileForm from '@/pages/UserProfile/EditProfileForm.vue'
import UserCard from '@/pages/UserProfile/UserCard.vue'
</script>

<style scoped>
/* 템플릿 전용 스타일이 있다면 여기에 추가하세요 */
</style>
