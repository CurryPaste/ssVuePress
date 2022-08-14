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


## update-2
### 参数类型推断
在开始讲参数推断之前，我们需要至少对 TS 的泛型（generics）有基本的理解，推荐大家至少去官网看一下文档
：[文档地址](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fgenerics.html)。

我这里做一个最简单直观的介绍，我们直接用官方文档的例子：

```ts
function wrapper(arg: number): {inner: number} {
  return {
    inner: arg,
  };
}
```
比如这个函数，他帮助我们把传入的参数外包了一层，使之变成了一个对象。在这个定义里面，我们的入参只能是 number 类型的，但是从函数实现上来说，我们其实并没必要把这个类型限制这么死，我门希望这个函数可以支持更多的类型。这里有很多解决方案，比如我们可以把我们能想象到的类型写到定义上：

```ts
function wrapper(arg: number ｜ string | Date): { inner: number | string | Date } {
```

但是这并不是很好，因为每次我们希望增加一种类型的支持，都需要重新修改函数的定义，并且我们得到的返回值的`inner`类型是不确定的，不论我们最终传入的是`number`还是`string`，你得到的返回值的inner都是定义中的所有可能性。

而泛型则就是用来简单地解决这个问题的，我们来看看泛型的用法：

```ts
function wrapper<T>(arg: T): {inner: T} {
  return {
    inner: arg,
  };
}
```

在这里我们对于函数的定义上增加了`<T>`，而他就是泛型的关键。当我们使用这个函数的时候就会变成这样：

```ts
wrapper<number>(1);
```

这时候 TS 的编译器就会知道，你这次调用`wrapper`函数传入的是`number`类型，所以这次函数调用的返回值也是`{inner: number}`。

泛型就类似于针对 TS 定义的参数，通过在调用时指定类型，来动态地应用类型于函数定义。就像我们在 JS 中，函数的参数可以控制函数的运行结果一样，所以让我用一句话来定义就是：针对 TS 定义的参数。

OK，泛型的基础用法和理解就讲到这里，更多的用法还是去看官方文档吧。

### 参数类型推断（type argument inference）
那么接下去我们就来聊聊本文的另一个重点：参数类型推断。在 TS 中，类型推断时非常常见的，比如：

类型推断同样可是使用在函数的泛型定义中，比如上面的例子：

```ts
function wrapper<T>(arg: T): {inner: T} {
  return {
    inner: arg,
  };
}
```

如若我们在使用时直接`wrapper(1)`，这个函数也能正常使用，并且 TS 也能识别出返回的类型是`{inner: number}`。在这个过程中，TS 首先发现我们传递给`wrapper`函数的参数是`1`，是个 number 类型。继而发现`wrapper`函数接受泛型，因为整个函数只有一个泛型而且和入参的类型时一致的，所以 TS 可以反推出`<T>`就是`number`类型。而这个过程是在`wrapper(1)`调用的时候确定的，所以就很类似 JS 的函数。

参数类型推断非常有用，尤其是当入参的类型非常复杂的时候。典型的例子是 vue3 的`defineComponent`函数。

`defineComponent`用于定义一个组件，而组件定义的配置内容的类型时非常复杂的：

```ts
defineComponent({
    props: {},
    data() {},
    setup() {},
    mounted() {},
    ...
})
```

如果我们需要在使用该函数的时候把整个配置的内容都定义出来，那么我们的代码量可能需要增加一倍，并且整个学习难度也自然会上升一些，毕竟你需要记住这些参数的类型。

我们可以看一下`defineComponeng 的定义：

```ts
export function defineComponent<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string
>(
  options: ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>;
```

这还仅仅是一种函数签名，vue3 的`defineComponent`函数签名有 4 种 overrides，其复杂程度可想而知。索性有参数类型推断，让我们避免了每次使用都要写一堆复杂定义的烦恼。

我们只需要：
```ts
const Comp = defineComponent({
  props: {
    name: String,
  },
});
```

我们就知道`Comp`的 `props` 中有一个名为 `name` 的属性类型为 `String` 。


### extends

我相信你已经注意到了在上面的 `defineComponents` 存在着非常多的 `extends` 。这又是 TS 中对于类型推断非常重要的一个字段。他的重要性体现在对鱼类型约束上。当你写 `function A<T>(opt: T): T` 的时候，这里的 `T` 可以是任意类型，所以你调用函数 `A(1)` 的时候， `T` 的类型又完全交还给 TS 来判断，比如之前的数组例子：

```ts
function A<T>(opt: T): T {
  return opt;
}

const tuple = A(['a', 'b']);
```

这时候 `tuple` 会是 `string[]` 类型，而不是我们期望的 `[string, string]` 类型。这时候我们就可以给 `T` 一个约束：

```ts
function A<T extends [string, ...string[]]>(opt: T): T {
  return opt;
}

const tuple = A(['a', 'b']);
```

此时我们的 `tuple` 就会是 `[string, string]` ，我们给 `T` 约束为 `string` 类型的 tuple，TS 就会在类型推断的时候有限匹配约束的类型，如果类型无法匹配则会报错。

类型约束在类型推断中是非常有用的，事实上你应该尽量在使用泛型时赋予一个约束，这能够帮助我们更精确的得到自己想要的类型，你可以回过头去看 vue3 的 `difineComponent` ，几乎所有的泛型都是用 `extends` 来进行类型约束。

### 实例讲解

最后我们通过一个例子再来展示一下参数类型推断的作用，假如有如下的场景：
```ts
function defineStore(options) {
  return options; // 你创建的store
}

defineStore({
  actions: {
    a: (commits) => commits.a,
  },
  commits: {
    a: (state, newName) => 'a',
  },
  state: {
    name: 'jokcy',
  },
});
```

我们想要创建一个定义 `store` 的函数，这个定义比较类似 vuex，我们分成 `state/actions/commits` 三部分，在每个 `commit` 函数中我们会接收 `state` 作为第一个参数，便于我们更新数据；在每个 `action` 中我们接受所有 `commits` 作为参数，这样我们在 `action` 中可以进行数据更新。

那么为了更好的体验，我们自然希望每个 `commit` 中拿到的 `state` 可以知道其类型，同样在每个 `action` 中也知道所有 `commit` 的函数签名，这样我们调用 `commit` 的时候就知道要传哪些参数，TS 也可以帮我们在代码检测帮我们定为错误。我们可以这么做：

```ts
type MyCommits = {...}
type MyState = {...}

a: (commits: MyCommits)
a: (state: MyState)
```

但这就要求我们对整个定义的类型做出声明，工作量非常大，而且未来你改一个函数，你还得改一遍类型，所有工作都 double 了，你愿意么？我肯定不愿意，那么怎么办呢？我希望 `defineStore` 来帮我完成这件事情，我希望我在调用他的时候自动帮我检测这些关键类型，在这里也就是 `state` 和 `commits` ，我们先来看 `state`：

```ts
type Options<State> = {
  actions: Record<
    string,
    (commits: Record<string, (...args: any) => void>) => void
  >;
  commits: Record<string, (state: State, ...args: any) => void>;
  state: State;
};

function defineStore<State>(options: Options<State>) {
  return options; // 你创建的store
}
```

我们为 `defineStore` 定义来一个 `State` 泛型，这样之后，你在定义 `commit` 的时候，你拿到的第一个参数 `state` 自动会推断出其类型，而这个类型的依据就是你传入的 `state` 的值。

注意: 你可以打开[TS Playground](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2F)把上面的代码复制进去看一下运行结果。

既然 `state` 可以这样，那么自然 `commits` 也可以，所以我们会得到以下的结果：

```ts
type Options<
  State,
  Commits extends Record<string, (state: State, ...args: any) => void>
> = {
  actions: Record<string, (commits: Commits) => void>;
  commits: Commits;
  state: State;
};

function defineStore<
  State,
  Commits extends Record<string, (state: State, ...args: any) => void>
>(options: Options<State, Commits>) {
  return options;
}

defineStore({
  actions: {
    a: (commits) => commits.a,
  },
  commits: {
    a: (state, newName: string) => 'a',
  },
  state: {
    name: 'jokcy',
  },
});
```

但是你实际运行这段代码时却会发现在 `actions` 里面并拿不到真正的 `commits` 而是 `Record<string, ...>` ，这里有一个很奇怪的问题，在得到答案之后会再继续更新。这个问题时可以解决的，怎么解决呢？只需要手动声明每个 `commit` 中的 `state` 的类型就可以了：

```ts
type State = {
  name: string;
};

commits: {
  a: (state: State, newName: stirng) => 'a';
}
```

你可以在 playground 尝试一下。这是目前一个可以接受的方案，因为我也会推荐你声明一下你的 `state` 类型，因为自动推断数据的类型经常不准，比如你直接写:  `state: {arr: []}` ，你会得到 `never[]` 导致你无法修改 `arr` ，所以你肯定是要声明具体每个数组项的类型的。不论如何，定义的大头， `commits` 他肯定是帮我们省去了。


### 小结
本文中我尽力为大家解释清楚 TS 中的类型推断（type infer）是怎么回事，我相信你自己尝试去理解一下把 TS 泛型类比函数的方式，一定会帮助你更好地理解。类型推断是非常重要的，如果你对于这一块不够理解，阅读 TS 代码就会比较困难，尤其是一些开源项目的定义，那是极其复杂的，各种泛型套泛型，所以即便你可能自己不会去写这么复杂的定义，推荐你至少对类型推断有一个总体的认知，防止在遇到类型问题时一脸懵逼。

另外推荐大家可以用一下 Discord，TS 官方有一个讨论组在上面，并且有专门的 help channel，你可以去提问，会有专门的人来回复你（当然你的英语也得过关，以及你一定要学会好的提问方式）。[频道链接](https://link.juejin.cn/?target=https%3A%2F%2Fdiscord.gg%2Ftypescript)。

[查看原文 - Typescript重点之：理解类型推断](https://juejin.cn/post/7056750775749312548)


<!-- https://juejin.cn/post/7056750775749312548 -->