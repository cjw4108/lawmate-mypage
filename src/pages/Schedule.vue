<script setup>
import { ref, reactive, watch } from 'vue'
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'
import 'temporal-polyfill/global'

const isModalOpen = ref(false)
const eventsService = createEventsServicePlugin()

const scheduleData = reactive({
  title: '',
  start: '',
  end: '',
  content: '',
  client_name: '',
  status: '대기',
  color: '#4F46E5',
  all_day: false,
})

watch(() => scheduleData.all_day, (val) => {
  if (val) {
    scheduleData.start = scheduleData.start.split('T')[0]
    scheduleData.end = scheduleData.end.split('T')[0]
  } else {
    scheduleData.start = `${scheduleData.start}T09:00`
    scheduleData.end = `${scheduleData.end}T10:00`
  }
})

const calendarApp = createCalendar({
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  events: [],
  plugins: [eventsService],
  callbacks: {
    onClickDate(date) {
      Object.assign(scheduleData, {
        title: '',
        content: '',
        client_name: '',
        status: '대기',
        color: '#4F46E5',
        all_day: false,
        start: `${date}T09:00`,
        end: `${date}T10:00`,
      })
      isModalOpen.value = true
    },
  },
})

const handleSave = async (payload) => {
  try {
    const body = {
      ...payload,
      all_day: scheduleData.all_day ? 'Y' : 'N',
      color: scheduleData.color,
    }
    console.log('저장될 데이터:', body)
    // await axios.post('/api/schedule', body)

    eventsService.add({
      id: Date.now(),
      title: scheduleData.title,
      start: scheduleData.start,
      end: scheduleData.end,
      calendarId: 'default',
    })

    alert('일정이 성공적으로 등록되었습니다.')
    isModalOpen.value = false
  } catch (error) {
    console.error('저장 실패:', error)
  }
}
</script>

<template>
  <div class="calendar-container">
    <ScheduleXCalendar :calendar-app="calendarApp" />

    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-content">

        <div class="modal-header">
          <div class="header-left">
            <span class="color-dot" :style="{ background: scheduleData.color }"></span>
            <h3>새 일정 등록</h3>
          </div>
          <button @click="isModalOpen = false" class="close-btn">&times;</button>
        </div>

        <FormKit type="form" submit-label="일정 저장" @submit="handleSave">

          <!-- 제목 -->
          <FormKit
            type="text"
            name="title"
            label="일정 제목"
            v-model="scheduleData.title"
            validation="required"
            placeholder="일정 제목을 입력하세요"
          />

          <!-- 의뢰인 + 상태 -->
          <div class="two-col-row">
            <FormKit
              type="text"
              name="client_name"
              label="의뢰인"
              v-model="scheduleData.client_name"
              placeholder="의뢰인 이름 (선택)"
            />
            <FormKit
              type="select"
              name="status"
              label="상태"
              v-model="scheduleData.status"
              :options="[
                { label: '대기', value: '대기' },
                { label: '확정', value: '확정' },
                { label: '취소', value: '취소' },
              ]"
            />
          </div>

          <!-- 종일 여부 -->
          <div class="allday-row">
            <label class="allday-label">
              <input type="checkbox" v-model="scheduleData.all_day" />
              하루 종일
            </label>
          </div>

          <!-- 시작 -->
          <FormKit
            :type="scheduleData.all_day ? 'date' : 'datetime-local'"
            name="start"
            label="시작"
            v-model="scheduleData.start"
            validation="required"
          />

          <!-- 종료 -->
          <FormKit
            :type="scheduleData.all_day ? 'date' : 'datetime-local'"
            name="end"
            label="종료"
            v-model="scheduleData.end"
            validation="required"
          />

          <!-- 색상 -->
          <div class="color-picker-wrap">
            <label class="color-label">색상</label>
            <div class="color-input-row">
              <input
                type="color"
                v-model="scheduleData.color"
                class="color-palette"
              />
              <span class="color-value">{{ scheduleData.color }}</span>
            </div>
          </div>

          <!-- 상세 내용 -->
          <FormKit
            type="textarea"
            name="content"
            label="상세 내용"
            v-model="scheduleData.content"
            placeholder="추가적인 메모를 입력하세요"
            :rows="3"
          />

        </FormKit>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sx-vue-calendar-wrapper {
  height: 700px;
  max-width: 100%;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: block;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  width: 540px;
  max-width: 95%;
  max-height: 90vh;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  transition: background 0.2s;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e1e2f;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
}

.two-col-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.allday-row {
  margin-bottom: 1rem;
}

.allday-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #444;
  cursor: pointer;
}

.color-picker-wrap {
  margin-bottom: 1rem;
}

.color-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.color-input-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.color-palette {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 2px;
  background: none;
}

.color-value {
  font-size: 0.9rem;
  color: #555;
  font-family: monospace;
}

:deep(.formkit-form) {
  display: block !important;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

:deep(.formkit-outer) {
  display: block !important;
  width: 100%;
  min-width: 0;
  margin-bottom: 1rem;
  padding: 0;
}

:deep(.formkit-input),
:deep(.formkit-select) {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.formkit-submit) {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
}
</style>
