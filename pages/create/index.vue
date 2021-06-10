<template>
  <div id="page-create">
    <back>
      <router-link to="/record">红包记录</router-link>
    </back>
    <img class="bg" src="~/assets/img/bg.png" alt="backgorund" />
    <main>
      <div class="title">NFT 红包</div>
      <div class="subtitle">抢 NFT 红包，玩加密新社交</div>
      <div
        v-if="nfts.length > 0"
        class="box checked"
        @click="showSelect = true"
      >
        <div class="top">
          <img src="~/assets/img/create_giftcard.svg" alt="create_giftcard" />
          <div class="text">
            <div class="t1">选择 NFT</div>
            <div class="t2">好友打开红包，即可领 NFT</div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div v-else class="box select" @click="showSelect = true">
        <img src="~/assets/img/create_giftcard.svg" alt="create_giftcard" />
        <div class="text">
          <div class="t1">选择 NFT</div>
          <div class="t2">好友打开红包，即可领 NFT</div>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="box number">
        <div class="left">
          <span>红包个数</span>
          <i class="el-icon-question"></i>
        </div>
        <div class="right">
          <input v-model.number="number" placeholder="填写个数" />
          <span>个</span>
        </div>
      </div>
      <div class="box password">
        <span>红包口令</span>
        <input v-model="password" type="text" />
        <div class="tip">对方输入口令，即可领取红包</div>
      </div>
      <el-button class="btn-create" @click="bindCreate">
        生成 NFT 红包
      </el-button>
    </main>
    <create-select :show.sync="showSelect" @select="bindSelect" />
  </div>
</template>
<script>
import CreateSelect from '~/components/create-select.vue'
export default {
  components: { CreateSelect },
  data() {
    return {
      number: '',
      password: '恭喜发财',
      showSelect: false,
      nfts: [
        {
          outPoint: {
            txHash:
              '0x9ab0b9ef6a8e7f85daf75f10abceb37d3c57f7ef5e34e8d0c4c2248ea0d5710e',
            index: '0x2',
          },
          txState: 'committed',
          nftTypeArgs:
            '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c0000000600000001',
          classTypeArgs: '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c00000006',
          total: 0,
          issued: 13,
          name: '史迪仔',
          description: '',
          renderer:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/f5285fd8-56bf-4ddc-a001-e80b80bd1493.jpeg',
          issuerName: 'stitch',
          issuerAvatarUrl:
            'https://images.669pic.com/element_min_new_pic/74/45/47/87/35527c466c113c635dac7ffe63844024.png',
          tokenId: 1,
        },
        {
          outPoint: {
            txHash:
              '0x927da791ee057b31922fb0b3ba464cd5b68b0fba9644f97d6d8e7e22dc48223d',
            index: '0x3',
          },
          txState: 'committed',
          nftTypeArgs:
            '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c0000000700000002',
          classTypeArgs: '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c00000007',
          total: 0,
          issued: 20,
          name: '皮卡丘',
          description: '',
          renderer:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/e36b3301-b888-4dfb-8fad-85a07fb18b3f.jpg',
          issuerName: 'stitch',
          issuerAvatarUrl:
            'https://images.669pic.com/element_min_new_pic/74/45/47/87/35527c466c113c635dac7ffe63844024.png',
          tokenId: 2,
        },
        {
          outPoint: {
            txHash:
              '0x927da791ee057b31922fb0b3ba464cd5b68b0fba9644f97d6d8e7e22dc48223d',
            index: '0x4',
          },
          txState: 'committed',
          nftTypeArgs:
            '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c0000000700000003',
          classTypeArgs: '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c00000007',
          total: 0,
          issued: 20,
          name: '皮卡丘',
          description: '',
          renderer:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/e36b3301-b888-4dfb-8fad-85a07fb18b3f.jpg',
          issuerName: 'stitch',
          issuerAvatarUrl:
            'https://images.669pic.com/element_min_new_pic/74/45/47/87/35527c466c113c635dac7ffe63844024.png',
          tokenId: 3,
        },
        {
          outPoint: {
            txHash:
              '0x927da791ee057b31922fb0b3ba464cd5b68b0fba9644f97d6d8e7e22dc48223d',
            index: '0x5',
          },
          txState: 'committed',
          nftTypeArgs:
            '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c0000000700000004',
          classTypeArgs: '0xcbdd0b6b31c77f63b51f776f1a58a8924ae6fa7c00000007',
          total: 0,
          issued: 20,
          name: '皮卡丘',
          description: '',
          renderer:
            'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/e36b3301-b888-4dfb-8fad-85a07fb18b3f.jpg',
          issuerName: 'stitch',
          issuerAvatarUrl:
            'https://images.669pic.com/element_min_new_pic/74/45/47/87/35527c466c113c635dac7ffe63844024.png',
          tokenId: 4,
        },
      ],
    }
  },
  methods: {
    bindSelect(nfts) {
      this.nfts = nfts
    },
    bindCreate() {
      this.$message('请选择 NFT')
    },
  },
}
</script>

<style lang="stylus">
#page-create {
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  >main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 43px 10px 0;

    .title {
      margin-top: 10px;
      color: rgba(255, 189, 132, 1);
      font-size: 20px;
      font-weight: bold;
    }

    .subtitle {
      margin-top: 21px;
      color: rgba(255, 189, 132, 0.68);
      font-size: 16px;
    }

    .box {
      width: 100%;
      line-height: 20px;
      background: rgba(255, 255, 255, 0.84);
      border-radius: 10px;
      color: rgba(16, 16, 16, 1);
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.44);
      border: 1px solid rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .box.select {
      background: rgba(255, 255, 255, 0.94);
      cursor: pointer;
      padding: 16px 8px;
      margin-top: 23px;

      .text {
        margin-left: 5px;

        .t1 {
          color: rgba(16, 16, 16, 1);
          font-size: 18px;
        }

        .t2 {
          margin-top: 7px;
          left: 63px;
          color: #AAA0A0;
          font-size: 12px;
        }
      }

      .el-icon-arrow-right {
        margin-left: auto;
        color: #000;
        font-size: 20px;
      }
    }

    .box.checked {
      background: rgba(255, 255, 255, 0.94);
      cursor: pointer;
      padding: 16px 8px;
      margin-top: 23px;

      .top {
        width: 100%;
        display: flex;

        img {
          width: 28px;
          height: 28px;
        }

        .text {
          margin-top: 4px;
          margin-left: 5px;

          .t1 {
            color: rgba(16, 16, 16, 1);
            font-size: 18px;
          }

          .t2 {
            margin-top: 7px;
            left: 63px;
            color: #AAA0A0;
            font-size: 12px;
          }
        }

        .el-icon-arrow-right {
          margin-top: 4px;
          margin-left: auto;
          color: #000;
          font-size: 20px;
        }
      }
    }

    .box.number {
      padding: 14px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      padding-bottom: 14px;
      margin-top: 11px;

      input {
        background: transparent;
        border: 0;
        outline: 0;
        text-align: right;
        font-size: 16px;
      }
    }

    .box.password {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      padding: 14px 12px;
      margin-top: 31px;

      span {
        align-self: flex-start;
      }

      input {
        margin: 12px 0;
        border: 0;
        outline: rgba(255, 189, 132, 1);
        width: 100%;
        height: 38px;
        border-radius: 4px;
        background-color: rgba(255, 189, 132, 0.24);
        text-align: center;
        color: rgba(210, 123, 48, 1);
        font-size: 16px;
      }

      .tip {
        font-size: 12px;
      }
    }

    .btn-create {
      margin-top: 31px;
      width: 173px;
      height: 40px;
      border-radius: 30px;
      background-color: rgba(255, 189, 132, 0.94);
      color: #ff4333;
      border: 1px solid rgba(255, 189, 132, 1);
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.44);
      font-weight: bold;
    }

    .btn-create:hover {
      background-color: rgba(255, 189, 132, 0.84);
    }

    .btn-create:active {
      background-color: rgba(255, 189, 132, 1);
    }
  }
}
</style>
