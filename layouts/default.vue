<template>
  <div id="unipass">
    <Nuxt />
  </div>
</template>
<script>
export default {
  mounted() {
    const list = ['zh', 'en']
    let lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    const query = this.$route.query
    if (list.includes(query.lang)) {
      lang = query.lang
    }
    this.$i18n.locale = lang
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
