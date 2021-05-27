<template>
  <div id="page-index">
    <div class="title">NFT GIFT</div>
    <el-button type="primary" round @click="bindLogin">
      连接 Unipass
    </el-button>
  </div>
</template>
<script>
import UnipassProvider from '@/assets/js/UnipassProvider.ts'
import PWCore, {
  // Address,
  // AddressType,
  // Amount,
  IndexerCollector,
} from '@lay2/pw-core'

export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const provider = Sea.localStorage('provider')
      if (provider) {
        this.$store.state.provider = provider
        this.$router.push('/mine')
      }
    },
    async bindLogin() {
      const url = {
        NODE_URL: 'https://testnet.ckb.dev',
        INDEXER_URL: 'https://testnet.ckb.dev/indexer',
        CHAIN_ID: 1,
      }
      await new PWCore(url.NODE_URL).init(
        new UnipassProvider(process.env.NUXT_ENV_UNIPASS_URL),
        new IndexerCollector(url.INDEXER_URL),
        url.CHAIN_ID,
      )
      if (PWCore.provider) {
        Sea.localStorage('provider', PWCore.provider)
        this.$store.state.provider = PWCore.provider
        this.$router.push('/mine')
      } else {
        this.$message.error('连接失败')
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
