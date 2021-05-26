# nuxt

## 设置 npm 镜像源

查看当前
`yarn config get registry`
默认
`yarn config set registry https://registry.yarnpkg.com`
腾讯 [教程](https://cloud.tencent.com/document/product/213/8623)
`yarn config set registry https://mirrors.cloud.tencent.com/npm`

## 行尾序列

先设置 [教程](https://juejin.cn/post/6844904069304156168)
`git config --global core.autocrlf false`
再重新克隆项目

## Build Setup

```bash
# 安装依赖
$ yarn install

# 启动服务 localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# 静态打包
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
