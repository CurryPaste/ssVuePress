# npx、npm、cnpm、pnpm 的区别

[原文链接](https://zhuanlan.zhihu.com/p/494076214)

- 一张图了解`包管理器`的发展史。
- `npm` 是什么，如何从众人诟病到翻身做主人？
- `npx` 是什么，它解决了什么问题
- `cnpm` 是什么，它解决了什么问题
- `yarn` 是什么，它的优势
- `pnpm` 是什么，它的优势

那这些公司或团队为什么花那么多心思开发出 `yarn` 、 `cnpm` 、 `pnpm` 这写新的包管理器呢？其实在每个人开发的过程中，<b>都会遇到包下载慢、依赖不同导致各种 bug</b>等等问提，其实这些工具就是去解决这些问题的。

### 时间进程图

![](./img/timeLine.jpg)
图中可以清晰的看到：

- 2010 年 `npm` 诞生第一版
- 时隔 4 年的 2014 年 `cnpm` 诞生
- 2015 年 `npm` 发布 v3 版，改掉了 v2 版本嵌套目录问题，将依赖扁平化
- 其实 2016 年 `pnpm` 就已经诞生，只是功能还不齐全，不被人熟知
- 2016 年 `npm@4` 和 `yarn` 同年同月发布，此时的 yarn 轰动一时，赢来大众喜爱， `yarn` 各指标远超 `npm@4`
- 隔半年的 2017 年 5 月 `npm@5` 版本发布，各项功能提升。像是参考了一波 yarn，差距缩小。
- 2017 年 7 月 `npm@5.2` 发布， `npx` 命令诞生
- 2018 年 5 月 `npm@6` 发布，性能提升、`npm init <pkg>`命令

### npm 是什么，如何从众人诟病到翻身做主人

> 这个不用过多废话，大家非常熟悉。总的来说就是一个开源、免费的包管理器。便于我们下载和分享资源。

`cnpm、yarn、pnpm`等工具都是基于 `npm` 包管理器的一些变种。解决了早期 `npm` 的一些缺点，例如下载速度慢，不能离线下载等。

主要的 npm 版本更新日程：

- npm@v1.0.0 首次发布--2010 年
- npm@v3.0.0 node_modules 目录结构扁平化 --2015 年 06 月
- npm@4.0.0 package-lock.json 前身 npm-shrinkwrap.json 用于依赖锁定--2016 年 10 月
- npm@v5.0.0 package-lock.json 默认生成，并兼容 npm-shrinkwrap.json，重构 npm-cache，大大提升下载速度 --2017 年 05 月
- npm@v5.2.0 npx 命令发布 --2017 年 07 月
- npm@v6.0.0 增加 npm init --2018 年 05 月

### npx 是什么，它解决了什么问题

`npx` 是 `npm5.2` 版本新增的一个命令，如果 `npm` 版本没到 `v5.2`，请运行`npm install -g npx`

##### 可以运行本地的模块

例如在 vue 项目中，想运行本地的 `vue-cli-service serve` 如果直接在命令行运行会报错：`找不到命令`
![](./img/serve.jpg)

所以我们通常这样：

```json
// package.json
//....其它配置
"scripts": {
    "dev": "vue-cli-service serve",
 },
 //....其它配置
```

然后：
`npm run dev`

然而现在，通过`npx`可以这样：

```
npx vue-cli-service serve
```

运行成功：
![](./img/serve-succ.jpg)

##### npx 方便使用一次就丢弃的情况，不会全局安装

例如 `create-react-app` ，以往我们需要安装全局的包。但是使用一次后面几乎就不怎么使用了，非常浪费磁盘空间。现在我们可以用`npx create-react-app myapp`，用完就删，真香！

> 如果第一次使用这个命令，npx 会下载 create-react-app 放在临时文件中，过一段时间会自动清除，注意<b>不会立即清除</b>，我测试发现第二次运行 npx create-react-app myapp 不会重新下载，它会从缓存中获取。

##### 还有其它好用的功能

> npx 可以下载指定的版本，可以指定 node 版本运行等请参考[阮一峰老师的 npx 介绍](http://www.ruanyifeng.com/blog/2019/02/npx.html)，全面易懂

### npm init 和 npx 相似

在`npm@6`版本中，增加了一个新命令`npm init <pkg>`

这两个命令是等价的：

```
npm init react-app myapp

npx create-react-app myapp
```

`npm init <pkg>`对与`create`开头的脚手架制定了一个特殊命令，例如`create-react-app`、`create-esm`。`npm init` 下载时会<b>默认对安装的`pkg`包添加`create`前缀</b>，同时像`npx`一样不会全局安装，只是运行一次，后面会删除。

但`npm init <pkg>`不能完全取代`npx`，例如运行`npm init http-server` 本意是想一次性启动一个本地服务 结果报错:

![](https://pic1.zhimg.com/v2-590c3249eed9cd7932b50cc2804ac660_b.jpg)

途中可以看到 `http-server` 被变成了 `create-http-server`，所以就找不到该模块，推荐用 `npx` 就好，至少使用起来更可控。

### yarn 是什么，它解决了什么问题

`yarn` 也是一个包管理器，它和 `npm` 其实没有本质区别，都是管理和安装包的。只是它解决了早期 `npm` 的一些问题比如：不支持离线模式、树形结构的依赖、依赖安装不确定性等。为什么说是早期？因为 `npm` 新版本基本上已经解决了自身的老毛病，两者没有想象中那么大的区别。

> 从最新版的 `npm` 和 `yarn` 来看，他们的安装速度和使用体验并没有多大的差距，`yarn` 稍胜一筹。

```js
// 安装：
npm install -g yarn

// 安装包：
yarn add [package]

// 删除包：
yarn remove [package]
```

##### yarn 相对于 npm 优势（早期）：

这里列出一些早期的 `yarn` 相对于 `npm` 比较大的优势：

- 支持离线安装（npm@5 已支持）
- 依赖扁平化结构（npm@3 已支持）
- 依赖安装确定性 yarn.lock（npm@5 增加了 package-lock.json）
- 安装速度快并行下载
- 安装失败自动重试
- 等等...

### pnpm 是什么，它解决了什么问题

`pnpm` 也是一个包管理器，它巧妙的使用了类似于 `linux` 的软连接方式，达到一个模块文件多处服用，解决了 `yarn、npm` 在多个项目安装同一个依赖时会下载重复文件的问题，避免磁盘的浪费，同时大大提升下载速度。

下面是 `pnpm` 的一些特点：

- `pnpm` 运行起来非常的快，超过了 `npm` 和 `yarn`。
- `pnpm` 采用了一种巧妙的方法，利用硬链接和符号链接来避免复制所有本地缓存源文件。也就是说多个项目相同的依赖只会在某处安装一次，连接过来直接使用，节省了安装时间和瓷盘空间。
- `pnpm` 继承了 `yarn` 和新版 `npm` 的所有优点，包括离线模式和确定性安装。
- 但是链接在一些场景下会存在兼容的问题，例如 Electron 应用无法使用 `pnpm`、部署在 `lambda` 上的应用无法使用 `pnpm`

### 总结

- `npm` 是一个包管理器，方便开发者分享和下载开源包。经历了许多重大版本的更新，各方面已经和 `yarn` 在同一水平。
- `npx` 是`npm@5.2`的产物，方便运行本地命令
- `cnpm` 是方便中国开发者下载依赖包而诞生的下载器。
- `yarn` 解决了 `npm@5` 之前的一些让人诟病的问题，同时拥有一些其它的优点。例如离线安装、失败自动重试安装和并行下载等。
- `pnpm` 通过连接的方式，让多个项目的依赖公用同一个包，大大节省了磁盘空间，比 `yarn` 和 npm 下载速度快得多，但是也有连接带来的各种兼容问题。

> 使用 npm、yarn、pnpm 都是可以的，但是最好是团队都使用同一个管理器。
