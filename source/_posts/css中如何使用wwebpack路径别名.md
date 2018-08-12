---
title: css中如何使用wwebpack路径别名
date: 2018-08-12 13:59:32
categories: webpack
tags: webpack
---

## 引言

在用 Webpack 处理打包时，可将某一目录配置一个别名，代码中就能使用与别名的相对路径引用资源。在 Vue 项目中，我们通常使用 vue-webpack 脚手架生成工程模板，然后配置 @ 为项目根目录下放资源和源码的 /src 目录的别名。
```javascript
resolve: {
  ...,
  alias: {
    '@': resolve('src')
  }
}
```
这样我们就可以在 js 中用导入模板文件或者js就可以用如下方式导入：
```javascript
import tool from '@/style/xxx'
```
但是在样式文件（css/less/scss等）中，使用 @import "@/style/theme" 的语法引用相对 @ 的目录确会报错，“找不到 ‘@’ 目录”，说明 webpack 没有正确识别资源相对路径。

## 分析

原因是 css 文件会被用 css-loader 处理，这里 css @import 后的字符串会被 css-loader 视为绝对路径解析，因为我们并没有添加 css-loader 的 alias，所以会报找不到 @ 目录。

## 解决

在 Webpack 中 css import 使用 alias 相对路径的解决办法有两种；

### 方法一-添加模块路径

直接为 css-loader 添加 ailas 的路径，但是在 vue-webpack 给的模板中，单独针对这个插件添加配置就显得麻烦冗余了；  
方法是：
```javascript
// 添加配置
modules: [
      resolve('src'), 
      resolve('node_modules')
    ],
alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
```
这样我们就可以在vue页面如下导入css文件
```javascript
@import '~assets/css/all.scss'; // assets是src目录下的文件夹
```

### 方法二-添加‘~’符号

是在引用路径的字符串最前面添加上 ~ 符号，如下
```javascript
@import '~@/assets/css/all.scss'; // assets是src目录下的文件夹
```
Webpack 会将以 ~ 符号作为前缀的路径视作依赖模块而去解析，这样 @ 的 alias 配置就能生效了。  

看起来还是方法二方便，不用配置webpack，直接使用。

## 总结

~ 视为模块解析是 webpack 做的事，不是 css-loader 做的事。  
各类非 js 直接引用（import require）静态资源，依赖相对路径加载问题，都可以用 ~ 语法完美解决。
```javascript
css module 中： @import "~@/style/theme"
css 属性中： background: url("~@/assets/xxx.jpg")
html 标签中： <img src="~@/assets/xxx.jpg" alt="alias">
```
