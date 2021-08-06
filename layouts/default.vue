<template>
  <div id="unipass">
    <Nuxt />
  </div>
</template>
<script>
export default {
  created() {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    this.$i18n.locale = lang
  },
  mounted() {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    const list = ['zh', 'en']
    for (const s of list) {
      if (s === lang) {
        document.body.classList.add(s)
      } else {
        document.body.classList.remove(s)
      }
    }
    // Ajax default param
    // Sea.Ajax.default = function () {}
    // Ajax fail
    Sea.Ajax.fail = (r) => {
      this.$message.error(`${this.$t('requestFailed')} ${r.statusText}`)
    }
  },
}
</script>
