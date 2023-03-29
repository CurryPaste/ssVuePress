import{_ as e,r as o,o as p,c as t,b as n,d as s,a as r,e as c}from"./app.4f2cb50a.js";const l={},i=n("h1",{id:"react-hooks-的基础概念-hooks-链表",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#react-hooks-的基础概念-hooks-链表","aria-hidden":"true"},"#"),s(" React hooks 的基础概念：hooks 链表")],-1),u={href:"https://juejin.cn/post/6921314234508771335",target:"_blank",rel:"noopener noreferrer"},k=c(`<p>当函数组件进入 render 阶段时，会被 renderWithHooks 函数处理。函数组件作为一个函数，它的渲染其实就是函数调用，而函数组件又会调用 React 提供的 hooks 函数。初始挂载和更新时，所用的 hooks 函数是不同的，比如初次挂载时调用的 useEffect，和后续更新时调用的 useEffect，虽然都是同一个 hook，但是因为在两个不同的渲染过程中调用它们，所以本质上他们两个是不一样的。这种不一样来源于函数组件要维护一个 hooks 的链表，初次挂载时要创建链表，后续更新的时候要更新链表。</p><p>分属于两个过程的 hook 函数会在各自的过程中被赋值到<code>ReactCurrentDispatcher</code>的<code>current</code>属性上。所以在调用函数组件之前，当务之急是根据当前所处的阶段来决定<code>ReactCurrentDispatcher</code>的<code>current</code>，这样才可以在正确的阶段调用到正确的 hook 函数。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> renderWithHooks<span class="token operator">&lt;</span>Props<span class="token punctuation">,</span> SecondAwrg<span class="token operator">&gt;</span><span class="token punctuation">(</span>
  <span class="token literal-property property">current</span><span class="token operator">:</span> Fiber <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token literal-property property">workInProgress</span><span class="token operator">:</span> Fiber<span class="token punctuation">,</span>
  <span class="token function-variable function">Component</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">p</span><span class="token operator">:</span> Props<span class="token punctuation">,</span> <span class="token literal-property property">arg</span><span class="token operator">:</span> SecondArg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> any<span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> Props<span class="token punctuation">,</span>
  <span class="token literal-property property">secondArg</span><span class="token operator">:</span> SecondArg<span class="token punctuation">,</span>
  <span class="token literal-property property">nextRenderLanes</span><span class="token operator">:</span> Lanes<span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token operator">:</span> any <span class="token punctuation">{</span>

  <span class="token comment">// 区分是挂载还是更新过程，获取不同的hooks函数集合</span>
  ReactCurrentDispatcher<span class="token punctuation">.</span>current <span class="token operator">=</span>
        current <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> current<span class="token punctuation">.</span>memoizedState <span class="token operator">===</span> <span class="token keyword">null</span>
          <span class="token operator">?</span> HooksDispatcherOnMount
          <span class="token operator">:</span> HooksDispatcherOnUpdate<span class="token punctuation">;</span>
  <span class="token comment">// 调用函数组件，</span>
  <span class="token keyword">let</span> children <span class="token operator">=</span> <span class="token function">Component</span><span class="token punctuation">(</span>props<span class="token punctuation">,</span> secondArg<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token operator">...</span>
  <span class="token keyword">return</span> children<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>HooksDispatcherOnMount</code> 和 <code>HooksDispatcherOnUpdate</code>，它们内部的 hooks 函数是不同的实现，区别之一在于不同阶段对于 hooks 链表的处理是不同的。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token literal-property property">HooksDispatcherOnMount</span><span class="token operator">:</span> Dispatcher <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useCallback</span><span class="token operator">:</span> mountCallback<span class="token punctuation">,</span>
  <span class="token literal-property property">useContext</span><span class="token operator">:</span> readContext<span class="token punctuation">,</span>
  <span class="token literal-property property">useEffect</span><span class="token operator">:</span> mountEffect<span class="token punctuation">,</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token literal-property property">HooksDispatcherOnUpdate</span><span class="token operator">:</span> Dispatcher <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useCallback</span><span class="token operator">:</span> updateCallback<span class="token punctuation">,</span>
  <span class="token literal-property property">useContext</span><span class="token operator">:</span> readContext<span class="token punctuation">,</span>
  <span class="token literal-property property">useEffect</span><span class="token operator">:</span> updateEffect<span class="token punctuation">,</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="认识-hooks-链表" tabindex="-1"><a class="header-anchor" href="#认识-hooks-链表" aria-hidden="true">#</a> 认识 hooks 链表</h3><p>无论是初次挂载还是更新，每调用一次 hooks 函数，都会产生一个 hook 对象与之对应。以下是 hook 对象的结构。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>
    <span class="token literal-property property">baseQueue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">baseState</span><span class="token operator">:</span> <span class="token string">&#39;hook1&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">baseQueue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        <span class="token literal-property property">baseState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token string">&#39;hook2&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span>
        <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>产生的 hook 对象依次排列，形成链表存储到函数组件<code>fiber.memoizedState</code>上。在这个过程中，有一个十分重要的指针：<strong>workInProgressHook</strong>，它通过记录当前生成（更新）的 hook 对象，可以间接反映在组件中当前调用到哪个 hook 函数了。每调用一次 hook 函数，就将这个指针的指向移到该 hook 函数产生的 hook 对象上。例如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token function-variable function">HooksExp</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>stateHookA<span class="token punctuation">,</span> setHookA<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&quot;A&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;B&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>stateHookC<span class="token punctuation">,</span> setHookC<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&quot;C&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>Hook Example<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的例子中，HooksExp 组件内一共调用了三个 hooks 函数，分别是<code>useState</code>、<code>useEffect</code>、<code>useState</code>。那么构建 hook 链表的过程，可以概括为下面这样，重点关注<code>workInProgressHook</code>的指向变化。</p><p>调用 useState(&#39;A&#39;)：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>fiber<span class="token punctuation">.</span>memoizedState<span class="token operator">:</span> hookA
                       <span class="token operator">^</span>
                workInProgressHook
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用 useEffect：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>fiber<span class="token punctuation">.</span>memoizedState<span class="token operator">:</span> hookA <span class="token operator">-</span><span class="token operator">&gt;</span> hookB
                                <span class="token operator">^</span>
                         workInProgressHook
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用 useState(&#39;C&#39;)：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>fiber<span class="token punctuation">.</span>memoizedState<span class="token operator">:</span> hookA <span class="token operator">-</span><span class="token operator">&gt;</span> hookB <span class="token operator">-</span><span class="token operator">&gt;</span> hookC
                                         <span class="token operator">^</span>
                                 workInProgressHook
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>hook 函数每次执行，都会创建它对应的 hook 对象，去进行下一步的操作，比如 useReducer 会在 hook 对象上挂载更新队列，useEffect 会在 hook 对象上挂载 effect 链表。而创建 hook 对象的过程实际上也是 hooks 链表构建以及 workInProgressHook 指针指向更新的过程。</p><h3 id="组件挂载" tabindex="-1"><a class="header-anchor" href="#组件挂载" aria-hidden="true">#</a> 组件挂载</h3><p>初次挂载时，组件上没有任何 hooks 的信息，所以，这个过程主要是在 fiber 上创建 hooks 链表。挂载调用的是<code>mountWorkInProgressHook</code>，它会创建 hook 并将他们连接成链表，同时更新 workInProgressHook，最终返回新创建的 hook，也就是 hooks 链表。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> Hook <span class="token punctuation">{</span>
  <span class="token comment">// 创建hook对象</span>
  <span class="token keyword">const</span> <span class="token literal-property property">hook</span><span class="token operator">:</span> Hook <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">baseState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">baseQueue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// workInProgressHook为null说明此时还没有hooks链表，</span>
    <span class="token comment">// 将新hook对象作为第一个元素挂载到fiber.memoizedState，</span>
    <span class="token comment">// 并将workInProgressHook指向它。</span>
    currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> workInProgressHook <span class="token operator">=</span> hook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// workInProgressHook不为null说明已经有hooks链表，此时将</span>
    <span class="token comment">// 新的hook对象连接到链表后边，并将workInProgressHook指向它。</span>
    workInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next <span class="token operator">=</span> hook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 返回的workInProgressHook即为新创建的hook</span>
  <span class="token keyword">return</span> workInProgressHook<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>currentlyRenderingFiber 就是 workInProgress 节点</p></blockquote><p>我们在组件中调用 hook 函数，就可以获取到 hook 对象，例如 useState：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token literal-property property">HooksDispatcherOnMount</span><span class="token operator">:</span> Dispatcher <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  <span class="token literal-property property">useState</span><span class="token operator">:</span> mountState<span class="token punctuation">,</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> mountState<span class="token operator">&lt;</span><span class="token constant">S</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>
  <span class="token literal-property property">initialState</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">S</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token constant">S</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token constant">S</span><span class="token punctuation">,</span> Dispatch<span class="token operator">&lt;</span>BasicStateAction<span class="token operator">&lt;</span><span class="token constant">S</span><span class="token operator">&gt;&gt;</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取hook对象</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 对hook对象的处理</span>
  <span class="token operator">...</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>hook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span> dispatch<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="组件更新" tabindex="-1"><a class="header-anchor" href="#组件更新" aria-hidden="true">#</a> 组件更新</h3><p>在更新过程中，由于存在<code>current</code>树，所以<code>workInProgress</code>节点也就有对应的<code>current</code>节点。那么自然也会有两条 hooks 链表，分别存在于<code>current</code>和<code>workInProgress</code>节点的<code>memorizedState</code>属性上。鉴于此，更新过程的 hooks 链表构建需要另一个指针的参与：<code>currentHook</code>。它作为组件的<code>workInProgressHook</code>在上一次更新时对应的 hook 对象，新的 hook 对象可以基于它创建。另外，也可以获取到上次 hook 对象的一些数据，例如 useEffect 的前后依赖项比较，前一次的依赖项就可以通过它获得。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>                currentTree

       current<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> hookA <span class="token operator">-</span><span class="token operator">&gt;</span> hookB <span class="token operator">-</span><span class="token operator">&gt;</span> hookC
                                          <span class="token operator">^</span>
                                      currentHook
                                          <span class="token operator">|</span>
         workInProgress Tree              <span class="token operator">|</span>
                                          <span class="token operator">|</span>
workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> hookA <span class="token operator">-</span><span class="token operator">&gt;</span> hookB
                                          <span class="token operator">^</span>
                                 workInProgressHook
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以更新过程的 hooks 链表构建过程除了更新 workInProgressHook 指针的指向，还要更新 currentHook 的指向，以及尽可能复用 currentHook 来创建新的 hook 对象。 这个过程调用的是 updateWorkInProgressHook 函数：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> Hook <span class="token punctuation">{</span>
  <span class="token comment">// 确定nextCurrentHook的指向</span>
  <span class="token keyword">let</span> <span class="token literal-property property">nextCurrentHook</span><span class="token operator">:</span> <span class="token keyword">null</span> <span class="token operator">|</span> Hook<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// currentHook在函数组件调用完成时会被设置为null，</span>
    <span class="token comment">// 这说明组件是刚刚开始重新渲染，刚刚开始调用第一个hook函数。</span>
    <span class="token comment">// hooks链表为空</span>
    <span class="token keyword">const</span> current <span class="token operator">=</span> currentlyRenderingFiber<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// current节点存在，将nextCurrentHook指向current.memoizedState</span>
      nextCurrentHook <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      nextCurrentHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这说明已经不是第一次调用hook函数了，</span>
    <span class="token comment">// hooks链表已经有数据，nextCurrentHook指向当前的下一个hook</span>
    nextCurrentHook <span class="token operator">=</span> currentHook<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 确定nextWorkInProgressHook的指向</span>
  <span class="token keyword">let</span> <span class="token literal-property property">nextWorkInProgressHook</span><span class="token operator">:</span> <span class="token keyword">null</span> <span class="token operator">|</span> Hook<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// workInProgress.memoizedState在函数组件每次渲染时都会被设置成null，</span>
    <span class="token comment">// workInProgressHook在函数组件调用完成时会被设置为null，</span>
    <span class="token comment">// 所以当前的判断分支说明现在正调用第一个hook函数，hooks链表为空</span>
    <span class="token comment">// 将nextWorkInProgressHook指向workInProgress.memoizedState，为null</span>
    nextWorkInProgressHook <span class="token operator">=</span> currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 走到这个分支说明hooks链表已经有元素了，将nextWorkInProgressHook指向</span>
    <span class="token comment">// hooks链表的下一个元素</span>
    nextWorkInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>nextWorkInProgressHook <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 依据上面的推导，nextWorkInProgressHook不为空说明hooks链表不为空</span>
    <span class="token comment">// 更新workInProgressHook、nextWorkInProgressHook、currentHook</span>
    workInProgressHook <span class="token operator">=</span> nextWorkInProgressHook<span class="token punctuation">;</span>
    nextWorkInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next<span class="token punctuation">;</span>

    currentHook <span class="token operator">=</span> nextCurrentHook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 走到这个分支说明hooks链表为空</span>
    <span class="token comment">// 刚刚调用第一个hook函数，基于currentHook新建一个hook对象，</span>

    <span class="token function">invariant</span><span class="token punctuation">(</span>
      nextCurrentHook <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token string">&quot;Rendered more hooks than during the previous render.&quot;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    currentHook <span class="token operator">=</span> nextCurrentHook<span class="token punctuation">;</span>

    <span class="token keyword">const</span> <span class="token literal-property property">newHook</span><span class="token operator">:</span> Hook <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span>

      <span class="token literal-property property">baseState</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>baseState<span class="token punctuation">,</span>
      <span class="token literal-property property">baseQueue</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>baseQueue<span class="token punctuation">,</span>
      <span class="token literal-property property">queue</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>queue<span class="token punctuation">,</span>

      <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">// 依据情况构建hooks链表，更新workInProgressHook指针</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> workInProgressHook <span class="token operator">=</span> newHook<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      workInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next <span class="token operator">=</span> newHook<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> workInProgressHook<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>通过本文我们了解到，函数组件内的 hooks 函数调用是会形成一个 hooks 链表的，这个链表会挂载到函数组件对应 fiber 的 memoizedState 属性上。这为我们后续 hooks 函数的讲解奠定了基础。</p>`,31);function d(v,m){const a=o("ExternalLinkIcon");return p(),t("div",null,[i,n("p",null,[n("a",u,[s("原文链接"),r(a)])]),k])}const h=e(l,[["render",d],["__file","index.html.vue"]]);export{h as default};
