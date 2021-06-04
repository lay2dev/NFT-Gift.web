<template>
  <el-dialog
    :visible.sync="showDialog"
    class="dialog-gift"
    title="创建 NFT 红包"
    width="90%"
  >
    <div id="mine-gift"></div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: Boolean,
  },
  computed: {
    showDialog: {
      get() {
        return this.$props.show
      },
      set(val) {
        this.$emit('update:show', val)
      },
    },
  },
}
</script>
<style lang="stylus">
#mine-gift {
}
</style>
