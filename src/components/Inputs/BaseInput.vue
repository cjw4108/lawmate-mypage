<template>
  <div
    class="form-group"
    :class="{
      'input-group': hasIcon,
      'input-group-focus': focused,
    }"
  >
    <slot name="label">
      <label v-if="label" class="control-label">{{ label }}</label>
    </slot>
    <slot name="addonLeft">
      <span v-if="addonLeftIcon" class="input-group-prepend">
        <div class="input-group-text"><i :class="addonLeftIcon"></i></div>
      </span>
    </slot>
    <slot>
      <input
        :value="modelValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        v-bind="$attrs"
        class="form-control"
        aria-describedby="addon-right addon-left"
      />
    </slot>
    <slot name="addonRight">
      <span v-if="addonRightIcon" class="input-group-append">
        <div class="input-group-text"><i :class="addonRightIcon"></i></div>
      </span>
    </slot>
    <slot name="helperText"></slot>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'base-input',
  props: {
    label: String,
    modelValue: [String, Number], // Vue 3는 value 대신 modelValue를 씁니다.
    addonRightIcon: String,
    addonLeftIcon: String,
  },
  emits: ['update:modelValue', 'focus', 'blur'], // 발생시킬 이벤트 선언
  data() {
    return { focused: false }
  },
  computed: {
    hasIcon() {
      // Vue 3에서 $slots는 함수 형태이므로 존재 여부만 체크합니다.
      return !!(
        this.$slots.addonRight ||
        this.$slots.addonLeft ||
        this.addonRightIcon ||
        this.addonLeftIcon
      )
    },
  },
  methods: {
    onInput(evt) {
      this.$emit('update:modelValue', evt.target.value)
    },
    onFocus(evt) {
      this.focused = true
      this.$emit('focus', evt)
    },
    onBlur(evt) {
      this.focused = false
      this.$emit('blur', evt)
    },
  },
}
</script>
