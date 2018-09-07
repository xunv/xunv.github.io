---
title: django的跨域请求设置
date: 2018-09-06 11:26:30
tags: [django,跨域,cookie]
---

## 问题引出

由于django本身的权限管理是基于cookie来认证的，而整个过程并不需要前端做什么，直接后端完成；但跨域的时候，产生几个问题；

1. django如何跨域？
2. django跨域后可以正常的写入cookie吗？

其实，跨域实现的方法有很多种，可以查看[前端常见跨域解决方案（全）](https://segmentfault.com/a/1190000011145364)，在此我们使用cors跨域的方式

## cors跨域概述

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）  

相关内容可以参考[跨域CORS原理及调用具体示例](https://www.cnblogs.com/keyi/p/6726089.html)

>引起我们注意的一点就是同为post请求，当`Content-Type`的值为`application/json`时，就变成了非简单请求，基础表现就是浏览器会先发一个"预检"请求

## django跨域设置

1. 执行安装

```bash
# https://github.com/ottoyiu/django-cors-headers/
pip install django-cors-headers
```

2. 配置settings.py

```python
INSTALLED_APPS = (
    ...
    'corsheaders',
    ...
)
...
MIDDLEWARE = [  # Or MIDDLEWARE_CLASSES on Django < 1.10
    ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]
...
# cookies will be allowed to be included in cross-site HTTP requests
CORS_ALLOW_CREDENTIALS = True 
# If True, the whitelist will not be used and all origins will be accepted
CORS_ORIGIN_ALLOW_ALL = False
# A list of origin hostnames that are authorized to make cross-site HTTP requests
CORS_ORIGIN_WHITELIST = (
    'localhost:8888'
)
```
## 显式设置cookie

```python
# view.py
def test(request):
    if request.method == 'POST':
        data = {
            'code': 0,
            'msg': 'this is a test',
            'data': 'POST'
        }
        rep = HttpResponse(json.dumps(data, cls=CJsonEncoder), content_type="application/json")
        rep.set_cookie('key', 'value')
        return rep
```

## 前端设置

前端默认不允许跨域携带cookies，需进行显式的设置；不同的库可能有一些细微的差别；

```javascript
// 原生js（亲测可用，其余未作测试）
var xhr = new XMLHttpRequest();  
xhr.open("POST", "http://localhost:8000/api/test/", true);  
xhr.withCredentials = true; //支持跨域发送cookies
xhr.send();

// jQuery
$.ajax({
    type: "POST",
    url: "http://localhost:8000/api/test/",
    dataType: 'jsonp',
    xhrFields: {withCredentials: true},
    crossDomain: true,
})

// axios（vue常用的方案）
axios.create({
  timeout: 5000,
  withCredentials: true // 允许携带cookie
})
```

## 突然来的疑问

写到此时，我所作的测试都是在本地测的，服务器端在localhost:8000,前端在localhost:8888;而跨域操作所写的cookie均在localhost之下，这样就有一个问题，跨域读写的cookie到底是哪里？是发起请求页的域还是请求地址的域？

## 解答疑问

我们得到的答案是cors跨域读写的cookie都是请求地址的cookie；比如我们请求第三方cdn，并不会携带本站的cookie，发送跨域请求也一样，只会携带请求指向地址的域的cookie。（这也是跨站伪造请求csrf的原理）  

>服务器如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的document.cookie也无法读取服务器域名下的Cookie。

如果非要跨域写cookie呢？有什么办法吗？

## 跨域写本域cookie

查到的方法如下：
可以通过ngix反向代理跨域配置：proxy_cookie_domain b.com a.com;
也可以通过中间件http-proxy-middleware代理跨域时，配置加上cookieDomainRewrite: 'a.com'参数，都是用来修改转发过来的cookie中域名为当前a.com域，所以实现了a.com下cookie写入。