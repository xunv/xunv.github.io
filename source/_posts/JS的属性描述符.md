---
title: JS的属性描述符
date: 2019-12-16 15:21:16
tags:
---

默认创建对象时属性为数据属性

## 数据属性

字面量创建属性时默认为

```javascript
{
  value: undefined,
  writable: true,
  enumerable: true,
  configurable: true
}
```

Object.defineProperty方法创建属性时默认为

```javascript
{
  value: undefined,
  writable: false,
  enumerable: false,
  configurable: false
}
```

可以使用`Object.getOwnPropertyDescriptor`或`Object.getOwnPropertyDescriptors`方法来获取对象属性的描述符信息；

1. `configurable`为`false`,`writable`为`true`时，可通过`赋值`的方式或者`Object.defineProperty`的方式修改value值；
2. `configurable`为`false`,`writable`为`false`时，只能通过`Object.defineProperty`的方式修改value值；
3. `configurable`为`false`,`writable`为`true`时，可将wirtable设置为false；
4. `configurable`为`false`,`writable`为`false`时，`无法修改`wirtable的值；
5. `configurable`为`false`后，也`无法修改`为true；


## 访问器属性

字面量创建访问器属性为

```javascript
const obj={
  get a() {
    return 1
  }
}
```

Object.defineProperty方法创建访问器属性

```javascript
const obj={}
Object.defineProperty(obj, 'a' ,{
  get() {
    return 1
  }
})
```

默认值为

```javascript
{
  get: undefined,
  set: undefined,
  enumerable: true,
  configurable: true
}
```

## 方法

1. 为目标对象设置单个属性  
设置单个属性可以使用`Object.defineProperty()`方法，要注意的是，对于同一个属性，不可以同时在描述符中指定属于数据描述符的value，writable和属于访问器描述符的get，set，否则会报错。

2. 为目标对象设置多个属性  
设置多个属性可以使用`Object.defineProperties()`方法。

3. 禁止目标对象扩展（不允许添加新属性  
禁止添加新属性可以使用`Object.preventExtensions()`方法，该方法接收一个目标对象传入，使用后该对象禁止添加新属性。使该对象禁止扩展。

4. 密封目标对象（不允许扩展且不允许进行属性配置）  
我们可以使用`Object.seal()` 方法创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用 Object.preventExtensions()方法 并把所有现有属性标记为configurable:false。密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性(但是可以修改属性的值)

5. 冻结目标对象（密封对象且不允许修改）  
`Object.freeze(..)` 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用 `Object.seal(..)` 并把所有“数据访问”属性标记为 writable:false，这样就无法修改它们的值。
