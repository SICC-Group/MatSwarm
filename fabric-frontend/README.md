# 前端文档

## 如何编译前端资源

首先你需要安装nodejs（<https://nodejs.org>和yarn（<https://yarnpkg.com>）。

安装完成后：

1. 打开命令行窗口，切换到mgedata的根目录下

1. 输入命令`yarn`然后回车。这个命令的作用是安装前端的依赖

1. 等待安装完成，然后执行`yarn run build`。这一命令编译开发版本的前端资源

1. 对于生产环境，执行`yarn run dist`。区别在于生产环境下会对js、css等资源进行压缩处理

## 如何开发

1. 首先把django跑起来。你需要配置后端数据库和消息队列。

1. 然后打开命令行，切换到mgedata的根目录，执行`yarn run watch`。这一命令使得webpack在后台监听前端源文件的变化，不间断地进行编译、打包工作

1. 完成代码的修改后，在浏览器刷新项目的页面。注意禁用缓存。

## 总体介绍

整个项目使用webpack进行编译、打包工作。webpack的配置文件已经写好。

打包出来的文件位于`/static/webpack`文件夹下。

`/static/`文件夹下是旧的前端文件，除了修改bug不要更改内容。

## JavaScript / TypeScript

TypeScript是一种编译到JavaScript的语言，主要作用是给弱类型的JS加入**类型信息**，使得很多bug在编译阶段就可以被找到，提高开发效率。

所有前端资源放在`static_src`文件夹下。

* `entry`文件夹存放所有入口的业务逻辑代码和对应每个入口的独立scss

* `views`和`components`文件夹存放前端需要用到的组件，例如TreeView、ButtonGroup等。每个组件各自的样式表、引用的图片等也放在这个文件夹。
    * `views`存放原生的DOM组件

    * `components`存放React组件。**新页面全部使用React实现**

* `typings`文件夹存放旧代码的类型标注信息。主要是`Urls`和`django`。一般不需要动

## CSS

CSS部分使用scss / less。scss的编译产出会autoprefixer处理

* 因为之后使用ant-design，所以新的代码全部改成使用less。已有的scss不变。

* 不需要在css部分写带`-webkit-` `-moz-`之类的前缀，前缀会自动加上

## HTML

当前的前后端没有完全分离，所以html部分依然使用django的模板系统。

webpack的页面只能使用`_layout/webpack/base.html`作为基础模板。

该基础模板引用了下列资源：
* `header`底部，只能放`style`：

  * `font-awesome`和`material-icons`样式，后期考虑编译进`mgedata.css`

  * `bootstrap`的样式

  * `main.css`，旧的全局样式，后期会逐步清理

  * `mgedata.css`，由`static_src/entries/main.scss`编译而来，新的全局样式

* `body`底部，只能放`script`：

  * `jquery`和`bootstrap`的js，webpack使用external的方式引用它们

  * `jsi18n`，django国际化解决方案的js部分，对应`django.d.ts`

  * `get-urls`，后端的url列表，对应`Urls.d.ts`

  * `mgedata.js`，由`static_src/entries/mgedata.ts`编译而来，全局功能的初始化代码

## 新增页面的流程

1. 在`webpack.config.js`里增加新的入口

1. 在`templates`里增加该页面的模板

1. 在对应的app里加入url

1. 在`static_src/entries/`里增加对应页面的ts文件和scss文件，注意在ts文件里引用对应的scss，并且这条引用语句要放在所有其他引用之后

1. 编写模板、入口的ts和scss。模板需要引用对应ts和scss的编译产出。

1. 编译：`npm run build`

## TODO

1. accordion-menu和TreeView的样式应该改成同一套

1. TreeView中不带icon的版本应该使用`class="tree-view no-icon"`的形式实现

1. `django.d.ts`只暴露了`gettext`，其他部分没有加上
