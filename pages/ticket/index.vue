<template>
  <div id="page-ticket">
    <el-image
      class="background"
      fit="cover"
      :src="require('~/assets/img/ticket/background.png')"
    />
    <el-image
      v-show="state === ''"
      class="get"
      :src="require('~/assets/img/ticket/get-wait.png')"
    />
    <el-image
      v-show="state === 'success'"
      class="get"
      :src="require('~/assets/img/ticket/get-success.png')"
    />
    <el-image
      v-show="state === 'fail'"
      class="get"
      :src="require('~/assets/img/ticket/get-already.png')"
    />
    <div class="bottom">
      <div class="btn-box" @click="bindGet">
        <el-image class="btn" :src="require('~/assets/img/ticket/btn.svg')" />
        <div class="txt">{{ btnText }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      state: '',
    }
  },
  computed: {
    btnText() {
      if (this.state === 'success') {
        return '查看领取的数字纪念品'
      } else if (this.state === 'fail') {
        return '探索更多的数字纪念品'
      } else {
        return '登录并领取数字纪念品'
      }
    },
  },
  methods: {
    bindGet() {
      const loading = this.$loading()
      setTimeout(() => {
        this.state = 'success'
        loading.close()
      }, 2000)
    },
  },
}
</script>
<style lang="stylus">
#page-ticket {
  margin: 0 auto;
  max-width: 500px;
  position: relative;
  background: #EEE;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .get {
    margin-top: 16vh;
    width: 299px;
    height: 340px;
  }

  .bottom {
    position: absolute;
    bottom: 15vh;

    .btn-box {
      cursor: pointer;
      position: relative;
      // margin-top: 15vh;
      // margin-bottom: 10vh;
      font-weight: bold;
      user-select: none;

      .txt {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 8px;
      }
    }
  }
}

@media (min-width: 500px) {
  #page-ticket {
    min-height: 667px;
  }
}
</style>
