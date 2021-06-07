<template>
  <div id="page-record">
    <back />
    <record-nfts
      :loading.sync="loading"
      :nfts.sync="nftsCreate"
      @cancel="bindCancel"
    />
    <record-nfts :nfts.sync="nftsOther" />
  </div>
</template>

<script>
import RecordNfts from '@/components/record-nfts.vue'
export default {
  components: {
    RecordNfts,
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
          limit: 20,
          page: 0,
        },
      })
      this.nftsCreate = res.data.filter((e) => e.txState === 'create')
      this.nftsOther = res.data.filter((e) => e.txState !== 'create')
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
}
</style>
