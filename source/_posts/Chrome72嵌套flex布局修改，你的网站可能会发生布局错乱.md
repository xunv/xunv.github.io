---
title: Chrome72嵌套flex布局修改，你的网站可能会发生布局错乱
date: 2019-03-20 20:17:50
tags:
---

>作者：蓝博
>链接：https://juejin.im/post/5c642f2ff265da2de660ecfc
>来源：掘金

## 起源

2019年1月29日，Chrome72正式版（72.0.3626.81）发布，本次发布带来了一个改变，且没有在更新日志中提及，该改变导致某些网站发生了布局错乱。该改变主要针对的是嵌套的flex布局，下面我们一起看下是怎么回事。

## 问题

首先，我们有一个嵌套的flex布局，代码如下：

```html
<style>
div {
    box-sizing: border-box;
}
.flex {
    display: flex;
    flex-direction: column;
}
.area {
    padding: 10px;
    height: 300px;
    width: 300px;
    background-color: #3fb9ab;
    color: #fff;
}
.item {
    padding: 10px;
    flex: 1;
    background-color: #158c7e;
}
.nest-item {
    flex: 1;
    overflow: auto;
    background-color: #046b5f;
}
.content {
    padding: 10px;
    height: 600px;
}
</style>
<div class="area flex">
    area
    <div class="item flex">
        item
        <div class="nest-item">
            <div class="content">content</div>
        </div>
    </div>
</div>
```
希望实现这样的效果：父容器area有一个指定的高度，且它是一个flex弹性盒子，它内部有一个子元素item，使用 `flex: 1` 指定了占满剩余空间，且item也是一个flex弹性盒子，它内部还有一个同样占满剩余空间的嵌套子元素nest-item，通过设置 `overflow: auto` 让它的内容超出后显示滚动条。效果如下：  

![flex示例](/img/flex_001.jpg)

这样布局的想法很简单，即通过设置弹性盒子子元素的扩展比率，能得到一个自动占满剩余空间高度的容器，再在这个容器中放需要显示的内容，在某些情况下，这确实是一个比较不错的主意，在Chrome72之前都是可以正常显示的。但是Chrome72.0.3626.81中显示如下：  

![flex示例](/img/flex_002.jpg)

## 追溯

为什么会出现这样的问题呢？我们看一下[规范](https://drafts.csswg.org/css-flexbox/#min-size-auto)，flex弹性盒子主轴上子元素的最小大小是内容的大小（视主轴方向为宽或高）。  

那么我们再看一下上面的例子，area的主轴是纵向的，子元素item的最小高度即是内容的高度，而nest-item被content撑开，content有一个高度（600px，超出了容器的高度），那么item的最小高度也就超过了600px。这样一来，一层层都是被内容撑开，也就没有出现滚动条了，这样似乎是符合规范预期的。  

在chromium的issue反馈中，有人提到了[这个问题](https://bugs.chromium.org/p/chromium/issues/detail?id=927066)，根据回复，这正是官方为了让Chrome更加符合规范行为而做的调整。也就是说，Chrome72之前的版本，这算是一个没有按照规范行为而出现的bug。新的调整，其实就是让flex弹性盒子的子元素最小高度的默认行为应用 `min-height: min-content` ，就像官方回复中提到的那样，让子元素作为flex弹性盒子时却和普通盒子处理方式不同是会让人困惑的。  

## 解决方法

既然知道了原因，那么如果我们还想使用这样的布局方式，该怎么做呢？

对的，我们给item指定一个最小高度，让它不使用默认的行为（即内容的高度），一般我们指定最小高度为0 `min-height: 0`。给item加上这个样式后，我们再看一下效果：

![flex示例](/img/flex_003.jpg)

嗯，已经符合我们的预期了。为了验证规范中提到的对主轴方向的行为，我们修改一下代码，将主轴设置为水平方向试试，代码如下：

```html
<style>
div {
    box-sizing: border-box;
}
.flex {
    display: flex;
    flex-direction: row;
}
.area {
    padding: 10px;
    height: 300px;
    width: 300px;
    background-color: #3fb9ab;
    color: #fff;
}
.item {
    padding: 10px;
    flex: 1;
    background-color: #158c7e;
}
.nest-item {
    flex: 1;
    overflow: auto;
    background-color: #046b5f;
}
.content {
    padding: 10px;
    width: 600px;
}
</style>
<div class="area flex">
    area
    <div class="item flex">
        item
        <div class="nest-item">
            <div class="content">content</div>
        </div>
    </div>
</div>
```

效果如下：  

![flex示例](/img/flex_004.jpg)

看来主轴为水平方向时，是符合规范预期行为的（Chrome72及以前的版本都符合），那么我们给item加上一句样式 `min-width: 0` ，效果如下：  

![flex示例](/img/flex_005.jpg)

嗯，是符合我们预期的。  

## 结语

好了，现在你已经知道是怎么一回事了，可是等等，你说你升级到Chrome72没有发现我说的问题？  

那是因为官方注意到这个修改会影响到一些网站的正常显示，因此在2019年2月6日（正是春节假期间）发布的Chrome72.0.3626.96中，将[这个问题](https://chromium.googlesource.com/chromium/src/+/032ef9666487db1d04b656a095b041de8c6d2b63)还原回以前的行为了。  

官方的意思是为了避免这个修改给某些网站带来的不好的影响，因此预留时间给大家修改，等到Chrome73将会发布这一改变。所以为了未来更好的浏览体验，检查一下你的页面吧！
