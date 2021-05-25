<template>
  <img
    id="component-back"
    @click="$router.back()"
    src="/src/assets/img/back.svg"
    alt="back"
  />
</template>
<style>
#component-back {
  cursor: pointer;
  position: fixed;
  top: 8px;
  left: 0px;
  width: 35px;
  height: 35px;
  z-index: 100;
}
</style>