<template>
  <div id="page-mine">
    <header>
      <img src="/src/assets/img/logo.png" alt="logo" class="logo" />
      <div class="account">iwangyang@qq.com</div>
      <img
        src="./exit_to_app.svg"
        alt="exit"
        class="exit"
        @click="$router.push('/')"
      />
    </header>
    <main>
      <div class="nft-list">
        <template v-for="(e, i) in nftList" :key="i">
          <router-link
            :to="{ path: '/gift', query: { class_uuid: e.class_uuid } }"
          >
            <div class="nft">
              <div class="left">
                <el-image
                  class="nft-image"
                  :src="e.class_bg_image_url"
                  alt="bg_image_url"
                  fit="cover"
                  lazy
                  :preview-src-list="[e.class_bg_image_url]"
                />
                <div class="info">
                  <div class="name">{{ e.class_name }}</div>
                  <div class="user">
                    <el-image
                      class="user-avator"
                      :src="e.issuer_avatar_url"
                      alt="user-avator"
                      fit="cover"
                      lazy
                    >
                      <template #error>
                        <div class="el-image__error"></div>
                      </template>
                    </el-image>
                    <div class="user-name">{{ e.issuer_name }}</div>
                  </div>
                </div>
              </div>
              <div class="right">
                {{ parseInt(Math.random() * (1000 - 0) + 0) }}
              </div>
            </div>
          </router-link>
        </template>
      </div>
    </main>
  </div>
</template>
<script>
import mock from './mock.js'
export default {
  data() {
    return {
      nftList: mock,
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
      user-select: none;
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
        padding: 16px 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        >.left {
          display: flex;
          align-items: center;

          .nft-image {
            height: 50px;
            width: 50px;
            flex-shrink: 0;

            img {
              border: 1px solid #eee;
              border-radius: 4px;
            }
          }

          .info {
            margin-left: 10px;

            .name {
              color: rgba(16, 16, 16, 100);
              font-size: 16px;
            }

            .user {
              margin-top: 5px;
              display: flex;
              align-items: center;

              .user-avator {
                width: 18px;
                height: 18px;
                border-radius: 2px;
              }

              .user-name {
                font-size: 14px;
                margin-left: 6px;
                color: #aaa;
              }
            }
          }
        }

        .right {
          color: var(--primary);
          font-size: 18px;
        }
      }

      .nft:active, .nft:hover {
        background: #eee;
      }
    }
  }
}
</style>