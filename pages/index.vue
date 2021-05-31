<template>
  <div id="page-index">
    <div class="title">NFT GIFT</div>
    <el-button type="primary" round :loading="loading" @click="bindLogin">
      连接 Unipass
    </el-button>
  </div>
</template>
<script>
import UnipassProvider from '@/assets/js/UnipassProvider.ts'
import PWCore, { ChainID, IndexerCollector } from '@lay2/pw-core'

export default {
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const provider = Sea.localStorage('provider')
      if (provider) {
        this.$router.push('/mine')
      } else {
        this.loading = false
      }
    },
    async bindLogin() {
      const url = {
        NODE_URL: process.env.NUXT_ENV_NODE_URL,
        INDEXER_URL: process.env.NUXT_ENV_INDEXER_URL,
        CHAIN_ID:
          process.env.NUXT_ENV_CHAIN_ID === '0'
            ? ChainID.ckb
            : ChainID.ckb_testnet,
      }
      await new PWCore(url.NODE_URL).init(
        new UnipassProvider(process.env.NUXT_ENV_UNIPASS_URL),
        new IndexerCollector(url.INDEXER_URL),
        url.CHAIN_ID,
      )
      const provider = PWCore.provider
      if (provider && provider._address) {
        Sea.localStorage('provider', provider)
        this.$router.push('/mine')
      } else {
        this.$message.warning('登录不成功')
      }
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

  .el-button {
    width: 100%;
  }
}
</style>
