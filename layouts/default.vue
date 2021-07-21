<template>
  <Nuxt />
</template>
<script>
export default {
  created() {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    this.$i18n.locale = lang
  },
  mounted() {
    // Ajax default param
    // Sea.Ajax.default = function () {}
    // Ajax fail
    Sea.Ajax.fail = (r) => {
      this.$message.error(`${this.$t('requestFailed')} ${r.statusText}`)
    }
  },
}
</script>
