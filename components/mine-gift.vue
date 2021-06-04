<template>
  <el-dialog
    :visible.sync="showDialog"
    class="dialog-gift"
    title="创建 NFT 红包"
    width="90%"
  >
    <div id="mine-gift">
      <div class="gift-title">塞 NFT 进红包</div>
      <div class="nfts">
        <div class="nft">
          <div class="nft-title">NFT Launch Live</div>
          <div class="nft-box">
            <div class="nft-one">#2</div>
            <div class="nft-one">#3</div>
            <div class="nft-one">#6</div>
            <div class="nft-one">#12</div>
          </div>
        </div>
        <div class="nft">
          <div class="nft-title">雷兔伙伴</div>
          <div class="nft-box">
            <div class="nft-one">#5</div>
          </div>
        </div>
      </div>
      <div class="total">总计：5个</div>
      <div class="passowrd">
        <div class="title">红包口令</div>
        <el-input class="input"></el-input>
        <div class="tip">注：每个红包一个地址仅可领取一次</div>
      </div>
      <div class="button">
        <el-button>取消</el-button>
        <el-button type="primary">下一步</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: Boolean,
    nfts: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  computed: {
    showDialog: {
      get() {
        return this.$props.show
      },
      set(val) {
        this.$emit('update:show', val)
      },
    },
  },
  watch: {
    showDialog(nv) {
      if (nv === true) {
        this.init()
      }
    },
  },
  methods: {
    init() {
      console.log('🌊', this.nfts)
    },
  },
}
</script>
<style lang="stylus">
#mine-gift {
  .gift-title {
    font-size: 18px;
  }

  .nfts {
    margin-top: 8px;
    border-top: 1px dashed #bbb;
    border-bottom: 1px dashed #bbb;
    padding: 10px 0;

    .nft {
      .nft-title {
        font-weight: 400;
        font-size: 16px;
        color: #101010;
      }

      .nft-box {
        margin-top: 14px;
        margin-bottom: 14px;
        display: flex;
        flex-wrap: wrap;

        .nft-one {
          margin-right: 10px;
        }
      }
    }
  }

  .total {
    margin-top: 16px;
    font-size: 16px;
  }

  .passowrd {
    .title {
      margin-top: 32px;
      font-size: 18px;
    }

    .input {
      margin-top: 4px;
    }

    .tip {
      margin-top: 4px;
    }
  }

  .button {
    margin-top: 23px;
    display: flex;
    justify-content: space-between;

    .el-button {
      width: 48%;
    }
  }
}
</style>
