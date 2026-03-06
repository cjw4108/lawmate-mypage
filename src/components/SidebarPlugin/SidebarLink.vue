<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive }" custom>
    <li :class="[isActive ? 'active' : '']" class="nav-item">
      <a :href="href" @click="navigate" class="nav-link">
        <slot>
          <i v-if="link.icon" :class="link.icon"></i>
          <p>{{ link.name }}</p>
        </slot>
      </a>
    </li>
  </router-link>
</template>

<script>
export default {
  name: 'sidebar-link',
  props: {
    to: {
      type: [String, Object],
      default: '#',
    },
    link: {
      type: Object,
      default: () => ({ name: '', icon: '', path: '' }),
    },
  },
}
</script>
