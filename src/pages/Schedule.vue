<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

axios.defaults.withCredentials = true

// --- 상태 관리 ---
const isModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const selectedEvent = ref(null)
const allSchedules = ref([])
const calendarRef = ref(null)

// --- 데이터 객체 ---
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

// --- 💡 달력 설정 ---
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: 'dayGridMonth',
  locale: 'ko',
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  events: [], // 여기에 실시간으로 데이터가 꽂힙니다 👊
  dateClick(info) {
    // 날짜 클릭 시 데이터 초기화 및 모달 오픈
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
    const original = allSchedules.value.find((s) => s.scheduleId == info.event.id)
    if (original) {
      selectedEvent.value = original
      isDetailModalOpen.value = true
      isEditMode.value = false
    }
  },
})

// --- 유틸리티 함수 ---
const formatForServer = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.length === 16 ? dateStr + ':00' : dateStr
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(' ', 'T'))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const toInputFormat = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.substring(0, 16).replace(' ', 'T')
}

// --- Watchers ---
watch(
  () => scheduleData.all_day,
  (val) => {
    if (val) {
      scheduleData.start = scheduleData.start.split('T')[0]
      scheduleData.end = scheduleData.end.split('T')[0]
    } else {
      const baseDate = scheduleData.start.substring(0, 10) || '2026-03-18'
      scheduleData.start = baseDate + 'T09:00'
      scheduleData.end = baseDate + 'T10:00'
    }
  },
)

// --- 💡 핵심 기능: CRUD ---

// 1. 초기 데이터 로드
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/schedule')
    allSchedules.value = res.data
    calendarOptions.value.events = res.data.map((ev) => ({
      id: ev.scheduleId,
      title: ev.title,
      start: ev.startTime.replace(' ', 'T'),
      end: ev.endTime.replace(' ', 'T'),
      allDay: ev.allDay === 'Y',
      backgroundColor: ev.color || '#4F46E5',
      borderColor: ev.color || '#4F46E5',
    }))
  } catch (error) {
    console.error('로드 실패:', error)
  }
})

// 2. 일정 저장 (고장 났던 부분 수정 완료! 👊)
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

    // 화면(달력)에 즉시 반영
    const newEvent = {
      id: newId,
      title: scheduleData.title,
      start: scheduleData.start,
      end: scheduleData.end,
      allDay: scheduleData.all_day,
      backgroundColor: scheduleData.color,
      borderColor: scheduleData.color,
    }
    calendarOptions.value.events = [...calendarOptions.value.events, newEvent]

    // 상세 조회용 데이터 배열 업데이트
    allSchedules.value.push({
      ...body,
      scheduleId: newId,
      startTime: scheduleData.start,
      endTime: scheduleData.end,
    })

    alert('일정이 등록되었습니다.')
    isModalOpen.value = false
  } catch (error) {
    console.error('저장 에러:', error)
    alert('저장에 실패했습니다.')
  }
}

// 3. 수정 모달 열기
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

// 4. 일정 수정 완료
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

    // 달력 UI 업데이트
    calendarOptions.value.events = calendarOptions.value.events.map((ev) =>
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
        : ev,
    )

    // 내부 데이터 동기화
    const idx = allSchedules.value.findIndex((s) => s.scheduleId == editData.scheduleId)
    if (idx !== -1) {
      allSchedules.value[idx] = {
        ...allSchedules.value[idx],
        ...body,
        startTime: editData.start,
        endTime: editData.end,
      }
      selectedEvent.value = allSchedules.value[idx]
    }

    alert('수정되었습니다.')
    isEditMode.value = false
  } catch (error) {
    console.error('수정 실패:', error)
  }
}

// 5. 일정 삭제
const handleDelete = async () => {
  if (!confirm('삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:8080/api/schedule/${selectedEvent.value.scheduleId}`)
    calendarOptions.value.events = calendarOptions.value.events.filter(
      (ev) => ev.id != selectedEvent.value.scheduleId,
    )
    allSchedules.value = allSchedules.value.filter(
      (s) => s.scheduleId != selectedEvent.value.scheduleId,
    )
    alert('삭제되었습니다.')
    isDetailModalOpen.value = false
  } catch (error) {
    console.error('삭제 실패:', error)
  }
}
</script>

<template>
  <div class="calendar-container">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />

    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-content">
        <h3>새 일정 등록</h3>
        <FormKit type="form" submit-label="저장" @submit="handleSave">
          <FormKit type="text" label="제목" v-model="scheduleData.title" validation="required" />
          <FormKit type="text" label="의뢰인" v-model="scheduleData.client_name" />
          <div class="allday-row">
            <label><input type="checkbox" v-model="scheduleData.all_day" /> 하루 종일</label>
          </div>
          <FormKit
            :type="scheduleData.all_day ? 'date' : 'datetime-local'"
            label="시작"
            v-model="scheduleData.start"
          />
          <FormKit
            :type="scheduleData.all_day ? 'date' : 'datetime-local'"
            label="종료"
            v-model="scheduleData.end"
          />
          <input type="color" v-model="scheduleData.color" class="color-palette" />
          <FormKit type="textarea" label="내용" v-model="scheduleData.content" />
        </FormKit>
      </div>
    </div>

    <div
      v-if="isDetailModalOpen && selectedEvent"
      class="modal-overlay"
      @click.self="isDetailModalOpen = false"
    >
      <div class="modal-content">
        <div v-if="!isEditMode">
          <h3>{{ selectedEvent.title }}</h3>
          <p>
            시간: {{ formatDisplayDate(selectedEvent.startTime) }} ~
            {{ formatDisplayDate(selectedEvent.endTime) }}
          </p>
          <p v-if="selectedEvent.clientName">의뢰인: {{ selectedEvent.clientName }}</p>
          <p v-if="selectedEvent.content">내용: {{ selectedEvent.content }}</p>
          <div class="detail-actions">
            <button @click="openEditMode" class="btn-edit">수정</button>
            <button @click="handleDelete" class="btn-delete">삭제</button>
          </div>
        </div>
        <div v-else>
          <FormKit type="form" submit-label="수정완료" @submit="handleUpdate">
            <FormKit type="text" label="제목" v-model="editData.title" validation="required" />
            <div class="allday-row">
              <label><input type="checkbox" v-model="editData.all_day" /> 하루 종일</label>
            </div>
            <FormKit
              :type="editData.all_day ? 'date' : 'datetime-local'"
              label="시작"
              v-model="editData.start"
            />
            <FormKit
              :type="editData.all_day ? 'date' : 'datetime-local'"
              label="종료"
              v-model="editData.end"
            />
            <input type="color" v-model="editData.color" class="color-palette" />
            <FormKit type="textarea" label="내용" v-model="editData.content" />
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}
.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.btn-edit {
  flex: 1;
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.btn-delete {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.btn-cancel {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
}
.color-palette {
  width: 100%;
  height: 40px;
  margin: 10px 0;
  border: none;
  cursor: pointer;
}
:deep(.fc-daygrid-event) {
  cursor: pointer;
}
</style>
