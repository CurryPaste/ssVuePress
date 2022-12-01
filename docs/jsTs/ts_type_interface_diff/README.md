# TS type 和 interface 的区别

在 TS 中，`type` 和 `interface` 相似，都可以给类型命名并通过该名字来引用表示的类型。不过它们之间是存在一些差别的，我们在使用时也需要注意一些特殊场景。

### 概念

##### type

`type` 关键字是声明类型别名的关键字。它的语法如下：

```ts
type AliasName = Type;
```

- type：声明类型别名的关键字
- AliasName：类型别名的名称
- Type：类型别名关联的具体类型

##### interface

通过关键字 `interface` 可以定义一个接口类型。它能合并众多类型声明至一个类型声明。

接口声明只存在于编译阶段，在编译后生成的 JS 代码中不包含任何接口代码。

语法如下：

```ts
interface InterfaceName {
  TypeMember;
  TypeMember;
  ...
}
```

- interface：定义接口的关键字
- InterfaceName：接口名，首字母需要大写
- TypeMember：接口的类型成员

### 异同点

##### 不同点

`type` 在声明类型别名之后<b>实际上是一个赋值操作，它需要将别名与类型关联起来。</b>也就是说类型别名不会创建出一种新的类型，它只是给已有类型命名并直接进行引用。 `interface` 是<b>定义了一个接口类型。</b>

`type` 能够表示<b>非对象类型</b>， 而 `interface` 则<b>只能表示对象类型。</b>

`interface` 可以<b>继承其他的接口、类等对象类型，</b> `type` 不支持继承。

> 好多文章里都说 type 也支持继承，但是我认为这种说法不严谨。对于类型别名来说，它可以<b>借助交叉类型来实现继承的效果。</b>而且这种方法也只适用于表示<b>对象类型</b>的类型别名，对于非对象类型是无法使用的。

```ts
type Shape = { name: string };

type Circle = Shape & { radius: number };

function foo(circle: Circle) {
  const name = circle.name;
  const radius = circle.radius;
}
```

`interface` 接口名总是会直接显示在编译器的诊断信息和代码编辑器的智能提示中，而 <b>type 的名字只在特定情况</b>下才会显示出来——只有当类型别名表示<b>数组类型、元组类型以及类或者接口的泛型实例类型</b>时才展示

```ts
type NumericType = number | bigint;

interface Circle {
  radius: number;
}

function f(value: NumericType, circle: Circle) {
  const bar: boolean = value;
  //    ~~~
  // 	  Type 'number | bigint' is not assignable to type 'boolean'
  // 		这里没有显示类型别名

  const baz: boolean = circle;
  // 	  ~~~
  // 		Type 'Circle' is not assignable to type 'boolean'
}
```

- `interface` 具有声明合并的行为，而 `type` 不会，这也意味着我们可以通过声明合并的方式给 `interface` 定义的类型进行属性扩展。
- `type` 可以通过 `typeof` 来获取实例的类型从而进行赋值操作

##### 相同点

- 都可以用来定义 <b>对象</b> 或者 <b>函数</b> 的结构，而严谨的来说， `type` 是引用，而 `interface` 是定义。

### 总结

对于 `type` 来说，更多的是对类型的一种复用，比如在项目中需要用到一些比较复杂的或者书写起来很长的类型。我们可以使用 `type` 来直接引用该类型：

```ts
type FType = boolean | string | number;
```

而对于 `interface` 来说，它是正儿八经的用来定义接口类型（约束数类型和属性）的，且接口类型是支持继承和声明合并的。

所以在对于对象结构的类型定义上，建议尽可能的使用 `interface` ，而在合适的场景使用 `type` 。

[原文链接](https://blog.csdn.net/qq_42345237/article/details/124895617)

<CommentService />
