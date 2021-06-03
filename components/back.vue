<template>
  <img
    id="component-back"
    src="~/assets/img/back.svg"
    alt="back"
    @click="bindBack"
  />
</template>
<script>
export default {
  props: {
    stop: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    bindBack() {
      if (!this.stop) {
        $router.back()
      }
    },
  },
}
</script>
<style>
#component-back {
  cursor: pointer;
  position: fixed;
  top: 8px;
  left: 0px;
  width: 35px;
  height: 35px;
  z-index: 100;
}
</style>
