# JavaScript 中的 严格模式

[原文链接](https://juejin.cn/post/6844903566121893895)

`严格模式`：使用严格模式的好处是可以提早知道代码中存在的错误，及时捕获一些可能导致编程错误的 `ECMAScript` 行为。

### 严格模式的选择使用

严格模式的编译指示(pragma): `"use strict"`;，支持严格模式的引擎会启动这种模式，而不支持该模式的引擎就当遇到了一个未赋值的字符串字面量，会忽略这个编译指示。

- 在全局作用域中(函数外部)给出这个编译指示，则整个脚本都将使用严格模式。
- 在函数作用域中给出这个编译指示，则这个函数将使用严格模式

```js
function test () {
    "use strict";
    ...
}
```

### 格模式的规范

#### 变量

- 不允许意外创建全局变量，给一个没有声明的变量赋值，那代码在执行时就会抛出 ReferenceError

```js
// 未声明变量
// 非严格模式:创建全局变量
// 严格模式:抛出 ReferenceError
message = "Hello world! ";
```

- 不能对变量调用 delete 操作符

```js
//删除变量
//非严格模式:静默失败
//严格模式:抛出 ReferenceError
var color = "red";
delete color;
```

- 严格模式下对变量名也有限制，不能使用 implements、interface、let、package、 private、protected、public、static 和 yield 标识符作为变量名，使用以上标识符作为变量名会导致语法错误。

#### 对象

- 为只读属性赋值会抛出 TypeError
- 对不可配置的(nonconfigurable)的属性使用 delete 操作符会抛出 TypeError
- 为不可扩展的(nonextensible)的对象添加属性会抛出 TypeError
- 使用对象字面量时，属性名必须唯一

```js
// 重名属性
// 非严格模式:没有错误，以第二个属性为准
// 严格模式:抛出语法错误
var person = {
  name: "Nicholas",
  name: "Greg",
};
```

#### 函数

- 严格模式要求命名函数的参数必须唯一

```js
//重名参数
//非严格模式:没有错误，只能访问第二个参数
//严格模式:抛出语法错误
function sum(num, num) {
  // todo
}
```

- 在非严格模式下，修改命名参数的值也会反映到 arguments 对象中，而严格模式下这两个值是完全独立的

```js
//修改命名参数的值
//非严格模式:修改会反映到 arguments 中
//严格模式:修改不会反映到 arguments 中
function showValue(value) {
  value = "Foo";
  console.log(value); //"Foo"
  console.log(arguments[0]); //非严格模式:"Foo"，严格模式:"Hi"
}
showValue("Hi");
```

- arguments.callee 和 arguments.caller，在非严格模式下，这两个属性一个引用函数本身，一个引用调用函数。而在严格模式下，访问哪个属性都会抛出 TypeError

```js
//访问 arguments.callee
//非严格模式:没有问题
//严格模式:抛出 TypeError
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
var result = factorial(5);
```

- 严格模式对函数名也做出了限制，不允许用 implements、interface、let、package、private、protected、public、static 和 yield 作为函数名

- 只能在脚本的顶级和在函数内部声明函数

```js
//在 if 语句中声明函数
//非严格模式:将函数提升到 if 语句外部
//严格模式:抛出语法错误
if (true) {
  function doSomething() {
    // todo
  }
}
```

#### eval()

- 在严格模式中，它在包含上下文中不再创建变量或函数

```js
//使用 eval()创建变量
//非严格模式:弹出对话框显示 10
//严格模式:调用 alert(x)时会抛出 ReferenceError
function doSomething() {
  eval("var x=10");
  alert(x);
}
```

- 可以在 eval()中声明变量和函数，但这些变量或函数只能在被求值的特殊作用域中有效，随后就将被销毁

```js
"use strict";
var result = eval("var x=10, y=11; x+y");
alert(result); // 21
```

#### eval 和 arguments

严格模式已经明确禁止使用 eval 和 arguments 作为标识符，也不允许读写它们的值。

```js
// 把 eval 和 arguments 作为变量引用
// 非严格模式: 没问题，不出错
// 严格模式: 抛出语法错误
var eval = 10;
var arguments = "Hello world!";
```

#### 抑制 this

在非严格模式下使用函数的 apply()或 call()方法时，null 或 undefined 值会被转换为全局 对象。而在严格模式下，函数的 this 值始终是指定的值，无论指定的是什么值。

```js
// 访问属性
// 非严格模式: 传入null, 函数的this值是全局对象
// 严格模式: 抛出错误，因为this的值为 null
var color = "red";
function displayColor() {
  alert(this.color);
}
displayColor.call(null);
```

#### 其他变化

- 非严格模式下的 with 语句能够改变解析标识符的路径。严格模式下，with 被简化掉了

```js
//with 的语句用法
//非严格模式:允许
//严格模式:抛出语法错误
with (location) {
  alert(href);
}
```

- 严格模式去掉了 JavaScript 中的八进制字面量

```js
//使用八进制字面量
//非严格模式:值为 8
//严格模式:抛出语法错误
var value = 010;
```

- 严格模式下 parseInt()的行为，八进制字面量在严格模式下会被当作以 0 开头的十进制字面量

```js
//使用 parseInt()解析八进制字面量
//非严格模式:值为 8
//严格模式:值为 10
var value = parseInt("010");
```
