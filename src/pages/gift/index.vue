<template>
  <div id="page-gift">
    <div class="image-box">
      <el-image :src="gift.class_bg_image_url" fit="contain" alt="image" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      gift: {
        token_uuid: '4fcad88f-d0dc-44dc-b0a8-fec0c2e4a3ca',
        class_uuid: '09964348-580c-483d-981d-8547f41cf518',
        class_name: '「DAS Golden Cell」Token',
        class_bg_image_url:
          'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621261302943.png',
        class_description:
          '旅行者金唱片（Voyager Golden Records）是1977年随旅行者探测器发射到太空的唱片。唱片收录了地球上各种文化及生命的声音及图像，以期宇宙中高智慧生物发现。\n\n拥有此 NFT，即代表你有权在即将上线的 https://da.services 的金唱片「 DAS Golden Cell」中永久镌刻一段数据，发送给未来元宇宙中的居民。使用说明：http://t.hk.uy/eFu',
        class_total: '61',
        class_issued: '61',
        tx_state: 'committed',
        issuer_name: 'DAS Official Team',
        issuer_avatar_url:
          'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621245335359.png',
        issuer_uuid: '3b1b0ba6-035c-4e7b-a153-8309b82d9d5b',
        from_address: '3b1b0ba6-035c-4e7b-a153-8309b82d9d5b',
        to_address:
          'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
      },
    }
  },
}
</script>
<style lang="stylus">
#page-gift {
  .image-box {
    display: flex;
    justify-content: center;
    background: #eee;
    height: 343px;
    align-items: center;

    img {
      width: 300px;
      height: 300px;
    }
  }
}
</style>