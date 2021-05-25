<template>
  <div id="page-mine">
    <header>
      <img src="/src/assets/img/logo.png" alt="logo" class="logo" />
      <div class="account">iwangyang@qq.com</div>
    </header>
  </div>
</template>

<style lang="stylus">
#page-mine {
  >header {
    display: flex;
    align-items: center;
    background: var(--primary);
    padding: 7px 36px;

    .logo {
      width: 46px;
      height: 46px;
    }

    .account {
      margin-left: 12px;
      color: #fff;
    }
  }
}
</style>