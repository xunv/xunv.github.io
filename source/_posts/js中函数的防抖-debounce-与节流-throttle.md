---
title: js中函数的防抖(debounce)与节流(throttle)
date: 2019-05-22 20:37:27
tags:
---

## 问题

在绑定 scroll 、resize 这类事件时，当它发生时，它被触发的频次非常高，间隔很近。如果事件中涉及到大量的位置计算、DOM 操作、元素重绘等工作且这些工作无法在下一个 scroll 事件触发前完成，就会造成浏览器掉帧。加之用户鼠标滚动往往是连续的，就会持续触发 scroll 事件导致掉帧扩大、浏览器 CPU 使用率增加、用户体验受到影响。尤其是在涉及与后端的交互中，前端依赖于某种事件如 resize，scroll，发送 Http 请求，在这个过程中，如果不做防抖处理，那么在事件触发的一瞬间，会有很多个请求发过去，增加了服务端的压力。

## 函数防抖（debounce）

当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。定义如下：

> 对于短时间内连续触发的事件（上面的滚动事件），防抖的含义就是让某个时间期限（如 1000 毫秒）内，事件处理函数只执行一次。

例如：在第一次触发事件时，不立即执行函数，而是给出一个期限值比如 200ms，然后：

- 如果在 200ms 内没有再次触发滚动事件，那么就执行函数
- 如果在 200ms 内再次触发滚动事件，那么当前的计时取消，重新开始计时

**效果**：如果短时间内大量触发同一事件，只会执行一次函数。

**实现**：既然前面都提到了计时，那实现的关键就在于 setTimeOut 这个函数，由于还需要一个变量来保存计时，考虑维护全局纯净，可以借助闭包来实现：

```javascript
function debounce(fn, delay) {
  let timer = null; //借助闭包
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay); // 简化写法
  };
}
function showTop() {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  console.log("滚动条位置：" + scrollTop);
}
window.onscroll = debounce(showTop, 1000); // 为了方便观察效果我们取个大点的间断值，实际使用根据需要来配置
```

## 函数节流（throttle）

另一种场景，比如在做图片懒加载的时候，我们是希望一段时间去触发一次，而不是只在最后触发一次。这样我们可以设计一种类似控制阀门一样定期开放的函数，也就是让函数执行一次后，在某个时间段内暂时失效，过了这段时间后再重新激活（类似于技能冷却时间）。

**效果**：如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。

**实现**：

```javascript
// 时间戳方案
var throttle = function(func, delay) {
  var prev = Date.now();
  return function() {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
};
function handle() {
  console.log(Math.random());
}
window.addEventListener("scroll", throttle(handle, 1000));

// 定时器方案
var throttle = function(func, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
};
function handle() {
  console.log(Math.random());
}
window.addEventListener("scroll", throttle(handle, 1000));
```

## 总结

**函数防抖**：将几次操作合并为一此操作进行。原理是维护一个计时器，规定在delay时间后触发函数，但是在delay时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。

**函数节流**：使得一定时间内只触发一次函数。原理是通过判断是否到达一定时间来触发函数。

**区别**： 函数节流不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而函数防抖只是在最后一次事件后才触发一次函数。 比如在页面的无限加载场景下，我们需要用户在滚动页面时，每隔一段时间发一次 Ajax 请求，而不是在用户停下滚动页面操作时才去请求数据。这样的场景，就适合用节流技术来实现。