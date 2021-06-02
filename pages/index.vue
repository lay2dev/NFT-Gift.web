<template>
  <div id="page-index">
    <div class="title">NFT Gift</div>
    <img class="illustration" src="~/assets/img/dolphins_in_the_ocean.svg" />
    <el-button
      class="connect"
      type="primary"
      round
      :loading="loading"
      @click="bindLogin"
    >
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
      const provider = Sea.checkLogin()
      if (provider) {
        this.$router.push('/mine')
      } else {
        this.loading = false
      }
    },
    async bindLogin() {
      const url = {
        NODE_URL: process.env.CKB_NODE_URL,
        INDEXER_URL: process.env.CKB_INDEXER_URL,
        CHAIN_ID:
          process.env.CKB_CHAIN_ID === '0' ? ChainID.ckb : ChainID.ckb_testnet,
      }
      await new PWCore(url.NODE_URL).init(
        new UnipassProvider(process.env.UNIPASS_URL),
        new IndexerCollector(url.INDEXER_URL),
        url.CHAIN_ID,
      )
      const provider = PWCore.provider
      if (provider && provider._address) {
        provider._time = Date.now()
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

  .title {
    font-weight: 300;
    font-size: 24px;
    margin-bottom: 20px;
  }

  .index-illustration {
    width: 80vw;
  }

  .connect {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
