<template>
  <div id="page-mine">
    <header>
      <img src="/src/assets/img/logo.png" alt="logo" class="logo" />
      <div class="account">iwangyang@qq.com</div>
      <img src="./exit_to_app.svg" alt="exit" class="exit" />
    </header>
    <main>
      <div class="nft-list">
        <div class="nft" v-for="(e, i) in nftList" :key="i">
          <img
            class="nft-image"
            :src="e.class_bg_image_url"
            alt="bg_image_url"
          />
          <div class="info">
            <div class="name">{{ e.name }}</div>
            <div class="user">
              <div class="user-name">{{ e.issuer_name }}</div>
              <img
                class="user-avator"
                :src="e.issuer_avatar_url"
                alt="user-avator"
              />
            </div>
          </div>
          <div class="have">{{ parseInt(Math.random() * (10 - 0) + 0) }}</div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nftList: [
        {
          token_uuid: '1f566d6b-51d8-479f-8156-2b003d668033',
          class_uuid: '4b67f5dc-1790-4c55-9ad9-1b78fcdeaf96',
          class_name: 'NFT Launch Live Show - Wallet',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621307008544.jpg',
          class_description:
            'View and manage your NFTs anywhere, anytime. Mibao Wallet makes it possible.\n\nUp to 5/17/2021, we have 569 NFTs, 158 creators and 270 collectors.',
          class_total: '33',
          class_issued: '31',
          tx_state: 'committed',
          issuer_name: 'Nervina Labs',
          issuer_avatar_url:
            'https://i.loli.net/2021/04/29/IigbpOWP8fw9qDn.png',
          issuer_uuid: '5c8603f6-2692-45ee-854a-5aa2908ffa86',
          from_address: '5c8603f6-2692-45ee-854a-5aa2908ffa86',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: 'd8f37634-2397-47ba-abd6-c50c7a164e05',
          class_uuid: 'ab67e154-fef0-4011-baa6-98c004d2c23f',
          class_name: 'NFT Launch Live Show / Exp',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621307084778.jpg',
          class_description:
            'Browse all the NFTs and related activities taking place on Nervos. NFT Explorer makes it possible.\n\nUp to 5/17/2021, we have 569 NFTs, 158 creators and 270 collectors.',
          class_total: '33',
          class_issued: '31',
          tx_state: 'committed',
          issuer_name: 'Nervina Labs',
          issuer_avatar_url:
            'https://i.loli.net/2021/04/29/IigbpOWP8fw9qDn.png',
          issuer_uuid: '5c8603f6-2692-45ee-854a-5aa2908ffa86',
          from_address: '5c8603f6-2692-45ee-854a-5aa2908ffa86',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '1a47f2a3-34ec-4a97-9cd5-2b91edba2f2e',
          class_uuid: '350ed222-5312-416f-b677-e3eee79a857d',
          class_name: '致2121年的你',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/21452ca3-1eb3-4ecd-8ede-cd27b6e315b9.jpg',
          class_description:
            '2021年5月，Nervos第一个NFT平台主网上线，标志着加密世界的应用不再曲高和寡。但在此时，即使在全球加密社区内，它也只是让一小撮人激动不已。这幅图内就是现在市值前100的数字代币，CKB仍未入列。但……^_^\n当你坚持的事物长得都是反复思索后想象中应有的样子，但是世界只给了冰冷的反应，该怎么办？希望Nervos的历史可以给你帮助。\nFrom 一个坚信世界会更美好的20世纪生中国人',
          class_total: '1501',
          class_issued: '38',
          tx_state: 'committed',
          issuer_name: 'Peace',
          issuer_avatar_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/f78517e3-82fb-42c3-901e-451f50a5d395.jpg',
          issuer_uuid: '00b6c108-817a-4406-b12f-933a3930bd2b',
          from_address: '00b6c108-817a-4406-b12f-933a3930bd2b',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '76e7ad40-86da-497e-8094-b598acbb599a',
          class_uuid: '035c77a5-0dad-4b63-8c74-e92710af9f2b',
          class_name: 'CKB吧内容贡献荣誉勋章',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621269182710.png',
          class_description:
            '该勋章授予 2021/5/15 前，为 CKB 吧输出过精华内容的各位内容创作者——因为有你们，让更多人愿意去了解 Nervos；因为有你们，让很多用户消除了疑虑；因为有你们，使CKB社区变得更加强大！',
          class_total: '28',
          class_issued: '13',
          tx_state: 'committed',
          issuer_name: '一休哥',
          issuer_avatar_url:
            'https://oss-cdn2.bihu-static.com/avatar/20200727/0d3f3ab7b6df856dbe5eb62f5d16164b_GEZDGOJOGAVDCMRTHEXDA.jpeg',
          issuer_uuid: 'f02e4b7a-493a-412f-8940-0f2b70d11d48',
          from_address: 'f02e4b7a-493a-412f-8940-0f2b70d11d48',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '11d21ecb-7117-453f-922a-a76d3129b97c',
          class_uuid: 'd3a5ceeb-81cd-47d5-a190-603f44c1f3da',
          class_name: '小姐姐是第一生产力',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/8252e01e-2975-49f5-b8a9-f7b86846c849.jpeg',
          class_description: '小姐姐是第一生产力',
          class_total: '0',
          class_issued: '4',
          tx_state: 'committed',
          issuer_name: 'Orange',
          issuer_avatar_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/4ea413e0-a207-4bb4-9855-2cac6b94f521.png',
          issuer_uuid: 'b1f6c0ac-85da-4343-a752-dfad65510b3b',
          from_address: 'b1f6c0ac-85da-4343-a752-dfad65510b3b',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '37be5810-d9d5-4252-9736-7aa602695f7e',
          class_uuid: '85bfa627-d69f-4984-8c35-0103098a4081',
          class_name: 'NFT Launch Live Show / Stage',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621306879821.jpg',
          class_description:
            'Create and distribute your NFT in just one minute. Golden Legend makes it possible. \n\nUp to 5/17/2021, we have 569 NFTs, 158 creators and 270 collectors.',
          class_total: '33',
          class_issued: '31',
          tx_state: 'committed',
          issuer_name: 'Nervina Labs',
          issuer_avatar_url:
            'https://i.loli.net/2021/04/29/IigbpOWP8fw9qDn.png',
          issuer_uuid: '5c8603f6-2692-45ee-854a-5aa2908ffa86',
          from_address: '5c8603f6-2692-45ee-854a-5aa2908ffa86',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '89b8e7a1-e2e2-49d5-b4bb-7adee511edcb',
          class_uuid: 'ab572229-fad1-4895-9727-49a39a53e174',
          class_name: '雷兔伙伴',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621322667319.png',
          class_description: '出圈路上，感谢有你。',
          class_total: '119',
          class_issued: '43',
          tx_state: 'committed',
          issuer_name: 'zhixian',
          issuer_avatar_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621061897883.png',
          issuer_uuid: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          from_address: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: 'cf6cae28-e827-4cde-a9a5-ac6af4cdaed1',
          class_uuid: 'ab572229-fad1-4895-9727-49a39a53e174',
          class_name: '雷兔伙伴',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621322667319.png',
          class_description: '出圈路上，感谢有你。',
          class_total: '119',
          class_issued: '43',
          tx_state: 'committed',
          issuer_name: 'zhixian',
          issuer_avatar_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621061897883.png',
          issuer_uuid: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          from_address: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '8fe2c730-a6f8-4fda-b02f-da1cf01a72c1',
          class_uuid: 'ab572229-fad1-4895-9727-49a39a53e174',
          class_name: '雷兔伙伴',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621322667319.png',
          class_description: '出圈路上，感谢有你。',
          class_total: '119',
          class_issued: '43',
          tx_state: 'committed',
          issuer_name: 'zhixian',
          issuer_avatar_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621061897883.png',
          issuer_uuid: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          from_address: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
        {
          token_uuid: '49569316-6d68-44ba-b217-bfe79de61224',
          class_uuid: 'ab572229-fad1-4895-9727-49a39a53e174',
          class_name: '雷兔伙伴',
          class_bg_image_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621322667319.png',
          class_description: '出圈路上，感谢有你。',
          class_total: '119',
          class_issued: '43',
          tx_state: 'committed',
          issuer_name: 'zhixian',
          issuer_avatar_url:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1621061897883.png',
          issuer_uuid: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          from_address: '6a08a483-cae6-4710-a9e4-4e3ba462c7f6',
          to_address:
            'ckb1q3s56s9gdcdjn285mrvnh8em8y9lwsyq87se5603e9t3dcpfagym8j5t3my7n5svshj62hrvjr7kjkyvkhetc5s9tw5',
        },
      ],
    }
  },
}
</script>

<style lang="stylus">
#page-mine {
  >header {
    display: flex;
    align-items: center;
    background: var(--primary);
    padding: 7px 36px;
    margin: 10px;
    border-radius: 4px;

    .logo {
      width: 46px;
      height: 46px;
    }

    .account {
      margin-left: 12px;
      color: #fff;
    }

    .exit {
      margin-left: auto;
    }
  }

  >main {
    .nft-list {
      .nft {
        display: flex;

        .nft-image {
          height: 50px;
          width: 50px;
        }
      }
    }
  }
}
</style>