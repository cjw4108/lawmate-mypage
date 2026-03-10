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
              <h4 class="card-title">채팅 리스트 관리 (한기현)</h4>
              <p class="card-category">최근 의뢰인과의 메시지</p>
            </template>
            <l-table :data="chatListData" :columns="['Name', 'Message', '']">
              <template #default="{ row }">
                <td>{{ row.name }}</td>
                <td>{{ row.message }}</td>
                <td class="text-right">
                  <button class="btn btn-info btn-fill btn-xs">채팅방 이동</button>
                </td>
              </template>
            </l-table>
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

export default {
  components: {
    LTable,
    ChartCard,
    StatsCard,
    Card,
  },
  data() {
    return {
      // 1. 임혜빈님: 월별 상담 건수 데이터 (샘플)
      lineChart: {
        data: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          series: [
            [50, 80, 120, 90, 150, 200], // 민사
            [30, 40, 60, 50, 70, 90], // 형사
            [20, 30, 40, 35, 45, 60], // 가사
          ],
        },
        options: {
          low: 0,
          high: 250,
          height: '245px',
        },
      },
      // 2. 한기현님: 상담 카테고리 비율 (샘플)
      pieChart: {
        data: {
          labels: ['40%', '35%', '25%'],
          series: [40, 35, 25],
        },
      },
      // 3. 한기현님: 채팅 리스트 데이터 (샘플)
      chatListData: [
        { name: '홍길동 님', message: '사건 관련 서류 보냈습니다.', date: '오전 10:30' },
        { name: '이순신 님', message: '다음 재판 날짜 확인 부탁드려요.', date: '어제' },
        { name: '강감찬 님', message: '상담 예약 취소 가능한가요?', date: '2026-03-05' },
      ],
    }
  },
}
</script>
