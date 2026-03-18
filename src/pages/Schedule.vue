<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

axios.defaults.withCredentials = true

const isModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const selectedEvent = ref(null)
const allSchedules = ref([])
const calendarRef = ref(null)

const scheduleData = reactive({
  title: '',
  start: '',
  end: '',
  content: '',
  client_name: '',
  color: '#4F46E5',
  all_day: false,
})

const editData = reactive({
  scheduleId: null,
  title: '',
  start: '',
  end: '',
  content: '',
  client_name: '',
  color: '#4F46E5',
  all_day: false,
})

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'ko',
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth',
  },
  events: [],
  dateClick(info) {
    Object.assign(scheduleData, {
      title: '',
      content: '',
      client_name: '',
      color: '#4F46E5',
      all_day: false,
      start: info.dateStr + 'T09:00',
      end: info.dateStr + 'T10:00',
    })
    isModalOpen.value = true
  },
  eventClick(info) {
    const original = allSchedules.value.find(s => s.scheduleId == info.event.id)
    if (original) {
      selectedEvent.value = original
      isDetailModalOpen.value = true
      isEditMode.value = false
    }
  },
})

const formatForServer = (dateStr) => {
  if (!dateStr) return ''
  if (dateStr.length === 16) return dateStr + ':00'
  return dateStr
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(' ', 'T'))
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

const toInputFormat = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.substring(0, 16).replace(' ', 'T')
}

watch(
  () => scheduleData.all_day,
  (val) => {
    if (val) {
      scheduleData.start = scheduleData.start.split('T')[0]
      scheduleData.end = scheduleData.end.split('T')[0]
    } else {
      scheduleData.start = scheduleData.start.substring(0, 10) + 'T09:00'
      scheduleData.end = scheduleData.end.substring(0, 10) + 'T10:00'
    }
  },
)

watch(
  () => editData.all_day,
  (val) => {
    if (val) {
      editData.start = editData.start.split('T')[0]
      editData.end = editData.end.split('T')[0]
    } else {
      editData.start = editData.start.substring(0, 10) + 'T09:00'
      editData.end = editData.end.substring(0, 10) + 'T10:00'
    }
  },
)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/schedule')
    allSchedules.value = res.data
    calendarOptions.value.events = res.data.map(ev => ({
      id: ev.scheduleId,
      title: ev.title,
      start: ev.startTime.replace(' ', 'T').substring(0, 19),
      end: ev.endTime.replace(' ', 'T').substring(0, 19),
      allDay: ev.allDay === 'Y',
      backgroundColor: ev.color || '#4F46E5',
      borderColor: ev.color || '#4F46E5',
    }))
  } catch (error) {
    console.error('일정 불러오기 실패:', error)
  }
})

const handleSave = async () => {
  try {
    const body = {
      title: scheduleData.title,
      content: scheduleData.content,
      clientName: scheduleData.client_name,
      color: scheduleData.color,
      allDay: scheduleData.all_day ? 'Y' : 'N',
      startTime: formatForServer(scheduleData.start),
      endTime: formatForServer(scheduleData.end),
    }

    const res = await axios.post('http://localhost:8080/api/schedule', body)
    const newId = res.data?.scheduleId ?? Date.now()

    // 캘린더에 이벤트 추가
    calendarOptions.value.events = [
      ...calendarOptions.value.events,
      {
        id: newId,
        title: scheduleData.title,
        start: scheduleData.start,
        end: scheduleData.end,
        allDay: scheduleData.all_day,
        backgroundColor: scheduleData.color,
        borderColor: scheduleData.color,
      }
    ]

    allSchedules.value.push({
      scheduleId: newId,
      title: scheduleData.title,
      content: scheduleData.content,
      clientName: scheduleData.client_name,
      color: scheduleData.color,
      allDay: scheduleData.all_day ? 'Y' : 'N',
      startTime: scheduleData.start,
      endTime: scheduleData.end,
    })

    alert('일정이 성공적으로 등록되었습니다.')
    isModalOpen.value = false
  } catch (error) {
    console.error('저장 실패:', error)
    alert('저장에 실패했습니다.')
  }
}

const openEditMode = () => {
  Object.assign(editData, {
    scheduleId: selectedEvent.value.scheduleId,
    title: selectedEvent.value.title,
    start: toInputFormat(selectedEvent.value.startTime),
    end: toInputFormat(selectedEvent.value.endTime),
    content: selectedEvent.value.content || '',
    client_name: selectedEvent.value.clientName || '',
    color: selectedEvent.value.color || '#4F46E5',
    all_day: selectedEvent.value.allDay === 'Y',
  })
  isEditMode.value = true
}

const handleUpdate = async () => {
  try {
    const body = {
      title: editData.title,
      content: editData.content,
      clientName: editData.client_name,
      color: editData.color,
      allDay: editData.all_day ? 'Y' : 'N',
      startTime: formatForServer(editData.start),
      endTime: formatForServer(editData.end),
    }

    await axios.put(`http://localhost:8080/api/schedule/${editData.scheduleId}`, body)

    calendarOptions.value.events = calendarOptions.value.events.map(ev =>
      ev.id == editData.scheduleId
        ? {
            ...ev,
            title: editData.title,
            start: editData.start,
            end: editData.end,
            allDay: editData.all_day,
            backgroundColor: editData.color,
            borderColor: editData.color,
          }
        : ev
    )

    const idx = allSchedules.value.findIndex(s => s.scheduleId == editData.scheduleId)
    if (idx !== -1) {
      allSchedules.value[idx] = {
        ...allSchedules.value[idx],
        title: editData.title,
        content: editData.content,
        clientName: editData.client_name,
        color: editData.color,
        allDay: editData.all_day ? 'Y' : 'N',
        startTime: editData.start,
        endTime: editData.end,
      }
      selectedEvent.value = allSchedules.value[idx]
    }

    alert('일정이 수정되었습니다.')
    isEditMode.value = false
  } catch (error) {
    console.error('수정 실패:', error)
    alert('수정에 실패했습니다.')
  }
}

const handleDelete = async () => {
  if (!confirm('이 일정을 삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:8080/api/schedule/${selectedEvent.value.scheduleId}`)

    calendarOptions.value.events = calendarOptions.value.events.filter(
      ev => ev.id != selectedEvent.value.scheduleId
    )
    allSchedules.value = allSchedules.value.filter(
      s => s.scheduleId != selectedEvent.value.scheduleId
    )

    alert('일정이 삭제되었습니다.')
    isDetailModalOpen.value = false
  } catch (error) {
    console.error('삭제 실패:', error)
    alert('삭제에 실패했습니다.')
  }
}
</script>

<template>
  <div class="calendar-container">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />

    <!-- 새 일정 등록 모달 -->
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
          <FormKit
            type="text"
            name="title"
            label="일정 제목"
            v-model="scheduleData.title"
            validation="required"
            placeholder="일정 제목을 입력하세요"
          />
          <div class="two-col-row">
            <FormKit
              type="text"
              name="client_name"
              label="의뢰인"
              v-model="scheduleData.client_name"
              placeholder="의뢰인 이름 (선택)"
            />
          </div>
          <div class="allday-row">
            <label class="allday-label">
              <input type="checkbox" v-model="scheduleData.all_day" />
              하루 종일
            </label>
          </div>
          <FormKit
            :type="scheduleData.all_day ? 'date' : 'datetime-local'"
            name="start"
            label="시작"
            v-model="scheduleData.start"
            validation="required"
          />
          <FormKit
            :type="scheduleData.all_day ? 'date' : 'datetime-local'"
            name="end"
            label="종료"
            v-model="scheduleData.end"
            validation="required"
          />
          <div class="color-picker-wrap">
            <label class="color-label">색상</label>
            <div class="color-input-row">
              <input type="color" v-model="scheduleData.color" class="color-palette" />
              <span class="color-value">{{ scheduleData.color }}</span>
            </div>
          </div>
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

    <!-- 일정 상세/수정 모달 -->
    <div v-if="isDetailModalOpen && selectedEvent" class="modal-overlay" @click.self="isDetailModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <div class="header-left">
            <span class="color-dot" :style="{ background: selectedEvent.color || '#4F46E5' }"></span>
            <h3>{{ isEditMode ? '일정 수정' : '일정 상세' }}</h3>
          </div>
          <button @click="isDetailModalOpen = false" class="close-btn">&times;</button>
        </div>

        <!-- 상세 보기 -->
        <div v-if="!isEditMode" class="detail-view">
          <div class="detail-item">
            <span class="detail-label">제목</span>
            <span class="detail-value">{{ selectedEvent.title }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">시작</span>
            <span class="detail-value">{{ formatDisplayDate(selectedEvent.startTime) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">종료</span>
            <span class="detail-value">{{ formatDisplayDate(selectedEvent.endTime) }}</span>
          </div>
          <div class="detail-item" v-if="selectedEvent.clientName">
            <span class="detail-label">의뢰인</span>
            <span class="detail-value">{{ selectedEvent.clientName }}</span>
          </div>
          <div class="detail-item" v-if="selectedEvent.content">
            <span class="detail-label">내용</span>
            <span class="detail-value">{{ selectedEvent.content }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">하루종일</span>
            <span class="detail-value">{{ selectedEvent.allDay === 'Y' ? '예' : '아니오' }}</span>
          </div>
          <div class="detail-actions">
            <button @click="openEditMode" class="btn-edit">수정</button>
            <button @click="handleDelete" class="btn-delete">삭제</button>
          </div>
        </div>

        <!-- 수정 폼 -->
        <div v-else>
          <FormKit type="form" submit-label="수정 완료" @submit="handleUpdate">
            <FormKit
              type="text"
              name="title"
              label="일정 제목"
              v-model="editData.title"
              validation="required"
            />
            <div class="two-col-row">
              <FormKit
                type="text"
                name="client_name"
                label="의뢰인"
                v-model="editData.client_name"
                placeholder="의뢰인 이름 (선택)"
              />
            </div>
            <div class="allday-row">
              <label class="allday-label">
                <input type="checkbox" v-model="editData.all_day" />
                하루 종일
              </label>
            </div>
            <FormKit
              :type="editData.all_day ? 'date' : 'datetime-local'"
              name="start"
              label="시작"
              v-model="editData.start"
              validation="required"
            />
            <FormKit
              :type="editData.all_day ? 'date' : 'datetime-local'"
              name="end"
              label="종료"
              v-model="editData.end"
              validation="required"
            />
            <div class="color-picker-wrap">
              <label class="color-label">색상</label>
              <div class="color-input-row">
                <input type="color" v-model="editData.color" class="color-palette" />
                <span class="color-value">{{ editData.color }}</span>
              </div>
            </div>
            <FormKit
              type="textarea"
              name="content"
              label="상세 내용"
              v-model="editData.content"
              :rows="3"
            />
          </FormKit>
          <button @click="isEditMode = false" class="btn-cancel">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  padding: 1rem;
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

.detail-view {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  min-width: 60px;
}

.detail-value {
  font-size: 0.9rem;
  color: #222;
  white-space: pre-wrap;
}

.detail-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.btn-edit {
  flex: 1;
  padding: 0.6rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-delete {
  flex: 1;
  padding: 0.6rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-cancel {
  width: 100%;
  padding: 0.6rem;
  background: #e5e7eb;
  color: #444;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 0.5rem;
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
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
}

:deep(.fc-toolbar-title) {
  font-size: 1.2rem;
  font-weight: 700;
}

:deep(.fc-button) {
  background: #4f46e5 !important;
  border-color: #4f46e5 !important;
}

:deep(.fc-button:hover) {
  background: #3730a3 !important;
  border-color: #3730a3 !important;
}

:deep(.fc-daygrid-event) {
  cursor: pointer;
}
</style>
