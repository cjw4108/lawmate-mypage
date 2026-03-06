<template>
  <card class="card-user">
    <template v-slot:image>
      <div
        style="width: 100%; height: 150px; background: linear-gradient(to right, #7474bf, #348ac7)"
      ></div>
    </template>

    <div class="author">
      <a href="#">
        <div
          class="avatar border-gray"
          style="
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto;
            width: 124px;
            height: 124px;
            border-radius: 50%;
          "
        >
          👤
        </div>

        <h4 class="title">
          사용자 이름<br />
          <small>lawmate_user</small>
        </h4>
      </a>
    </div>

    <p class="description text-center">
      "LawMate에 오신 것을 환영합니다! <br />
      여기에 본인의 간단한 소개글을 <br />
      작성할 수 있습니다."
    </p>

    <template v-slot:footer>
      <div class="text-center d-flex justify-content-center">
        <button class="btn btn-simple"><i class="fa fa-facebook-square"></i></button>
        <button class="btn btn-simple"><i class="fa fa-twitter"></i></button>
        <button class="btn btn-simple"><i class="fa fa-google-plus-square"></i></button>
      </div>
    </template>
  </card>
</template>

<script setup>

import { ref } from 'vue'
import Card from '@/components/Cards/Card.vue'

const details = ref([
  { title: '12', subTitle: 'Files' },
  { title: '2GB', subTitle: 'Used' },
  { title: '24,6$', subTitle: 'Spent' },
])

const getClasses = (index) => {
  const remainder = index % 3
  if (remainder === 0) return 'col-md-3 col-md-offset-1'
  if (remainder === 2) return 'col-md-4'
  return 'col-md-3'
}
</script>

<style scoped>
.card-user .avatar {
  width: 124px;
  height: 124px;
  border: 5px solid #ffffff;
  position: relative;
  margin-bottom: 15px;
}
</style>
