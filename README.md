# unipass-vite

> A starter kit for Element Plus with Vite

<img width="800" alt="Element Plus" src="https://user-images.githubusercontent.com/10731096/97282764-0726eb80-187a-11eb-9658-6dc98ccb8f8d.png">

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run dev
```

### Compiles and minifies for production

```
yarn run build
```

### Preview for production

```
yarn run preview
```

## npm registry

- 当前
  `yarn config get registry`
- 默认
  `yarn config set registry https://registry.yarnpkg.com`
- 腾讯
  `yarn config set registry https://mirrors.cloud.tencent.com/npm`
  `

## vuex

```js
// 获取
this.$store.state.toekn
this.$store.getters.getToken
// 同步更新
this.$store.state.toekn = 'dudu'
this.$store.commit('setToken', 'dudu')
// 异步更新
await this.$store.dispatch('setTokenAsync', 'dudu')
```

## router

https://segmentfault.com/a/1190000039157357
