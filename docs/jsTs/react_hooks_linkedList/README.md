# React hooks 的基础概念：hooks 链表

[原文链接](https://juejin.cn/post/6921314234508771335)

当函数组件进入 render 阶段时，会被 renderWithHooks 函数处理。函数组件作为一个函数，它的渲染其实就是函数调用，而函数组件又会调用 React 提供的 hooks 函数。初始挂载和更新时，所用的 hooks 函数是不同的，比如初次挂载时调用的 useEffect，和后续更新时调用的 useEffect，虽然都是同一个 hook，但是因为在两个不同的渲染过程中调用它们，所以本质上他们两个是不一样的。这种不一样来源于函数组件要维护一个 hooks 的链表，初次挂载时要创建链表，后续更新的时候要更新链表。

分属于两个过程的 hook 函数会在各自的过程中被赋值到`ReactCurrentDispatcher`的`current`属性上。所以在调用函数组件之前，当务之急是根据当前所处的阶段来决定`ReactCurrentDispatcher`的`current`，这样才可以在正确的阶段调用到正确的 hook 函数。

```js
export function renderWithHooks<Props, SecondAwrg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {

  // 区分是挂载还是更新过程，获取不同的hooks函数集合
  ReactCurrentDispatcher.current =
        current === null || current.memoizedState === null
          ? HooksDispatcherOnMount
          : HooksDispatcherOnUpdate;
  // 调用函数组件，
  let children = Component(props, secondArg);
  ...
  return children;
}
```

`HooksDispatcherOnMount` 和 `HooksDispatcherOnUpdate`，它们内部的 hooks 函数是不同的实现，区别之一在于不同阶段对于 hooks 链表的处理是不同的。

```js
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  ...
};

const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  ...
};
```

### 认识 hooks 链表

无论是初次挂载还是更新，每调用一次 hooks 函数，都会产生一个 hook 对象与之对应。以下是 hook 对象的结构。

```js
{
    baseQueue: null,
    baseState: 'hook1',
    memoizedState: null,
    queue: null,
    next: {
        baseQueue: null,
        baseState: null,
        memoizedState: 'hook2',
        next: null
        queue: null
    }
}
```

产生的 hook 对象依次排列，形成链表存储到函数组件`fiber.memoizedState`上。在这个过程中，有一个十分重要的指针：**workInProgressHook**，它通过记录当前生成（更新）的 hook 对象，可以间接反映在组件中当前调用到哪个 hook 函数了。每调用一次 hook 函数，就将这个指针的指向移到该 hook 函数产生的 hook 对象上。例如：

```js
const HooksExp = () => {
  const [stateHookA, setHookA] = useState("A");
  useEffect(() => {
    console.log("B");
  });
  const [stateHookC, setHookC] = useState("C");
  return <div>Hook Example</div>;
};
```

上面的例子中，HooksExp 组件内一共调用了三个 hooks 函数，分别是`useState`、`useEffect`、`useState`。那么构建 hook 链表的过程，可以概括为下面这样，重点关注`workInProgressHook`的指向变化。

调用 useState('A')：

```js
fiber.memoizedState: hookA
                       ^
                workInProgressHook
```

用 useEffect：

```js
fiber.memoizedState: hookA -> hookB
                                ^
                         workInProgressHook
```

调用 useState('C')：

```js
fiber.memoizedState: hookA -> hookB -> hookC
                                         ^
                                 workInProgressHook
```

hook 函数每次执行，都会创建它对应的 hook 对象，去进行下一步的操作，比如 useReducer 会在 hook 对象上挂载更新队列，useEffect 会在 hook 对象上挂载 effect 链表。而创建 hook 对象的过程实际上也是 hooks 链表构建以及 workInProgressHook 指针指向更新的过程。

### 组件挂载

初次挂载时，组件上没有任何 hooks 的信息，所以，这个过程主要是在 fiber 上创建 hooks 链表。挂载调用的是`mountWorkInProgressHook`，它会创建 hook 并将他们连接成链表，同时更新 workInProgressHook，最终返回新创建的 hook，也就是 hooks 链表。

```js
function mountWorkInProgressHook(): Hook {
  // 创建hook对象
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // workInProgressHook为null说明此时还没有hooks链表，
    // 将新hook对象作为第一个元素挂载到fiber.memoizedState，
    // 并将workInProgressHook指向它。
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // workInProgressHook不为null说明已经有hooks链表，此时将
    // 新的hook对象连接到链表后边，并将workInProgressHook指向它。
    workInProgressHook = workInProgressHook.next = hook;
  }
  // 返回的workInProgressHook即为新创建的hook
  return workInProgressHook;
}
```

> currentlyRenderingFiber 就是 workInProgress 节点

我们在组件中调用 hook 函数，就可以获取到 hook 对象，例如 useState：

```js
const HooksDispatcherOnMount: Dispatcher = {
  ...
  useState: mountState,
  ...
};

function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 获取hook对象
  const hook = mountWorkInProgressHook();

  // 对hook对象的处理
  ...
  return [hook.memoizedState, dispatch];
}

```

### 组件更新

在更新过程中，由于存在`current`树，所以`workInProgress`节点也就有对应的`current`节点。那么自然也会有两条 hooks 链表，分别存在于`current`和`workInProgress`节点的`memorizedState`属性上。鉴于此，更新过程的 hooks 链表构建需要另一个指针的参与：`currentHook`。它作为组件的`workInProgressHook`在上一次更新时对应的 hook 对象，新的 hook 对象可以基于它创建。另外，也可以获取到上次 hook 对象的一些数据，例如 useEffect 的前后依赖项比较，前一次的依赖项就可以通过它获得。

```js
                currentTree

       current.memoizedState = hookA -> hookB -> hookC
                                          ^
                                      currentHook
                                          |
         workInProgress Tree              |
                                          |
workInProgress.memoizedState = hookA -> hookB
                                          ^
                                 workInProgressHook
```

所以更新过程的 hooks 链表构建过程除了更新 workInProgressHook 指针的指向，还要更新 currentHook 的指向，以及尽可能复用 currentHook 来创建新的 hook 对象。
这个过程调用的是 updateWorkInProgressHook 函数：

```js
function updateWorkInProgressHook(): Hook {
  // 确定nextCurrentHook的指向
  let nextCurrentHook: null | Hook;
  if (currentHook === null) {
    // currentHook在函数组件调用完成时会被设置为null，
    // 这说明组件是刚刚开始重新渲染，刚刚开始调用第一个hook函数。
    // hooks链表为空
    const current = currentlyRenderingFiber.alternate;

    if (current !== null) {
      // current节点存在，将nextCurrentHook指向current.memoizedState
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    // 这说明已经不是第一次调用hook函数了，
    // hooks链表已经有数据，nextCurrentHook指向当前的下一个hook
    nextCurrentHook = currentHook.next;
  }
  // 确定nextWorkInProgressHook的指向
  let nextWorkInProgressHook: null | Hook;
  if (workInProgressHook === null) {
    // workInProgress.memoizedState在函数组件每次渲染时都会被设置成null，
    // workInProgressHook在函数组件调用完成时会被设置为null，
    // 所以当前的判断分支说明现在正调用第一个hook函数，hooks链表为空
    // 将nextWorkInProgressHook指向workInProgress.memoizedState，为null
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    // 走到这个分支说明hooks链表已经有元素了，将nextWorkInProgressHook指向
    // hooks链表的下一个元素
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // 依据上面的推导，nextWorkInProgressHook不为空说明hooks链表不为空
    // 更新workInProgressHook、nextWorkInProgressHook、currentHook
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;

    currentHook = nextCurrentHook;
  } else {
    // 走到这个分支说明hooks链表为空
    // 刚刚调用第一个hook函数，基于currentHook新建一个hook对象，

    invariant(
      nextCurrentHook !== null,
      "Rendered more hooks than during the previous render."
    );
    currentHook = nextCurrentHook;

    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,

      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,

      next: null,
    };

    // 依据情况构建hooks链表，更新workInProgressHook指针
    if (workInProgressHook === null) {
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}
```

### 总结

通过本文我们了解到，函数组件内的 hooks 函数调用是会形成一个 hooks 链表的，这个链表会挂载到函数组件对应 fiber 的 memoizedState 属性上。这为我们后续 hooks 函数的讲解奠定了基础。
