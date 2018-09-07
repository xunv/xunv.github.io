---
title: post请求的提交数据的几种方式
date: 2018-09-05 20:00:13
tags: [http,post,django]
---
## 前言

HTTP/1.1 协议规定的 HTTP 请求方法有 OPTIONS、GET、HEAD、POST、PUT、DELETE、TRACE、CONNECT 这几种。其中 POST 一般用来向服务端提交数据，本文主要讨论 POST 提交数据的几种方式。  
我们知道，HTTP 协议是以 ASCII 码传输，建立在 TCP/IP 协议之上的应用层规范。规范把 HTTP 请求分为三个部分：状态行、请求头、消息主体。  
协议规定 POST 提交的数据必须放在消息主体（entity-body）中，但协议并没有规定数据必须使用什么编码方式。实际上，开发者完全可以自己决定消息主体的格式，只要最后发送的 HTTP 请求满足上面的格式就可以。  
但是，数据发送出去，还要服务端解析成功才有意义。一般服务端语言如 php、python 等，以及它们的 framework，都内置了自动解析常见数据格式的功能。服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分。下面就正式开始介绍它们。
>个人理解：get请求其实就是将参数以key=value&key=value的形式拼在url发往服务器，所以get请求没有那么多复杂的说法；而post请求规定提交的数据必须放在消息主体（entity-body）中，但没有对形式的规定，所以就有了各种各样的方式；

## 引出问题

```javascript
    var ajax = new XMLHttpRequest();
    var data1 = '{"arr":[1,2,3,4,5],"test":"name"}'
    var data2 = 'name=jack&age=998'
    // 使用post请求
    ajax.open('post', 'http://localhost:8000/api/test/');

    // 如果 使用post发送数据 必须 设置 如下内容
    // 修改了 发送给 服务器的 请求报文的 内容
    // 如果需要像 HTML 表单那样 POST 数据，请使用 setRequestHeader() 来添加 HTTP 头。
    // 然后在 send() 方法中规定您希望发送的数据：
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // 发送
    // post请求 发送的数据 写在 send方法中
    // 格式 name=jack&age=18 字符串的格式;
    // 不能直接发送一个对象，否则后端会变成[object Object]
    ajax.send(data2);

    // 注册事件
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        console.log(ajax.responseText);
      }
    }
```

需要注意的是，`ajax.send()`的内容可以是data1的格式（`JSON.stringfy()`得来），也可以是data2的格式（`qs.stringfy()`得来），两种的方式都可以；  

>另外ajax.send()不能直接发送对象，后端接受会变成[object Object]，而对于axios库，直接发送对象，它会自动转成json字符串；

在后端为django的代码中测试  
```python
def test(request):
    if request.method == 'POST':
        print request.POST.get('arr')
        print request.body
        data = {
            'code': 0,
            'msg': 'this is a test',
            'data': 'POST'
        }
      return HttpResponse(json.dumps(data, cls=CJsonEncoder), content_type="application/json")
```
如何是data1的格式就是json字符串的话，`request.POST`是无法获取到东西的，data2格式通过`request.POST`是可以获取到的，但前提是请求的`Content-type`必须设置为`application/x-www-form-urlencoded`,否则都获取不到结果，只能从request.body中获得原始数据；  
之所以这样是因为django框架在处理响应时，只对`Content-type`为`application/x-www-form-urlencoded`的情况做了处理，（具体可以查看django的源码中`class HttpRequest(object)`对post的处理部分）  
django之所以这么做，是因为什么呢？下面先说一下关于post的几种请求方式

## application/x-www-form-urlencoded

这是post的默认请求方式，在post请求不设置`Content-type`时的默认值；  
```html
  <form action="http://localhost:8000/api/test/" method="post">
    First name:<br>
    <input type="text" name="firstname" value="Mickey"><br> Last name:<br>
    <input type="text" name="lastname" value="Mouse"><br><br>
    <input type="submit" value="提交">
  </form>
```
这也是原始提交表单的方式，在表单提交的方式里，浏览器会把表单里的数据，以`key=value&key=value`的形式发送给服务器；个人理解，由于这种最初的提交方式,决定了`application/x-www-form-urlencoded`下对数据的处理;  
所以，在ajax请求的年代，其实传哪种（data1和data2）格式都可以，不同的是，服务器是以`Content-type`的类型来决定如何处理数据的；  
>这种post的类型的时候可以向服务器发送数据，而数据的格式应为键值对`key=value&key=value`，js对象可以通过`qs.stringfy()`来序列化得到;不过，qs在序列化数组的时候默认会序列化为`arr[]=value&arr[]=value`的形式；这时需要配置下qs，指定数组的编码格式；否则后端获取不到该数组；  

> django接收数组的时候用`request.POST.getlist()`;如果前端序列化带了`[]`，后端也需要带，或者要前端序列化的时候去掉`[]`；

指定数组的编码格式和对应的结果

```javascript
let params = [1, 2, 3];

// indices(默认)
qs.stringify({a: params}, {
    arrayFormat: 'indices'
})
// 结果是
'a[0]=1&a[1]=2&a[2]=3'

// brackets 
qs.stringify({a: params}, {
    arrayFormat: 'brackets'
})
// 结果是
'a[]=1&a[]=2&a[]=3'

// repeat
qs.stringify({a: params}, {
    arrayFormat: 'repeat'
})
// 结果是
'a=1&a=2&a=3'
```

## application/json

这种方式就是告诉服务器，传输的数据为json字符串，所以对应的数格式应为json字符串，js对象可以通过`JSON.stringfy()`来序列化得到；这是一种略新的格式，可能早期的ie等浏览器不支持 

>如果发送对象比较复杂比如`[{"id":"001","name":"小明"},{"id":"002","name":"小军"}]`；这时候还是简单的用json字符串为好，表单提交的方式可能会造成后端解析困难的情况，另外也很难看懂结果;

## multipart/form-data

这种类型主要用来上传文件（可上传多个），也可以发送键值对；（该内容后续展开）

## text/plain (text/json/xml/html)

数据以纯文本形式(text/json/xml/html)进行编码，其中不含任何控件或格式字符。postman软件里标的是RAW,`application/json`包含在RAW里；

## binary

暂没用过，只在postman中看到过，相当于`Content-Type:application/octet-stream`,从字面意思得知，只可以上传二进制数据，通常用来上传文件，由于没有键值，所以，一次只能上传一个文件。