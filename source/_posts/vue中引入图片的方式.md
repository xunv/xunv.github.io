---
title: vue中引入图片的方式
date: 2018-08-16 14:11:14
tags: vue
---
## template和css中

在 template 的 img 标签等和 css 的背景图中

```html
<img class="logo-img" src="~@/assets/logo/logo.png" key="max-logo" />
```

```css
background: url(~@/assets/dongdong.png) 4px 4px no-repeat;
```

其中‘~’为的是让 webpack 识别这是一个路径，‘@’表示 webpack 中配置的路径别名，此处表示 src 文件夹

## 在js中

在 js 中作为变量引入时，需要以 require 的方式引入

```javascript
default_avatar() {
  return require('@/assets/avatar/avatar_' + this.name.length % 10 + '.png')
}
```

此处引入不需要前面写‘~’

## assets与static的区别

1. 静态文件（主要指图片）均放在了src文件夹下的assets下，此处考虑到引入的资源都是属于项目本身的文件；此处的文件会被webpack的插件处理，如压缩，base64，hash等；
2. static中应放置公共的类库等，如jQuery；此处的文件会直接复制到输出文件夹dist下的static中，不会被webpack处理；引入时直接以绝对路径引入即可。