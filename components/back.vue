<template>
  <div id="component-back">
    <img
      class="left"
      src="~/assets/img/back.svg"
      alt="back"
      @click="bindBack"
    />
    <div class="right">
      <slot />
    </div>
  </div>
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
        this.$router.back()
      }
    },
  },
}
</script>
<style lang="stylus">
#component-back {
  > img.left {
    cursor: pointer;
    position: fixed;
    top: 8px;
    left: 0px;
    width: 35px;
    height: 35px;
    z-index: 100;
  }

  > div.right {
    cursor: pointer;
    position: fixed;
    top: 8px;
    right: 12px;
    height: 35px;
    font-size: 15px;
    display: flex;
    align-items: center;
    font-weight: bold;
    z-index: 100;

    a {
      color: #000;
    }
  }
}
</style>
