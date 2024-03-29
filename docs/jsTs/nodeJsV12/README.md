# 1. 引言

一起看看 [Nodejs 12](https://blog.logrocket.com/node-js-12/)  带来了哪些改变。

# 2. 概述

Node12 与以往的版本不同，带来了许多重大升级，包括更多 V8 特性，Http 解析速度的提升，启动速度的提升，更好的诊断报告、内置堆分析工具，ESM 模块的更新等。

## V8 引擎升级

V8 升级带来了如下几个特性：

- [zero-cost async 堆栈信息](https://v8.dev/blog/v8-release-72#async-stack-traces) 原生支持了 async 堆栈信息，不会添加额外运行时内容。
- [参数数量不匹配时性能优化](https://v8.dev/blog/v8-release-74#faster-calls-with-arguments-mismatch) 即便参数传递多了或少了，现在都几乎不会影响 Node 的执行速度。
- [更快的 async](https://v8.dev/blog/v8-release-73#faster-await) async /await 已经比 promises 快了两个 microticks。
- [更快的 Js 解析速度](https://v8.dev/blog/v8-release-72#javascript-parsing) 网页中的 V8 引擎一般花费 9.5% 时间在 JS 解析上，经过解析加速后，现在花费在 JS 解析上的时间降低到平均 7.5%。

可见 V8 引擎的升级不仅给 Node12 带来了福音，也会一定程度上提升网页的运行效率。

## TLS 1.3 更好的安全性

随着 Node12 的发布，TLS 从 1.2 升级到了 1.3，更安全且更易配置。通过使用 TLS 1.3，Node 程序可以减少 Https 握手所需时间来提升请求性能。

## 默认堆被正确配置了

以前默认堆大小需要通过 `-max-old-space-size` 设置，而且默认值是一个固定值，现在这个默认值可以根据可用内存动态分配，这样当内存较小时，Node 不会让内存移除而报错，而是主动终止自己的进程。

## 默认的 http 解析器变为 llhttp

nodejs 的 [http-parser](https://github.com/nodejs/http-parser) 已经非常难以维护和优化了，因此 [llhttp](https://github.com/nodejs/llhttp#readme) 这个库，比 http-parser 快 156%，更重要的是，在 Node12 中，将默认解析器切换到了 llhttp。

## 提供诊断报告

Node12 有一项实验功能，根据用户需求提供诊断报告，包括崩溃、性能下降、内存泄露、CPU 使用高等等。

## 堆内存 dump

在以前，如果要将堆内存生成 dump 文件，需要在生产环境安装额外的模块，而 Node12 集成了这个功能。

## 更好的原生模块支持

C++ 拓展 [N-API](https://nodejs.org/api/n-api.html#n_api_n_api) 升级到版本 4，同时一个原生模块可以被 C++ 编写并发布到 npm，就像一个普通 JS 模块一样被引用。不过要注意一些区别：

|     |                                        | JS 模块 | 原生拓展           |
| --- | -------------------------------------- | ------- | ------------------ |
| 1.  | ... 需要编译                           | 否      | 如果预编译了则不用 |
| 2.  | ... 是否可以运行在所有平台             | 是      | 如果预编译了则可以 |
| 3.  | ... 是否兼容所有 Node 版本             | 是      | 否                 |
| 4.  | ... 会被加载多次                       | 是      | 否                 |
| 5.  | ... 如果没有明确使用多线程，则线程安全 | 是      | 否                 |
| 6.  | ... 可以被销毁                         | 是      | 否                 |

## Worker 被正式启用了

`--experimental-worker` 实验开关已取消，默认支持 `worker_threads`。

要注意的是，执行 CPU 密集型任务时适合用 worker（大量计算），而执行 I/O 密集型任务时，Worker 反而没有 Node 内置的 I/O 操作性能好（读写文件）。

## 启动速度优化

通过在构建时提前为内置库生成代码缓存，最终使启动时间加快 30%。

## 支持 ES6 module

Node12 对 ES6 module 的支持依然处于实验阶段，需要通过 `--experimental-modules` 开启。

简单来说，就是支持了 Import Export 语法，不需要再转成 `require` 了！如果在  `package.json` 增加 `"type": "module"` 的配置，Node 将按照 ES6 module 方式处理。

## 新的编译器和平台要求

由于升级到新的 V8 引擎以及内部改造，因此 Node12 在 Mac 与 Windows 之外的平台上，需要至少 GCC6 和 glibc 2.17。

# 3. 精读

对于 V8 引擎升级、TLS 升级、堆配置自动化、http-parser 升级到 llhttp、启动速度优化都属于被动优化，代码无需改动，只要升级 Node 版本就可以享受。

支持 ES6 module 这个特性其实比较鸡肋，毕竟源码用 Ts 写的话，这些升级并不会对源码产生影响。

`worker_threads` 可以被默认启用，就像以前支持 `async/await` 一样，会带来 Nodejs 多线程更广泛的使用。

Node12 更新了 V8 引擎，随着 V8 的更新，很多 ES 新规范也落地了，比如 Class 成员函数、私有成员变量等等。

# 4. 总结

Nodejs 仅有 10 年历史，但现在越来越被开发者欢迎，因为它可以让 JS 运行在服务端，是扩大 JS 生态的重要一环。从 Node 更新历史中可以看到，性能和语法能力稳步提升，一些服务端环境需要的诊断报告、堆栈分析能力都在逐渐完善，社区上也有 Alinode 与 egg、express、koa 等好用的服务框架，相对于前端翻天覆地的变化，对 Node 的评价只有一个字：稳。

转载自 [ascoders/weekly](https://github.com/ascoders/weekly/blob/master/%E5%89%8D%E6%B2%BF%E6%8A%80%E6%9C%AF/113.%E7%B2%BE%E8%AF%BB%E3%80%8ANodejs%20V12%E3%80%8B.md)