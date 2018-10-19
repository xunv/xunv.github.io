---
title: vue使用中问题
date: 2018-10-11 15:45:52
tags:
---
## 前言

记录vue在使用中遇到的需要注意的问题

## 正文

1. vue-router中路由path值的问题

在嵌套路由使用时，设置path值的时候，注意，如是顶层路由，可以写为`/home`,即可以加`/`；在设置二级路由的时候虽然也可以这么写，但就失去了路由层级，在[官方文档](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)中有提示：  
>要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。  

2. vue-router中路由name值的问题

在编程导航的时候，我们可以使用path或者name，使用name的时候发现，name的值不可以重复，就算时平行路由各自的子路由也不能重复name，否则导航发生混乱；

