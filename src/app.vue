<template>
  <header></header>
  <main>
    <router-view />
  </main>
  <footer></footer>
</template>
<style lang="stylus">
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  > main {
    width: 100%;
  }
}

@media (min-width: 500px) {
  #app {
    // background: rgb(250, 250, 250);
    // > main {
    // position: relative;
    // max-width: 375px;
    // max-height: 667px;
    // overflow: hidden;
    // }
  }
}
</style>
