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
              <p class="card-category">연간 답변 게시글</p>
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
              <h4 class="card-title">12</h4>
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
        <div class="col-md-8">
          <chart-card
            :chart-data="lineChart.data"
            :chart-options="lineChart.options"
            :responsive-options="lineChart.responsiveOptions"
          >
            <template #header>
              <h4 class="card-title">월별 상담 건수 (임혜빈)</h4>
              <p class="card-category">2026년 월간 상담 추이</p>
            </template>
            <template #footer>
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 민사
                <i class="fa fa-circle text-danger"></i> 형사
                <i class="fa fa-circle text-warning"></i> 가사
              </div>
              <hr />
              <div class="stats"><i class="fa fa-history"></i> 3분 전 업데이트됨</div>
            </template>
          </chart-card>
        </div>

        <div class="col-md-4">
          <chart-card :chart-data="pieChart.data" chart-type="Pie">
            <template #header>
              <h4 class="card-title">상담 카테고리 비율 (한기현)</h4>
              <p class="card-category">현재 진행 중인 사건 비율</p>
            </template>
            <template #footer>
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 민사
                <i class="fa fa-circle text-danger"></i> 형사
                <i class="fa fa-circle text-warning"></i> 기타
              </div>
              <hr />
              <div class="stats"><i class="fa fa-clock-o"></i> 실시간 분류 기준</div>
            </template>
          </chart-card>
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
                      현재 진행 중인 상담이 없습니다.
                    </td>
                  </tr>

                  <tr v-for="row in chatListData" :key="row.roomId">
                    <td>{{ row.userName }} 님</td>
                    <td class="text-truncate" style="max-width: 200px">{{ row.lastMessage }}</td>
                    <td class="text-right">
                      <button
                        v-if="lawyer.isConsulting"
                        class="btn btn-secondary disabled"
                        disabled
                      >
                        상담 중
                      </button>
                      <button
                        v-else
                        @click="applyConsultation(lawyer.lawyerNo)"
                        class="btn btn-primary"
                      >
                        상담 신청
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </card>
        </div>

        <div class="col-md-6">
          <card>
            <template #header>
              <h5 class="title">상담 예약 캘린더 (최지원)</h5>
              <p class="category">재판 및 상담 일정 관리 (+CRUD)</p>
            </template>
            <div
              class="calendar-placeholder"
              style="
                height: 300px;
                background: #f9f9f9;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <p class="text-muted">Calendar Library Loading...</p>
            </div>
            <template #footer>
              <hr />
              <div class="stats"><i class="fa fa-history"></i> 일정 관리 시스템 연동 완료</div>
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
    }
  },

  // ✅ mounted는 methods 밖에 있어야 정상 작동합니다.
  mounted() {
    this.fetchChatList()
  },

  methods: {
    // 1. 목록 가져오기
    async fetchChatList() {
      try {
        const response = await axios.get('/api/chat/list')
        console.log('대시보드 목록 데이터:', response.data)
        if (Array.isArray(response.data)) {
          this.chatListData = response.data
        }
      } catch (error) {
        console.error('목록 로드 중 에러:', error)
      }
    },

    // 2. 상담 수락 (하나로 통합)
    async acceptConsultation(roomId) {
      if (!confirm('이 상담을 수락하시겠습니까?')) return;

      try {
        // 컨트롤러의 @PostMapping("/direct/accept") 주소에 맞춤
        const response = await axios.post(`/direct/accept?roomId=${roomId}`)
        if (response.data === 'success') {
          alert('상담이 수락되었습니다.')
          this.fetchChatList() // 수락 후 목록 갱신
        }
      } catch (error) {
        console.error('수락 실패:', error)
        alert('수락 처리 중 오류가 발생했습니다.')
      }
    },

    // 3. 채팅방 이동
    goToChat(row) {
      if (!row.roomId || !row.lawyerId) {
        alert('방 정보를 찾을 수 없습니다.')
        return
      }
      location.href = `/direct/consult?lawyerId=${row.lawyerId}&roomId=${row.roomId}`
    }
  } // methods 끝
}
</script>
