<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-warning">
                <i class="nc-icon nc-paper-2 text-warning"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">총 답변 게시글</p>
              <h4 class="card-title">125건</h4>
            </template>
            <template #footer> <i class="fa fa-refresh"></i> 실시간 업데이트 중 </template>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-success">
                <i class="nc-icon nc-time-alarm text-success"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">오늘의 상담 예약</p>
              <h4 class="card-title">8건</h4>
            </template>
            <template #footer> <i class="fa fa-calendar-o"></i> 예약 관리 바로가기 </template>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-danger">
                <i class="nc-icon nc-chat-round text-danger"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">미확인 채팅</p>
              <h4 class="card-title">있음</h4>
            </template>
            <template #footer> <i class="fa fa-clock-o"></i> 최근 1시간 기준 </template>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <template #header>
              <div class="icon-info">
                <i class="nc-icon nc-satisfied text-primary"></i>
              </div>
            </template>
            <template #content>
              <p class="card-category">만족도 평균</p>
              <h4 class="card-title">248명</h4>
            </template>
            <template #footer> <i class="fa fa-refresh"></i> 전체 누적 데이터 </template>
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
                      <span v-else class="badge badge-default">종료됨</span>
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

            <!-- 미니 캘린더 -->
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

            <!-- 가까운 일정 목록 -->
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
                <!-- ✅ router-link으로 변경 -->
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
  components: {
    LTable,
    ChartCard,
    StatsCard,
    Card,
  },
  data() {
    return {
      lineChart: {
        data: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          series: [
            [50, 80, 120, 90, 150, 200],
            [30, 40, 60, 50, 70, 90],
            [20, 30, 40, 35, 45, 60],
          ],
        },
        options: {
          low: 0,
          high: 250,
          height: '245px',
        },
      },
      pieChart: {
        data: {
          labels: ['40%', '35%', '25%'],
          series: [40, 35, 25],
        },
      },
      chatListData: [],
      scheduleList: [],
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
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
      } catch (error) {
        console.error('목록 로드 중 에러:', error)
      }
    },

    // ✅ URL 수정: /schedule → /api/schedule
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
      } else {
        this.currentMonth--
      }
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
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
      const month = d.getMonth() + 1
      const day = d.getDate()
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      return `${month}/${day} ${hour}:${minute}`
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
