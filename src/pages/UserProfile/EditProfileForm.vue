<template>
  <div class="profile-page">

    <!-- 페이지 타이틀 -->
    <div class="page-header">
      <h2 class="page-title">내 정보 관리</h2>
      <p class="page-desc">회원 정보를 확인하고 수정하세요</p>
    </div>

    <div class="form-card">

      <!-- 섹션: 기본 계정 정보 -->
      <div class="section-block">
        <div class="section-label">기본 정보</div>
        <div class="fields-grid col2">
          <div class="field-item">
            <label class="field-label">아이디</label>
            <input class="field-input" type="text" placeholder="아이디" v-model="user.userId" disabled />
          </div>
          <div class="field-item">
            <label class="field-label">이름</label>
            <input class="field-input" type="text" placeholder="이름" v-model="user.name" />
          </div>
          <div class="field-item">
            <label class="field-label">이메일</label>
            <input class="field-input" type="email" placeholder="example@email.com" v-model="user.email" />
          </div>
          <div class="field-item">
            <label class="field-label">전화번호</label>
            <input class="field-input" type="text" placeholder="010-0000-0000" v-model="user.phone" />
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- 섹션: 비밀번호 변경 -->
      <div class="section-block">
        <div class="section-label">비밀번호 변경</div>
        <div class="fields-grid col2">
          <div class="field-item">
            <label class="field-label">새 비밀번호</label>
            <input class="field-input" type="password" placeholder="새 비밀번호 입력" v-model="user.password" />
          </div>
          <div class="field-item">
            <label class="field-label">비밀번호 확인</label>
            <input class="field-input" type="password" placeholder="비밀번호 재입력" v-model="passwordConfirm" />
          </div>
        </div>
      </div>

      <!-- 변호사 추가 정보 -->
      <template v-if="currentUser.role === 'ROLE_LAWYER'">
        <div class="section-divider"></div>
        <div class="section-block">
          <div class="section-label">변호사 정보</div>
          <div class="fields-grid col2">
            <div class="field-item">
              <label class="field-label">전문 분야</label>
              <input class="field-input" type="text" placeholder="예: 민사, 형사, 이혼" v-model="user.specialty" />
            </div>
            <div class="field-item">
              <label class="field-label">전화번호</label>
              <input class="field-input" type="text" placeholder="사무소 전화번호" v-model="user.phone" />
            </div>
            <div class="field-item full">
              <label class="field-label">소개</label>
              <textarea class="field-textarea" placeholder="변호사 소개를 입력하세요" v-model="user.introduction" rows="4"></textarea>
            </div>
          </div>
        </div>
      </template>

      <!-- 저장 버튼 -->
      <div class="form-footer">
        <button class="btn-save" @click.prevent="updateProfile">정보 수정하기</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const currentUser = reactive({
  role: '',
  userId: '',
  name: '',
})

onMounted(() => {
  if (window.LAW_MATE_USER) {
    Object.assign(currentUser, window.LAW_MATE_USER)
    user.value.userId = currentUser.userId
    user.value.name = currentUser.name
  }
})

const user = ref({
  userId: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  // 변호사 전용
  specialty: '',
  introduction: '',
})

const passwordConfirm = ref('')

const updateProfile = () => {
  if (user.value.password && user.value.password !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  // axios.put('/api/user/profile', user.value) 로 교체 예정
  alert('수정된 정보: ' + JSON.stringify(user.value, null, 2))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.profile-page {
  font-family: 'Noto Sans KR', sans-serif;
  padding: 2rem 2.5rem;
  min-height: 100%;
  background: #f7f7f8;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.3rem;
  letter-spacing: -0.5px;
}

.page-desc {
  font-size: 0.88rem;
  color: #6b7280;
  margin: 0;
}

/* 카드 */
.form-card {
  background: #fff;
  border-radius: 14px;
  padding: 2rem 2.5rem 2.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

/* 섹션 */
.section-block {
  padding: 1.5rem 0;
}

.section-block:first-child {
  padding-top: 0;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 1.1rem;
}

.section-divider {
  height: 1px;
  background: #f3f4f6;
}

/* 그리드 */
.fields-grid {
  display: grid;
  gap: 1.25rem;
}

.fields-grid.col2 {
  grid-template-columns: 1fr 1fr;
}

/* 필드 */
.field-item {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-item.full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.field-input {
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: 'Noto Sans KR', sans-serif;
  color: #111827;
  background: #fafafa;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.field-input:focus {
  border-color: #111827;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(17,24,39,0.07);
}

.field-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.field-textarea {
  padding: 12px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: 'Noto Sans KR', sans-serif;
  color: #111827;
  background: #fafafa;
  outline: none;
  resize: vertical;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  line-height: 1.6;
}

.field-textarea:focus {
  border-color: #111827;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(17,24,39,0.07);
}

/* 버튼 */
.form-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn-save {
  padding: 0 2rem;
  height: 46px;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  letter-spacing: -0.2px;
  transition: background 0.18s, transform 0.15s;
}

.btn-save:hover {
  background: #1f2937;
  transform: translateY(-1px);
}

.btn-save:active {
  transform: translateY(0);
  background: #030712;
}

@media (max-width: 640px) {
  .profile-page { padding: 1rem; }
  .form-card { padding: 1.5rem; }
  .fields-grid.col2 { grid-template-columns: 1fr; }
}
</style>
