---
title: vue脚手架(vue-cli)由2升级到3时遇到的问题汇总
date: 2019-04-18 19:50:24
tags:
---

## 问题

近期将项目的 vue 脚手架由 2 升级到了 3，在此过程中遇到的一些问题记录如下

## 案例

1. vue 挂载方式改变

```javascript
//原方式
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
// 现改为
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

2. HTML 标签之间的间隙默认被删除，表现为原来在页面上内联元素之间因换行产生的空隙没有了

```javascript
// 由于原项目并没有处理空隙，而且利用了空隙，为保持表现一致，可添加如下配置
chainWebpack: config => {
  config.module
    .rule('vue')
    .use('vue-loader')
    .loader('vue-loader')
    .tap(options => {
      options.compilerOptions.preserveWhitespace = true
      return options
    })
}
```

3. 