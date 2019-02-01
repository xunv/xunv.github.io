---
title: async/await里的并行和串行
date: 2019-02-01 10:24:14
tags:
---

>文章出处：https://www.cnblogs.com/JRliu/p/9004304.html

我们在使用 async/await 语法时，有时会这样用：

```javascript
function getName () {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('tony')
        }, 2000)
    })
}
function getId () {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('123')
        }, 3000)
    })
}

;(async ()=>{
    let name = await getName()
    let id = await getId()
    alert(`name:${name}, id:${id}`)
})()
```

一眼看上去，应该是3秒种多一点就会 alert 出 'name:tony, id:123'，实际上却花费了5秒才出现提示框，她们是串行执行的！而我们想要的是并行执行，因为她们之间并没有依赖关系。串行执行只会白白增加无谓的等待时间！怎么解决呢？  

我们先看 Promise 的语法：  

>new Promise( function(resolve, reject) {...} /* executor */ );executor是带有 resolve 和 reject 两个参数的函数 。 Promise构造函数执行时立即 调用executor 函数 ， resolve 和 reject 两个函数作为参数传递给executor（executor 函数在Promise构造函数返回新建对象前被调用）。resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。executor 内部通常会执行一些异步操作，一旦完成，可以调用resolve函数来将promise状态改成fulfilled，或者在发生错误时将它的状态改为rejected。

传给 Promise 作为参数的函数会在 new 创建实例时立即调用上面的代码，可以分解成这样：  

```javascript
;(async ()=>{
    let namePromise = getName()
    let name = await namePromise
    let idPromise = getId()              //  2000ms之后才生成 Promise 实例
    let id = await idPromise
    alert(`name:${name}, id:${id}`)
})()
```

所以，如果想并行执行，我们应该先生成所有需要使用的Promise实例：  

```javascript
;(async ()=>{
    let namePromise = getName()
    let idPromise = getId()              // 先生成所有 promise 实例
    let name = await namePromise
    let id = await idPromise
    alert(`name:${name}, id:${id}`)
})()
```

或者使用Promise.all

```javascript
;(async ()=>{
    var result = await Promise.all([getName(), getId()])
    alert(`name:${result[0]}, id:${result[2]}`)
})()
```
