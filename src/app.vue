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
  min-height: 100vh;

  > main {
    flex: 1;
    width: 100%;
  }
}
</style>
