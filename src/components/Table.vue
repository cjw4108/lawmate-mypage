<template>
  <table class="table">
    <thead>
      <slot name="columns">
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </tr>
      </slot>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <slot :row="item">
          <td v-for="column in columns" :key="column">
            {{ itemValue(item, column) }}
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'l-table',
  props: {
    columns: Array, // ['Name', 'Status', ...] 형태
    data: Array, // [{name: '홍길동', status: '진행중'}, ...] 형태
  },
  methods: {
    // 1. 컬럼 이름에 해당하는 데이터 값을 찾아오는 메서드
    itemValue(item, column) {
      if (!item || !column) return ''

      // 소문자 키(name)와 원본 키(Name) 모두 대응할 수 있게 합니다.
      const value =
        item[column.toLowerCase()] !== undefined ? item[column.toLowerCase()] : item[column]

      return value !== undefined && value !== null ? value : ''
    },

    // 2. 값이 존재하는지 확인하는 메서드 (필요 시 템플릿에서 사용)
    hasValue(item, column) {
      if (!item || !column) return false
      const value = this.itemValue(item, column)
      return value !== ''
    },
  },
}
</script>
