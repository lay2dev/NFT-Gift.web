<template>
  <div id="page-test">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="创建红包 - 授权签名" name="1">
        <div class="tip">
          红包-创建红包：本地生成keyX，并使用localKey对红包内容进行授权签名
        </div>
      </el-collapse-item>
      <el-collapse-item title="接收红包 - 组装交易" name="2">
        <div class="tip">
          红包-接收红包：通过收到的红包链接，组装交易，使用keyX进行签名，并将完整提交交易上链
        </div>
      </el-collapse-item>
      <el-collapse-item title="分享图片" name="3">
        <div class="tip">红包-生成内含二维码的红包分享图片</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: '',
    }
  },
  async created() {
    // axios
    const res = await Sea.Ajax({
      url: 'https://api.sea.team/v4/search',
      method: 'get',
      data: {
        key: 'dudu',
      },
    })
    console.log('🌊', res)
  },
}
</script>
<style lang="stylus">
#page-test {
  padding: 20px;

  .tip {
    color: #999;
  }
}
</style>