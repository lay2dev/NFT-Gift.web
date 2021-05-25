<template>
  <div id="page-gift">
    <div class="image-box">
      <el-image :src="gift.class_bg_image_url" fit="contain" alt="image" />
    </div>
    <div class="info-box">
      <div class="info">
        <main>
          <div class="name">{{ gift.class_name }}</div>
          <div class="description">{{ gift.class_description }}</div>
          <div class="user">
            <div class="user-name">
              <span>{{ gift.issuer_name }}</span>
              <el-image
                class="user-avator"
                :src="gift.issuer_avatar_url"
                alt="user-avator"
                fit="cover"
              >
                <template #error>
                  <div class="el-image__error"></div>
                </template>
              </el-image>
            </div>
            <div class="user-total">{{ gift.class_total }}</div>
          </div>
        </main>
        <footer>
          <el-button
            type="primary"
            icon="el-icon-shopping-bag-1"
            @click="showSend = true"
          >
            赠送
          </el-button>
        </footer>
      </div>
    </div>
  </div>
  <el-dialog title="赠送" v-model="showSend" width="300px">
    <el-form :model="form">
      <div>
        您当前拥有
        <span :style="{ color: 'var(--primary)' }">{{ total }}</span>
        个
      </div>
      <el-form-item label="赠送个数">
        <br />
        <el-input-number
          v-model="form.number"
          :min="1"
          :max="total"
          step-strictly
        ></el-input-number>
      </el-form-item>
      <el-form-item label="红包口令">
        <el-input
          v-model.trim="form.password"
          maxlength="16"
          show-word-limit
          placeholder="领取红包时验证"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showSend = false">取 消</el-button>
        <el-button type="primary" @click="showSend = false">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      form: {
        number: 1,
        password: '',
      },
      total: 2,
      showSend: false,
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
  methods: {
    bindSend() {
      const total = 2
      this.$prompt(`你当前拥有 ${total} 个，赠送几个？`, '赠送', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入赠送的个数',
        inputType: 'number',
        inputValue: 1,
        inputValidator: (v) => {
          const n = parseInt(v)
          if (n > total) {
            return `不能超过 ${total} 个`
          }
          return true
        },
      })
        .then(({ value }) => {
          this.send(parseInt(value))
        })
        .catch(() => {})
    },
    send() {
      this.$prompt('请输入红包口令', '红包口令', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入赠送的个数',
        inputType: 'number',
        inputValue: 1,
      }).then(({ value }) => {
        this.send(parseInt(value))
      })
    },
  },
}
</script>
<style lang="stylus">
#page-gift {
  background: #eee;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .image-box {
    display: flex;
    justify-content: center;
    height: 343px;
    align-items: center;

    img {
      width: 300px;
      height: 300px;
      // will-change: transform;
      // transition: all 1000ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s;
      // transform: perspective(1000px) rotateX(0deg) rotateY(15deg) scale3d(1, 1, 1);
    }
  }

  .info-box {
    flex: 1;
    display: flex;

    .info {
      background: rgb(250, 250, 250);
      width: 100%;
      border-radius: 25px 25px 0px 0px;
      box-shadow: rgb(0 0 0 / 6%) 0px 4px 2px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      >main {
        width: 100%;
        padding: 20px;

        .name {
          font-size: 18px;
        }

        .description {
          margin-top: 12px;
          font-size: 14px;
          line-height: 18px;
          color: #aaa;
          text-align: justify;
        }

        .user {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(0, 0, 0, 0.8);

          .user-name {
            display: flex;
            align-items: center;

            span {
              font-size: 14px;
            }

            img {
              margin-left: 4px;
              width: 18px;
              height: 18px;
            }
          }

          .user-total {
            font-size: 14px;
            color: #aaa;
          }
        }
      }

      >footer {
        width: 100%;
        height: 80px;
        background: white;
        border-radius: 35px 35px 0px 0px;
        box-shadow: rgb(0 0 0 / 6%) 0px 6px 2px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>