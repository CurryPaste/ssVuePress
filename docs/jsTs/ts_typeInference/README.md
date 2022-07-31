# TS 类型推断

在正式开始之前，先问一个问题，你知道在 Typescript（后面简称 TS）中有一个关键字用于推断类型么？是的这个关键字和本文的核心是一样的：`infer`。意如其字，`infer`就是推断，这个关键字就是用于推断类型。

### 类型推断
类型推断在 TS 中其实无处不在，最简单的例子：
```ts
const num = 12; // typeof num === number
```
在这里我们没有明确通过`const num: number`指定其类型，但是 TS 通过我们赋予其的初始值就可以确定其类型是 number，这就是最基础的类型推断。

同样如果我们声明一个函数：
```ts
function fun(a: number, b: number) {
  return a + b;
}

const num = fun(1, 2); // typeof num === number
```
因为我们的函数`fun`有明确的返回值`a + b`并且这两个参数都是`number`类型，可以明确确定函数的返回值就是`number`类型，所以即便我们没有明确写出`fun`的返回值`fun(): number`，但是 TS 会自动给我们推断出函数的返回类型是什么。

以上就是最基础的类型推断。


### infer 关键字
那么既然 TS 已经这么强大能够推断出类型，那么为什么还需要`infer`关键字呢？答案就是，自动推断冉冉不够强大（废话）。毕竟编译器的能力仍然是有限的，不能指望所有情况都能帮助我们推断正确，尤其是 JS 这么灵活的语言，比如：
```ts
function logTuple(tup: {tuple: [string, string]}) {
  console.log(tup.tuple[0], tup.tuple[0]);
}

const myTuple = {tuple: ['a', 'b']};

logTuple(myTuple);

```
TS 会给我们一个错误.

` Argument of type '\{ tuple: string[]; \}' is not assignable to parameter of type 'A'. `

这是因为在我们声明`myTuple`的时候，TS 就给我们推断了其类型，在 TS 眼中`['a', 'b']`对应的是`string[]`类型，而我们声明的`A`类型里面则对应的是`[string, string]`的`tuple`类型，所以这是无法对应上的。而直接`logTuple({tuple: ['a', 'b']});`则又是可以的，这里就存在着参数类型推断的使用，我们会在后面的篇章中详细说，我们还是先关注失败的这种写法以及`infer`关键字。

那么这时候我们可以怎么解决这个问题呢？最简单的当然是把类型从参数中提出来，然后在声明`myTuple`的时候指定其类型来主动告知 TS：

```ts
type T = {
  tuple: [string, string];
};

const myTuple: T = {tuple: ['a', 'b']};

logTuple(myTuple);
```

但这种方式有一个缺陷就是，如果logTuple函数并不是我们自己定义的，我们没法去修改其定义，那怎么办呢？

先直接说方案：

```ts
type GetFirstArgument<T> = T extends (
  first: infer FirstArgument,
  ...args: any[]
) => any
  ? FirstArgument
  : never;

const myTuple: GetFirstArgument<typeof logTuple> = {tuple: ['a', 'b']};

logTuple(myTuple);
```

通过这个工具类型，我们可以获取到`logTuple`的参数类型，进而指定`myTuple`为这个类型来解决这个问题。而这里我们就用到了`infer`这个关键字。那么事情是怎么发生的呢？

```ts
type GetFirstArgument<T> = T extends (
  first: infer FirstArgument,
  ...args: any[]
) => any
  ? FirstArgument
  : never;
```

- 第一步：TS 判断我们赋予的 T 类型是否符合`extends`限定的类型，在这里是一个至少有一个参数的函数
- 第二步：一旦符合，则把这个 T 这个函数的第一个参数推断出来并且赋值给`FirstArgument`
- 第三步：如果 T 符合该类型推断，则返回推断出来的`FirstArgument`类型，否则返回`never`

点击[查看原文](https://link.juejin.cn/?target=https%3A%2F%2Fwww.coursebetter.com%2Ftools%2F2022%2Ftypescript-argument-type-inference)，原文这里有更丰富的组件进行代码讲解，更易于理解。

这是一个极其典型的通过泛型来进行类型推断的例子，而`infer`关键字在这里的意义则是推断出`T`函数签名的第一个参数的类型，以及把这个类型赋值给`FirstArgument`以便后续使用。

需要注意的是，`FirstArgument`是有作用域的，他只会存在于`GetFirstArgument`的推断周期内，如果我们在其他地方定义了同名的`FirstArgument`，并不会影响这里的`FirstArgument`。

```ts
type FirstArgument= string

type GetFirstArgument<T> = T extends (first: infer FirstArgument, ... // 没有任何关系

```
如果你仍然不理解，你可以把`GetFirstArgument`看作一个函数：


- `T`是他的参数
- 我们在使用`GetFirstArgument`类型时，其实就是调用了这个函数，然后传入了`logTuple`作为参数`T`
- 然后得到的是`=`后面得到的类型，这段代码非常像我们在 JS 中二元判断，条件判断内容是`T`是否符合某个类型，在这里的类型是`(first: infer FirstArgument,...args: any[]) => any`，也就是一个至少有一个参数的函数
- 只要我们在使用`GetFirstArgument`时候给的是这样的一个函数，那么推断条件就成立，就会得到一个推断的`FirstArgument`类型然后作为结果返回，否则就返回二元判断的另外一个结果

而这个 TS 的函数则是在：`const a: GetFirstArgument<(a: number) => void>`时调用（不是真的如 JS 函数一样调用，只是进行类比）。


<!-- ### 参数类型推断（type argument inference）（） -->
<!-- https://juejin.cn/post/7056750775749312548 -->