<template>
  <el-dialog
    id="dialog-asset"
    :visible.sync="showDialog"
    :show-close="false"
    fullscreen
  >
    <back stop @click="showDialog = false" />
    <img :src="nft.renderer" alt="blur" class="blur" />
    <main>
      <section>
        <div ref="section" class="wrap section">
          <img class="container" :src="nft.renderer" alt="container" />
        </div>
      </section>
      <h1>{{ nft.name }}</h1>
      <p>{{ nft.description || '-' }}</p>
      <div class="user">
        <div class="user-name">
          <el-image
            class="user-avator"
            :src="nft.issuerAvatarUrl"
            alt="user-avator"
            fit="cover"
          >
            <template #error>
              <div class="el-image__error"></div>
            </template>
          </el-image>
          <span>{{ nft.issuerName }}</span>
        </div>
        <div class="user-total">
          <div>
            {{ t_('have') }} {{ nft.children ? nft.children.length : 1 }} /
            {{ t_('quantum') }}
            {{ nft.total === 0 ? t_('unlimited') : nft.total }}
          </div>
          <!-- <div>共有 {{ nft.total === 0 ? '无限' : nft.total }}</div>
          <div>已分发 {{ nft.issued }}</div>
          <div>当前 #{{ nft.tokenId }}</div> -->
        </div>
      </div>
    </main>
  </el-dialog>
</template>
<script>
class ParallaxTiltEffect {
  constructor({ element, tiltEffect }) {
    this.element = element
    this.container = this.element.querySelector('.container')
    this.size = [300, 360]
    ;[this.w, this.h] = this.size

    this.tiltEffect = tiltEffect

    this.mouseOnComponent = false

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.defaultStates = this.defaultStates.bind(this)
    this.setProperty = this.setProperty.bind(this)
    this.init = this.init.bind(this)

    this.init()
  }

  handleMouseMove(event) {
    const { offsetX, offsetY } = event

    let X
    let Y

    if (this.tiltEffect === 'reverse') {
      X = (offsetX - this.w / 2) / 3 / 3
      Y = -(offsetY - this.h / 2) / 3 / 3
    } else if (this.tiltEffect === 'normal') {
      X = -(offsetX - this.w / 2) / 3 / 3
      Y = (offsetY - this.h / 2) / 3 / 3
    }

    this.setProperty('--rY', X.toFixed(2))
    this.setProperty('--rX', Y.toFixed(2))

    this.setProperty('--bY', 80 - (X / 4).toFixed(2) + '%')
    this.setProperty('--bX', 50 - (Y / 4).toFixed(2) + '%')
  }

  handleMouseEnter() {
    this.mouseOnComponent = true
    this.container.classList.add('container--active')
  }

  handleMouseLeave() {
    this.mouseOnComponent = false
    this.defaultStates()
  }

  defaultStates() {
    this.container.classList.remove('container--active')
    this.setProperty('--rY', 0)
    this.setProperty('--rX', 0)
    this.setProperty('--bY', '80%')
    this.setProperty('--bX', '50%')
  }

  setProperty(p, v) {
    return this.container.style.setProperty(p, v)
  }

  init() {
    this.element.addEventListener('mousemove', this.handleMouseMove)
    this.element.addEventListener('mouseenter', this.handleMouseEnter)
    this.element.addEventListener('mouseleave', this.handleMouseLeave)
  }
}
export default {
  props: {
    show: Boolean,
    nft: {
      type: Object,
      default: () => {
        return {
          children: [],
        }
      },
    },
  },
  data() {
    return {
      inited: false,
    }
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
    show(nv) {
      if (nv === true && this.inited === false) {
        this.init()
      }
    },
  },
  methods: {
    t_(key) {
      return this.$t(`home.${key}`)
    },
    init() {
      this.inited = true
      this.$nextTick(() => {
        // eslint-disable-next-line no-new
        new ParallaxTiltEffect({
          element: this.$refs.section,
          tiltEffect: 'reverse',
        })
      })
    },
  },
}
</script>
<style lang="stylus">
#dialog-asset {
  .el-dialog {
    .el-dialog__header {
      padding: 0;
    }
  }

  .blur {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: blur(180px);
    width: 100%;
    height: 100%;
  }

  main {
    color: hsla(0, 0%, 0%, 0.6);
    text-align: center;
    z-index: 2;
    position: relative;

    h1 {
      font-size: 32px;
      padding-top: 32px;
      word-break: break-word;
    }

    h1 + p {
      font-size: 20px;
      padding: 32px 20px;
    }

    .user {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .user-name {
        display: flex;
        align-items: center;

        span {
          font-size: 16px;
          margin-left: 6px;
        }

        img {
          width: 18px;
          height: 18px;
        }
      }

      .user-total {
        text-align: right;
        font-size: 16px;
      }
    }

    section {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      .wrap {
        margin: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -webkit-transform: perspective(100rem);
        transform: perspective(100rem);
      }

      .container {
        --rX: 0;
        --rY: 0;
        --bX: 50%;
        --bY: 80%;
        max-width: 300px;
        max-height: 300px;
        border: 1px solid #e8eaed;
        border-radius: 1.6rem;
        overflow: hidden;
        padding: 6px;
        display: flex;
        -webkit-transform: rotateX(calc(var(--rX) * 1deg));
        rotateY(calc(var(--rY) * 1deg));
        transform: rotateX(calc(var(--rX) * 1deg)) rotateY(calc(var(--rY) * 1deg));
        background: linear-gradient(hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.1));
        background-position: var(--bX) var(--bY);
        background-size: 40rem auto;
        box-shadow: 0 0 3rem 0.5rem hsla(0, 0%, 0%, 0.24);
        transition: -webkit-transform 0.6s 1s;
        transition: transform 0.6s 1s;
        transition: transform 0.6s 1s, -webkit-transform 0.6s 1s;
      }

      .container::before, .container::after {
        content: '';
        width: 2rem;
        height: 2rem;
        border: 1px solid #fff;
        position: absolute;
        z-index: 2;
        opacity: 0.3;
        transition: 0.3s;
      }

      .container::before {
        top: 2rem;
        right: 2rem;
        border-bottom-width: 0;
        border-left-width: 0;
      }

      .container::after {
        bottom: 2rem;
        left: 2rem;
        border-top-width: 0;
        border-right-width: 0;
      }

      .container--active {
        /* transition: none; */
        transition: all 0.6s;
      }

      .container p {
        color: hsla(0, 0%, 100%, 0.6);
        font-size: 2.2rem;
      }
    }

    .wrap:hover .container::before, .wrap:hover .container::after {
      width: calc(100% - 4rem);
      height: calc(100% - 4rem);
    }
  }
}
</style>
