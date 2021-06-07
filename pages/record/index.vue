<template>
  <div id="page-record">
    <back />
    <div class="title"></div>
    <pull-refresh :next="init">
      <record-nfts
        :loading.sync="loading"
        :nfts.sync="nftsCreate"
        @cancel="bindCancel"
      />
      <div class="line"></div>
      <record-nfts class="history" :nfts.sync="nftsOther" />
    </pull-refresh>
  </div>
</template>

<script>
import RecordNfts from '~/components/record-nfts.vue'
import PullRefresh from '~/components/pull-refresh.vue'

export default {
  components: {
    RecordNfts,
    PullRefresh,
  },
  data() {
    return {
      loading: false,
      address: '',
      nftsCreate: [],
      nftsOther: [],
    }
  },
  async mounted() {
    const provider = await Sea.bindLogin()
    if (provider) {
      this.address = provider._address.addressString
      this.init()
    } else {
      this.$router.replace('/')
    }
  },
  methods: {
    async init() {
      this.loading = true
      const res = await Sea.Ajax({
        url: '/nft/history',
        method: 'post',
        data: {
          address: this.address,
          limit: 1000,
          page: 0,
        },
      })
      //
      const filter = ['create', 'init', 'pending']
      this.nftsCreate = res.data.filter((e) => filter.includes(e.txState))
      this.nftsOther = res.data.filter((e) => !filter.includes(e.txState))
      this.loading = false
    },
    async bindCancel(nft) {
      this.loading = true
      const res = await Sea.Ajax({
        url: '/nft/cancel',
        method: 'post',
        data: {
          id: nft.id,
          fromAddress: this.address,
        },
      })
      if (res.success) {
        await this.init()
        this.$message.success('撤销成功')
      } else {
        this.$message.success('撤销失败')
      }
    },
  },
}
</script>

<style lang="stylus">
#page-record {
  > .title {
    font-size: 18px;
    display: flex;
    justify-content: center;
    height: 60px;
  }

  > .line {
    height: 1px;
    background: var(--info);
  }

  .record-nfts.history {
    padding-top: 16px;
  }
}
</style>
