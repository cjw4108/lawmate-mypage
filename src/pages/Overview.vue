<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <!-- 총 답변 게시글 -->
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-warning">
                <i class="nc-icon nc-paper-2 text-warning"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">총 답변 게시글</p>
              <h4 class="card-title">2건</h4>
            </template>
            <template #footer><i class="fa fa-refresh"></i> 실시간 업데이트 중</template>
          </stats-card>
        </div>

        <!-- 오늘의 일정 -->
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-success">
                <i class="nc-icon nc-time-alarm text-success"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">오늘의 일정</p>
              <h4 class="card-title">
                {{ todayEventCount > 0 ? `${todayEventCount}건 있음` : '없음' }}
              </h4>
            </template>
            <template #footer><i class="fa fa-calendar-o"></i> 예약 관리 바로가기</template>
          </stats-card>
        </div>

        <!-- 채팅 (미확인/진행중) -->
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-danger">
                <i class="nc-icon nc-chat-round text-danger"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">채팅</p>
              <h4 class="card-title">
                <span v-if="ongoingChatCount > 0">진행중</span>
                <span v-else-if="unreadChatCount > 0">{{ unreadChatCount }}건 미확인</span>
                <span v-else>없음</span>
              </h4>
            </template>
            <template #footer
              ><i class="fa fa-clock-o"></i> 수락 대기 {{ unreadChatCount }}건</template
            >
          </stats-card>
        </div>

        <!-- 완료된 상담 -->
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-info">
                <i class="nc-icon nc-satisfied text-primary"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">완료된 상담</p>
              <h4 class="card-title">{{ closedChatCount }}건</h4>
            </template>
            <template #footer><i class="fa fa-check"></i> 종료된 상담 누적</template>
          </stats-card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <card>
            <template #header>
              <h4 class="card-title">실시간 상담 요청 관리</h4>
              <p class="card-category">상담 목록을 확인하세요.</p>
            </template>

            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>의뢰인</th>
                    <th>최근 메시지</th>
                    <th class="text-right">상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="chatListData.length === 0">
                    <td colspan="3" class="text-center text-muted" style="padding: 20px">
                      현재 진행 중인 상담 요청이 없습니다.
                    </td>
                  </tr>
                  <tr v-for="row in chatListData" :key="row.roomId">
                    <td>
                      <strong>{{ row.userName }}</strong> 님
                    </td>
                    <td class="text-truncate" style="max-width: 200px">
                      {{ row.lastMessage || '새로운 상담 요청입니다.' }}
                    </td>
                    <td class="text-right">
                      <button
                        v-if="row.status === 'LIVE'"
                        @click="acceptConsultation(row.roomId)"
                        class="btn btn-primary btn-fill btn-sm"
                      >
                        수락하기
                      </button>
                      <button
                        v-else-if="row.status === 'ONGOING'"
                        @click="goToChat(row)"
                        class="btn btn-success btn-fill btn-sm"
                      >
                        입장하기
                      </button>
                      <button
                        v-if="row.status === 'ONGOING'"
                        @click="closeConsultation(row.roomId, row.lawyerId)"
                        class="btn btn-danger btn-fill btn-sm"
                      >
                        상담 종료
                      </button>
                      <!-- ✅ 종료됨 폰트 검은색 -->
                      <span v-if="row.status === 'CLOSED'" class="badge badge-closed">종료됨</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </card>
        </div>

        <!-- 캘린더 + 가까운 일정 목록 -->
        <div class="col-md-6">
          <card>
            <template #header>
              <h5 class="title">일정 관리</h5>
              <p class="category">가까운 일정을 확인하세요.</p>
            </template>

            <div class="mini-calendar">
              <div class="calendar-nav">
                <button @click="prevMonth" class="btn btn-sm btn-default">&lt;</button>
                <span class="calendar-title">{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
                <button @click="nextMonth" class="btn btn-sm btn-default">&gt;</button>
              </div>
              <table class="mini-cal-table">
                <thead>
                  <tr>
                    <th v-for="d in ['일', '월', '화', '수', '목', '금', '토']" :key="d">
                      {{ d }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(week, wi) in calendarWeeks" :key="wi">
                    <td
                      v-for="(day, di) in week"
                      :key="di"
                      :class="{
                        today: day && isToday(day),
                        'has-event': day && hasEvent(day),
                        'other-month': !day,
                      }"
                    >
                      {{ day || '' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="upcoming-list">
              <h6 class="upcoming-title">가까운 일정</h6>
              <div
                v-if="upcomingSchedules.length === 0"
                class="text-muted text-center"
                style="padding: 10px"
              >
                예정된 일정이 없습니다.
              </div>
              <div
                v-for="ev in upcomingSchedules"
                :key="ev.scheduleId"
                class="upcoming-item"
                :style="{ borderLeft: `4px solid ${ev.color || '#4F46E5'}` }"
              >
                <div class="upcoming-date">{{ formatDisplayDate(ev.startTime) }}</div>
                <div class="upcoming-info">
                  <strong>{{ ev.title }}</strong>
                  <span v-if="ev.clientName" class="text-muted"> · {{ ev.clientName }}</span>
                </div>
              </div>
            </div>

            <template #footer>
              <hr />
              <div class="stats">
                <i class="fa fa-calendar"></i>
                <router-link to="/schedule" style="margin-left: 5px">전체 일정 보기</router-link>
              </div>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartCard from '../components/Cards/ChartCard.vue'
import StatsCard from '../components/Cards/StatsCard.vue'
import LTable from '../components/Table.vue'
import Card from '../components/Cards/Card.vue'
import axios from 'axios'

export default {
  components: { LTable, ChartCard, StatsCard, Card },

  data() {
    return {
      chatListData: [],
      scheduleList: [],
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      unreadChatCount: 0,
    }
  },

  computed: {
    calendarWeeks() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const weeks = []
      let week = Array(firstDay).fill(null)
      for (let d = 1; d <= daysInMonth; d++) {
        week.push(d)
        if (week.length === 7) {
          weeks.push(week)
          week = []
        }
      }
      if (week.length > 0) {
        while (week.length < 7) week.push(null)
        weeks.push(week)
      }
      return weeks
    },

    // ✅ 현재 시간 이후 일정만 (지금 시간 기준)
    upcomingSchedules() {
      const now = new Date()
      return this.scheduleList
        .filter((ev) => new Date(ev.startTime.replace(' ', 'T')) >= now)
        .sort(
          (a, b) =>
            new Date(a.startTime.replace(' ', 'T')) - new Date(b.startTime.replace(' ', 'T')),
        )
        .slice(0, 5)
    },

    // ✅ 오늘 중 현재 시간 이후 일정 수
    todayEventCount() {
      const now = new Date()
      return this.scheduleList.filter((ev) => {
        const d = new Date(ev.startTime.replace(' ', 'T'))
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear() &&
          d >= now // ✅ 현재 시간 이후만
        )
      }).length
    },

    // ✅ 진행 중인 채팅
    ongoingChatCount() {
      return this.chatListData.filter((r) => r.status === 'ONGOING').length
    },

    // ✅ 종료된 상담 수
    closedChatCount() {
      return this.chatListData.filter((r) => r.status === 'CLOSED').length
    },
  },

  mounted() {
    this.fetchChatList()
    this.fetchSchedules()
  },

  methods: {
    async fetchChatList() {
      try {
        const response = await axios.get('/api/chat/list')
        this.chatListData = response.data
        this.unreadChatCount = response.data.filter((r) => r.status === 'LIVE').length
      } catch (error) {
        console.error('목록 로드 중 에러:', error)
      }
    },

    async fetchSchedules() {
      try {
        const response = await axios.get('/api/schedule')
        this.scheduleList = response.data
      } catch (error) {
        console.error('일정 로드 실패:', error)
      }
    },

    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else this.currentMonth--
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else this.currentMonth++
    },

    isToday(day) {
      const today = new Date()
      return (
        day === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear()
      )
    },

    hasEvent(day) {
      return this.scheduleList.some((ev) => {
        const d = new Date(ev.startTime.replace(' ', 'T'))
        return (
          d.getDate() === day &&
          d.getMonth() === this.currentMonth &&
          d.getFullYear() === this.currentYear
        )
      })
    },

    formatDisplayDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr.replace(' ', 'T'))
      return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },

    async acceptConsultation(roomId) {
      if (!confirm('이 상담을 수락하시겠습니까?')) return
      try {
        const response = await axios.post(`/direct/accept?roomId=${roomId}`)
        if (response.data === 'success' || response.status === 200) {
          alert('상담이 수락되었습니다.')
          this.fetchChatList()
        }
      } catch (error) {
        console.error('수락 실패:', error)
        alert('수락 처리 중 오류가 발생했습니다.')
      }
    },

    goToChat(row) {
      if (!row.roomId || !row.lawyerId) {
        alert('방 정보를 찾을 수 없습니다.')
        return
      }
      location.href = `/direct/consult?lawyerId=${row.lawyerId}&roomId=${row.roomId}`
    },

    async closeConsultation(roomId, lawyerId) {
      if (!confirm('상담을 종료하시겠습니까?')) return
      try {
        const response = await axios.post(`/direct/close?roomId=${roomId}&lawyerId=${lawyerId}`)
        if (response.data === 'success') {
          alert('상담이 종료되었습니다.')
          this.fetchChatList()
        }
      } catch (error) {
        console.error('종료 실패:', error)
      }
    },
  },
}
</script>

<style scoped>
/* ✅ 종료됨 배지 검은색 */
.badge-closed {
  background-color: #e0e0e0;
  color: #000000;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.mini-calendar {
  margin-bottom: 16px;
}
.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.calendar-title {
  font-weight: 600;
  font-size: 0.95rem;
}
.mini-cal-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 0.82rem;
}
.mini-cal-table th {
  color: #999;
  font-weight: 600;
  padding: 4px 0;
}
.mini-cal-table td {
  padding: 5px 0;
  cursor: default;
  border-radius: 50%;
  width: 28px;
  height: 28px;
}
.mini-cal-table td.today {
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  font-weight: 700;
}
.mini-cal-table td.has-event {
  position: relative;
}
.mini-cal-table td.has-event::after {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  background: #f96332;
  border-radius: 50%;
  margin: 0 auto;
}
.mini-cal-table td.other-month {
  color: #ccc;
}
.upcoming-title {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
}
.upcoming-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-bottom: 6px;
  background: #f9f9f9;
  border-radius: 6px;
}
.upcoming-date {
  font-size: 0.78rem;
  color: #888;
  min-width: 60px;
}
.upcoming-info {
  font-size: 0.88rem;
}
</style>
