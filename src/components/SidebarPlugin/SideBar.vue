<template>
  <div class="sidebar" :style="sidebarStyle" :data-color="backgroundColor">
    <div class="sidebar-wrapper">
      <div class="logo">
        <a href="#" class="simple-text logo__container">
          <div
            class="logo-img"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
              color: #333;
              border-radius: 50%;
              font-weight: bold;
              width: 34px;
              height: 34px;
            "
          >
            L
          </div>
          {{ title }}
        </a>
      </div>

      <slot name="content"></slot>
      <ul class="nav nav-main__links">
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            @click="closeNavbar"
            :link="link"
          >
            <i :class="link.icon"></i>
            <p>{{ link.name }}</p>
          </sidebar-link>
        </slot>
      </ul>
      <ul class="nav nav-bottom" v-if="$slots['bottom-links']">
        <slot name="bottom-links"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue'

export default {
  components: {
    SidebarLink,
  },
  props: {
    title: {
      type: String,
      default: 'LawMate', // 기본 타이틀을 LawMate로 변경!
    },
    backgroundColor: {
      type: String,
      default: 'black',
      validator: (value) => {
        let acceptedValues = ['', 'blue', 'azure', 'green', 'orange', 'red', 'purple', 'black']
        return acceptedValues.indexOf(value) !== -1
      },
    },
    backgroundImage: {
      type: String,
      default: '', // 기본 이미지 경로를 빈 값으로 변경!
    },
    // ... 이하 동일
  },
  provide() {
    return {
      autoClose: this.autoClose,
    }
  },
  computed: {
    sidebarStyle() {
      // 이미지가 있을 때만 배경 스타일을 적용하도록 수정
      if (this.backgroundImage) {
        return {
          backgroundImage: `url(${this.backgroundImage})`,
        }
      }
      return {}
    },
  },
}
</script>
