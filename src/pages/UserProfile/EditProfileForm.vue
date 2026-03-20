<template>
  <div class="profile-page">
    <div class="form-card">

      <!-- 카드 헤더 -->
      <div class="card-header-block">
        <h2 class="page-title">내 정보 관리</h2>
        <p class="page-desc">회원 정보를 확인하고 수정하세요</p>
      </div>

      <div class="section-divider"></div>

      <!-- 로딩 -->
      <div v-if="loading" class="loading-state">불러오는 중...</div>

      <template v-else>

        <!-- 섹션: 기본 정보 -->
        <div class="section-block">
          <div class="section-label">기본 정보</div>
          <div class="fields-grid col2">
            <div class="field-item">
              <label class="field-label">아이디</label>
              <input class="field-input" type="text" v-model="user.userId" disabled />
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
          <div class="section-label">비밀번호 변경 <span class="optional">선택사항 — 변경 시에만 입력</span></div>
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
              <div class="field-item full">
                <label class="field-label">소개</label>
                <textarea class="field-textarea" placeholder="변호사 소개를 입력하세요" v-model="user.introduction" rows="4"></textarea>
              </div>
            </div>
          </div>
        </template>

        <!-- 에러 메시지 -->
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <!-- 저장 버튼 -->
        <div class="form-footer">
          <button class="btn-save" @click.prevent="updateProfile" :disabled="saving">
            {{ saving ? '저장 중...' : '정보 수정하기' }}
          </button>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

const currentUser = reactive({ role: '', userId: '', name: '' })
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const passwordConfirm = ref('')

const user = ref({
  userId: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  specialty: '',
  introduction: '',
})

onMounted(async () => {
  if (window.LAW_MATE_USER) {
    Object.assign(currentUser, window.LAW_MATE_USER)
  }
  try {
    const res = await axios.get('/api/user/profile')
    const data = res.data
    user.value.userId       = data.userId   || currentUser.userId
    user.value.name         = data.name     || ''
    user.value.email        = data.email    || ''
    user.value.phone        = data.phone    || ''
    user.value.specialty    = data.specialty    || ''
    user.value.introduction = data.introduction || ''
  } catch (e) {
    console.error('프로필 로드 실패:', e)
    user.value.userId = currentUser.userId
    user.value.name   = currentUser.name
  } finally {
    loading.value = false
  }
})

const updateProfile = async () => {
  errorMsg.value = ''
  if (user.value.password && user.value.password !== passwordConfirm.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  saving.value = true
  try {
    const payload = { ...user.value }
    if (!payload.password) delete payload.password
    await axios.put('/api/user/profile', payload)
    alert('정보가 수정되었습니다.')
    user.value.password = ''
    passwordConfirm.value = ''
  } catch (e) {
    console.error('수정 실패:', e)
    errorMsg.value = '수정 중 오류가 발생했습니다. 다시 시도해주세요.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.profile-page {
  font-family: 'Noto Sans KR', sans-serif;
  padding: 0;
  background: #f7f7f8;
  min-height: 100%;
}

.form-card {
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  min-height: 100vh;
}

/* 카드 헤더 */
.card-header-block {
  padding: 1.5rem 2rem 1.25rem;
  border-bottom: none;
}

.page-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.2rem;
  letter-spacing: -0.4px;
}

.page-desc {
  font-size: 0.83rem;
  color: #9ca3af;
  margin: 0;
}

/* 섹션 */
.section-block {
  padding: 1.25rem 2rem;
}

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.optional {
  font-size: 0.72rem;
  font-weight: 400;
  color: #d1d5db;
  text-transform: none;
  letter-spacing: 0;
}

.section-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 0;
}

/* 그리드 */
.fields-grid { display: grid; gap: 1rem; }
.fields-grid.col2 { grid-template-columns: 1fr 1fr; }

.field-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-item.full { grid-column: 1 / -1; }

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.field-input {
  height: 42px;
  padding: 0 13px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Noto Sans KR', sans-serif;
  color: #111827;
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
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
  padding: 11px 13px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Noto Sans KR', sans-serif;
  color: #111827;
  background: #fafafa;
  outline: none;
  resize: vertical;
  line-height: 1.6;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-textarea:focus {
  border-color: #111827;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(17,24,39,0.07);
}

.error-msg {
  margin: 0 2rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #dc2626;
}

.form-footer {
  padding: 1.25rem 2rem 2rem;
  border-top: 1px solid #f3f4f6;
  margin-top: 0.5rem;
}

.btn-save {
  padding: 0 1.75rem;
  height: 44px;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
}

.btn-save:hover { background: #1f2937; transform: translateY(-1px); }
.btn-save:active { background: #030712; transform: translateY(0); }
.btn-save:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }

.loading-state {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .section-block { padding: 1rem 1.25rem; }
  .fields-grid.col2 { grid-template-columns: 1fr; }
}
</style>
