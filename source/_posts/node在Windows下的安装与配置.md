---
title: node在Windows下的安装与配置
date: 2018-08-16 10:16:35
tags: node
---
## 安装

在Windows下安装node很简单，直接取官网下载安装包，一路next就可以了，最新的安装包包含了npm，也会默认把node运行文件所在的目录添加到环境变量中。  

当在终端执行`node -v`命令时，输出相应版本号说明安装成功。  

## 配置

npm默认的模块缓存路径及全局安装路径都在C盘，习惯上我们自行指定一个位置，一般会把node安装在D盘，相应的路径也设置在node目录下  

在nodejs的目录下提前创建好两个文件夹node_global和node_cache

如下命令设置路径：
```bash
npm config set prefix "D:\\nodejs\\node_global"
npm config set cache "D:\\nodejs\\node_cache"
```

设置完成后可通过`npm config ls`查看相关设置

此时需要将node_global路径加入到环境变量，这样保证终端可以找到全局安装的模块

## 注意

有些教程里会指导将全局模块的路径直接设置在nodejs目录下  
```bash
npm config set prefix "D:\\nodejs"
```
全局安装的模块会安装在node_modules下，和默认安装的npm在一起，命令文件就在nodejs下，这样就不需要再添加环境变量了  

但这种做法会带来一个问题就是，无法通过`npm un npm@lstest -g`来升级npm模块，因为npm无法再升级安装的时候覆盖自己，而正常的npm升级是在全局模块的路径安装最新的npm，所以按照开头的路径设置，在node在会有两个npm，一个是默认安装的，一个是升级的时候安装在全局路径的。

所以还是建议全局路径设置另外的文件路径，并添加至环境变量。