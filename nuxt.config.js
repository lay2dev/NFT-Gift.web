export default {
  ssr: false,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NFT Gift',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        ref: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/normalize.css@latest/normalize.min.css',
      },
    ],
    script: [
      // { src: '' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@assets/css/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/element-ui', '@/plugins/main'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    publicPath: process.env.OSS_PUBLIC_PATH,
  },

  env: {
    // # unipass
    UNIPASS_TYPE_ID:
      '0x124a60cd799e1fbca664196de46b3f7f0ecb7138133dcaea4893c51df5b02be6',
    UNIPASS_URL: 'https://unipass.me',
    UNIPASS_GA: '',
    // #
    NODE_URL: 'https://testnet.ckb.dev',
    INDEXER_URL: 'https://testnet.ckb.dev/indexer',
    CHAIN_ID: 0,
    // #
    RSA_TXHASH:
      '0xd346695aa3293a84e9f985448668e9692892c959e7e83d6d8042e59c08b8cf5c',
    ACP_TXHASH:
      '0x04a1ac7fe15e454741d3c5c9a409efb9a967714ad2f530870514417978a9f655',
    // UNIPASS_TYPE_ID:
    //   '0x124a60cd799e1fbca664196de46b3f7f0ecb7138133dcaea4893c51df5b02be6',
    TIMELOCK_TYPE_ID:
      '0xbfc3c5e89934e54e488cfec3c4dd0a58fb75e5635de9006349d6ff91aad84bae',
    UNIPASS_TIMELOCK_SINCE: '0x8000000000000064',
    TIMELOCK_TXHASH:
      '0x2119d8035c60d407aa08031625cb4c976b5c7c7b4797b164cd9b2b3cca14861e',
    UNIPASS_TXHASH:
      '0x86a2b5e12372b88bf4c288e99626c016d00a3aad37fe34781bca3ff3842373d0',
    TOKEN_SCRIPT_TXHASH:
      '0x7f9e3c1a2fc90411eb90fc2363101f6bd7b33875c3535117db5e52cd8a78b313',
    // nft gift
    NFT: 'https://devapi.gift.unipass.me',

    // goldenlegend
    GOLDEN: 'https://goldenlegend.test.nervina.cn',
  },

  // eslint
  eslint: {
    fix: true,
  },

  // server
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
}
