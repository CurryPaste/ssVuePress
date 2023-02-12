# js 数组方法 reduce 经典用法代码分享

[原文地址](https://www.jb51.net/article/132324.htm)

> 本文给大家整理了很多关于 js 数组方法 reduce 的经典代码片段，能够让大家更好的理解 reduce 的实例用法，一起学习下吧。

`reduce()` 方法接收一个函数作为累加器 `（accumulator）`，数组中的每个值（从左到右）开始缩减，最终为一个值。

```js
let arr = [1, 2, 3, 4, 5];
// 10代表初始值，p代表每一次的累加值，在第一次为10
// 如果不存在初始值，那么p第一次值为1
// 此时累加的结果为15
let sum = arr.reduce((p, c) => p + c, 10); // 25
// 转成es5的写法即为：
var sum = arr.reduce(function (p, c) {
  console.log(p);
  return p + c;
}, 10);
```

##### example 字母游戏

```js
const anagrams = (str) => {
  if (str.length <= 2) {
    return str.length === 2 ? [str, str[1] + str[0]] : str;
  }
  return str.split("").reduce((acc, letter, i) => {
    return acc.concat(
      anagrams(str.slice(0, i) + str.slice(i + 1)).map((val) => letter + val)
    );
  }, []);
};

anagrams("abc"); // 结果会是什么呢？
```

`reduce` 负责筛选出每一次执行的首字母，递归负责对剩下字母的排列组合。

##### example 累加器

```js
const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);
sum([1, 2, 3]);
```

##### example 计数器

```js
const countOccurrences = (arr, value) =>
  arr.reduce((a, v) => (v === value ? a + 1 : a + 0), 0);
countOccurrences([1, 2, 3, 2, 2, 5, 1], 1);
```

循环数组，每遇到一个值与给定值相等，即加 1，同时将加上之后的结果作为下次的初始值。

##### example 函数柯里化

函数柯里化的目的就是为了储存数据，然后在最后一步执行。

```js
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
curry(Math.pow)(2)(10);
curry(Math.min, 3)(10)(50)(2);
```

通过判断函数的参数取得当前函数的 `length` (当然也可以自己指定)，如果所传的参数比当前参数少，则继续递归下面，同时储存上一次传递的参数。

##### example 数组扁平化

```js
const deepFlatten = (arr) =>
  arr.reduce((a, v) => a.concat(Array.isArray(v) ? deepFlatten(v) : v), []);
deepFlatten([1, [2, [3, 4, [5, 6]]]]);
```

##### example 生成菲波列契数组

```js
const fibonacci = (n) =>
  Array(n)
    .fill(0)
    .reduce(
      (acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
      []
    );
fibonacci(5);
```

##### example 管道加工器

```js
const pipe =
  (...funcs) =>
  (arg) =>
    funcs.reduce((acc, func) => func(acc), arg);
pipe(btoa, (x) => x.toUpperCase())("Test");
```

通过对传递的参数进行函数加工，之后将加工之后的数据作为下一个函数的参数，这样层层传递下去。

##### example 中间件

```js
const dispatch = (action) => {
  console.log("action", action);
  return action;
};
const middleware1 = (dispatch) => {
  return (action) => {
    console.log("middleware1");
    const result = dispatch(action);
    console.log("after middleware1");
    return result;
  };
};
const middleware2 = (dispatch) => {
  return (action) => {
    console.log("middleware2");
    const result = dispatch(action);
    console.log("after middleware2");
    return result;
  };
};
const middleware3 = (dispatch) => {
  return (action) => {
    console.log("middleware3");
    const result = dispatch(action);
    console.log("after middleware3");
    return result;
  };
};
const compose = (middlewares) =>
  middlewares.reduce((a, b) => (args) => a(b(args)));

const middlewares = [middleware1, middleware2, middleware3];
const afterDispatch = compose(middlewares)(dispatch);

const testAction = (arg) => {
  return { type: "TEST_ACTION", params: arg };
};
afterDispatch(testAction("1111"));
```

`redux` 中经典的 `compose` 函数中运用了这种方式，通过对中间件的重重层叠，在真正发起 `action` 的时候触发函数执行

##### example redux-actions 对 state 的加工片段

```js
// redux-actions/src/handleAction.js
const handleAction = (type, reducer, defaultState) => {
  const types = type.toString();
  const [nextReducer, throwReducer] = [reducer, reducer];
  return (state = defaultState, action) => {
    const { type: actionType } = action;
    if (!actionType || types.indexOf(actionType.toString()) === -1) {
      return state;
    }
    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
};
// reduce-reducers/src/index.js
const reduceReducer = (...reducers) => {
  return (previous, current) => {
    reducers.reduce((p, r) => r(p, current), previous);
  };
};
// redux-actions/src/handleActions.js
const handleActions = (handlers, defaultState, { namespace } = {}) => {
  // reducers的扁平化
  const flattenedReducerMap = flattenReducerMap(handles, namespace);
  // 每一种ACTION下对应的reducer处理方式
  const reducers = Reflect.ownkeys(flattenedReducerMap).map((type) =>
    handleAction(type, flattenedReducerMap[type], defaultState)
  );
  // 状态的加工器，用于对reducer的执行
  const reducer = reduceReducers(...reducers);
  // reducer触发
  return (state = defaultState, action) => reducer(state, action);
};
```

##### example 数据加工器

```js
const reducers = {
  totalInEuros: (state, item) => {
    return (state.euros += item.price * 0.897424392);
  },
  totalInYen: (state, item) => {
    return (state.yens += item.price * 113.852);
  },
};
const manageReducers = (reducers) => {
  return (state, item) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      reducers[key](state, item);
      return state;
    }, {});
  };
};
const bigTotalPriceReducer = manageReducers(reducers);
const initialState = { euros: 0, yens: 0 };
const items = [{ price: 10 }, { price: 120 }, { price: 1000 }];
const totals = items.reduce(bigTotalPriceReducer, initialState);
```

##### example 对象空值判断

```js
let school = {
  name: "Hope middle school",
  created: "2001",
  classes: [
    {
      name: "三年二班",
      teachers: [
        { name: "张二蛋", age: 26, sex: "男", actor: "班主任" },
        { name: "王小妞", age: 23, sex: "女", actor: "英语老师" },
      ],
    },
    {
      name: "明星班",
      teachers: [
        { name: "欧阳娜娜", age: 29, sex: "女", actor: "班主任" },
        { name: "李易峰", age: 28, sex: "男", actor: "体育老师" },
        { name: "杨幂", age: 111, sex: "女", actor: "艺术老师" },
      ],
    },
  ],
};
// 常规做法
school.classes &&
  school.classes[0] &&
  school.classes[0].teachers &&
  school.classes[0].teachers[0] &&
  school.classes[0].teachers[0].name;
// reduce方法
const get = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
get(["classes", 0, "teachers", 0, "name"], school); // 张二蛋
```

##### example 分组

```js
const groupBy = (arr, func) =>
  arr
    .map(typeof func === "function" ? func : (val) => val[func])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});
groupBy([6.1, 4.2, 6.3], Math.floor);
groupBy(["one", "two", "three"], "length");
```

首先通过 `map` 计算出所有的键值，然后再根据建值进行归类

##### example 对象过滤

```js
const pick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});
pick({ a: 1, b: "2", c: 3 }, ["a", "c"]);
```

根据给出的键值来遍历，比较对象中是否存在相同键值的的值，然后通过逗号表达式把赋值后的对象赋给下一个的初始值

##### example 数组中删除指定位置的值

```js
const remove = (arr, func) =>
  Array.isArray(arr)
    ? arr.filter(func).reduce((acc, val) => {
        arr.splice(arr.indexOf(val), 1);
        return acc.concat(val);
      }, [])
    : [];
const arr = [1, 2, 3, 4];
remove(arr, (n) => n % 2 == 0);
```

首先根据 `filter` 函数过滤出数组中符合条件的值，然后使用 `reduce` 在原数组中删除符合条件的值，可以得出最后 arr 的值变成了 `[1, 3]`

##### example promise 按照顺序执行

```js
const runPromisesInSeries = (ps) =>
  ps.reduce((p, next) => p.then(next), Promise.resolve());
const delay = (d) => new Promise((r) => setTimeout(r, d));
const print = (args) => new Promise((r) => r(args));
runPromisesInSeries([
  () => delay(1000),
  () => delay(2000),
  () => print("hello"),
]);
```

##### example 排序

```js
const orderBy = (arr, props, orders) =>
  [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      if (acc === 0) {
        const [p1, p2] =
          orders && orders[i] === "desc"
            ? [b[prop], a[prop]]
            : [a[prop], b[prop]];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      }
      return acc;
    }, 0)
  );
const users = [
  { name: "fred", age: 48 },
  { name: "barney", age: 36 },
  { name: "fly", age: 26 },
];
orderBy(users, ["name", "age"], ["asc", "desc"]);
orderBy(users, ["name", "age"]);
```

##### example 选择

```js
const select = (from, selector) =>
  selector.split(".").reduce((prev, cur) => prev && prev[cur], from);
const obj = { selector: { to: { val: "val to select" } } };
select(obj, "selector.to.val");
```
