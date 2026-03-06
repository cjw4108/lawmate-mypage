<template>
  <card>
    <template v-slot:header>
      <h4 class="card-title">프로필 수정</h4>
      <p class="card-category">LawMate 회원 정보를 관리하세요.</p>
    </template>

    <form>
      <div class="row">
        <div class="col-md-5">
          <base-input
            type="text"
            label="소속 (기관/법인)"
            :disabled="true"
            placeholder="LawMate"
            v-model="user.organization"
          >
          </base-input>
        </div>
        <div class="col-md-3">
          <base-input type="text" label="아이디" placeholder="Username" v-model="user.username">
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input type="email" label="이메일 주소" placeholder="Email" v-model="user.email">
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="text"
            label="성 (Last Name)"
            placeholder="Last Name"
            v-model="user.lastName"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="이름 (First Name)"
            placeholder="First Name"
            v-model="user.firstName"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <base-input
            type="text"
            label="도로명 주소"
            placeholder="Home Address"
            v-model="user.address"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <base-input type="text" label="도시" placeholder="City" v-model="user.city"> </base-input>
        </div>
        <div class="col-md-4">
          <base-input type="text" label="국가" placeholder="Country" v-model="user.country">
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="number"
            label="우편번호"
            placeholder="ZIP Code"
            v-model="user.postalCode"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label>자기소개</label>
            <textarea
              rows="5"
              class="form-control border-input"
              placeholder="본인에 대한 짧은 소개를 입력해 주세요."
              v-model="user.aboutMe"
            >
            </textarea>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button
          type="submit"
          class="btn btn-info btn-fill float-right"
          @click.prevent="updateProfile"
        >
          정보 수정하기
        </button>
      </div>
      <div class="clearfix"></div>
    </form>
  </card>
</template>

<script setup>
/**
 * [Vue 3 수술 내역]
 * 1. script setup 적용: 코드가 훨씬 직관적으로 변합니다.
 * 2. ref 사용: 데이터 반응성을 확보합니다.
 * 3. 경로 수정: @/ 기호를 사용하여 정확히 참조합니다.
 */
import { ref } from 'vue'
import Card from '@/components/Cards/Card.vue'

// 나중에 Spring API 연결 시 이 객체에 데이터를 담아 보내면 됩니다.
const user = ref({
  organization: 'LawMate',
  username: 'lawmate_user',
  email: '',
  firstName: '',
  lastName: '',
  address: '경기도 수원시...',
  city: 'Suwon',
  country: 'South Korea',
  postalCode: '',
  aboutMe: `안녕하세요! LawMate 서비스를 이용 중인 사용자입니다.`,
})

const updateProfile = () => {
  // 나중에 여기서 axios.put('/api/user', user.value) 식으로 처리하게 됩니다.
  alert('수정된 정보: ' + JSON.stringify(user.value, null, 2))
}
</script>

<style scoped>
/* 입력창 간격 조정 등 필요 시 추가 */
</style>
