<template>
  <div id="page-record">
    <back />
    Record
  </div>
</template>

<script>
export default {
  async activated() {
    const provider = await Sea.bindLogin()
    const address = provider._address.addressString
    console.log('address', address)
  },
}
</script>

<style lang="stylus">
#page-record {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
