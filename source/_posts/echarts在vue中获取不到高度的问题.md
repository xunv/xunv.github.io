---
title: echarts在vue中获取不到高度的问题
date: 2018-11-23 18:21:45
tags:
---

## 问题引出

在项目中，采用了element-ui框架及echarts；模板结构是一个tab切换页中，引入了自己做了简单封装的echarts；
在上一版还可以正常显示出图，而在后来对封装的echarts做了简单更新后，图表在tab切换页无法显示出来；

## 问题排查

通过查看element元素发生，图表元素canvas的宽度为0（高度是我自己指定的）；然后在echarts组件中通过api`echartsinstance.getWidth()`发现结果为0，说明在echarts实例化的时候，dom元素的宽度为0；

echarts的实例化是在vue的`mounted`阶段进行的，也就是说在这个阶段dom元素没有宽度；

这里还涉及到几个区别；

1. 图表组件更新之前是可以出图的，排查后发现，之前图表实例化是在数据发生变化的时候执行的，而数据是父组件在`mounted`阶段通过ajax请求获得数据传给echarts子组件的；那么父组件在`mounted`阶段，dom情况怎么样了呢  

2. 改版后，图表实例化只执行一次，是在`mounted`阶段执行的；而tabs组件有可能在初次渲染时，默认tab页面都是属于隐藏的，从而在这个时候可能没有高度；

以上是改版前后的区别及原因的猜想；其中主要涉及的几个问题；

1. 父组件和子组件的js方法的执行顺序是怎样的？

通过测试可以知道，执行顺序如下；

父组件`created`--->子组件`created`--->子组件`mounted`--->父组件`mounted`

如果有多个子组件：

父组件created钩子结束后，依次执行子组件的created钩子  
多个子组件的created执行顺序为父组件内子组件DOM顺序  
多个子组件的mounted顺序无法保证，跟子组件本身复杂程度有关  
父组件一定在所有子组件结束mounted钩子之后，才会进入mounted钩子  
>以上说法存疑

2. 什么时候才可以获取到dom元素的高度，或者说什么时候dom渲染完成了呢？

这是一个涉及到生命周期的问题；那么再回去仔细看看关于生命周期的说明;在官方文档中有提到

>`el`被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用该钩子。如果 `root` 实例挂载了一个文档内元素，当 `mounted`被调用时 `vm.$el` 也在文档内。

>注意 `mounted` 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 `vm.$nextTick` 替换掉 `mounted`：

```javascript

mounted: function () {
  this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been rendered
  })
}

```

这样就是相当于，改版前，在父组件的`mounted`阶段执行请求后得到数据传给子组件，这是一个异步过程，异步是放在最后执行的，然后图表初始化，获得了元素高度；

改版后，是在子元素`mounted`阶段执行初始化；此时tab中的标签页虽然已存在，但属于隐藏状态，是没有宽度的，此时获取宽度是获取不到的；

DOM的修改不会立马导致渲染，渲染线程是在一个独立的线程运行的，但是渲染线程和Javascript线程是互斥的，必须等待Javascript的这次调度执行完或线程挂起了，才能执行渲染；