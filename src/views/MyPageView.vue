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

import EditProfileForm from '@/pages/UserProfile/EditProfileForm.vue'
import UserCard from '@/pages/UserProfile/UserCard.vue'
</script>

<style scoped>

</style>
