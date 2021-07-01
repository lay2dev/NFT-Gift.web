<template>
  <div id="page-index">
    <div class="title">{{ t_('nftRedPacket') }}</div>
    <img class="illustration" src="~/assets/img/gift-create-redpacket.svg" />
    <el-button
      class="connect"
      type="primary"
      round
      :loading="loading"
      @click="bindLogin"
    >
      {{ t_('connect') }}
    </el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      lang: this.$route.params.lang,
    }
  },
  created() {
    const info = Sea.SaveDataByUrl()
    if (info) {
      this.$message.warning(info)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    t_(key) {
      return this.$t(`login.${key}`)
    },
    init() {
      const provider = Sea.checkLogin()
      if (provider) {
        this.$router.replace(`/${this.lang}/create`)
      }
      this.loading = false
    },
    async bindLogin() {
      this.loading = true
      const provider = await Sea.bindLogin()
      if (provider) {
        this.$router.push(`/${this.lang}/create`)
      }
      this.loading = false
    },
  },
}
</script>
<style lang="stylus">
#page-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding-top: 58px;
  padding-bottom: 100px;
  margin: 0 40px;

  .title {
    font-weight: 300;
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--primary);
  }

  .illustration {
    width: 60vw;
  }

  .connect {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
