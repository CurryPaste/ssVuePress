import{_ as p,r as a,o,c as i,b as n,d as s,a as e,e as l}from"./app.4f2cb50a.js";const r={},d=n("h1",{id:"ts-type-和-interface-的区别",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ts-type-和-interface-的区别","aria-hidden":"true"},"#"),s(" TS type 和 interface 的区别")],-1),u={href:"https://blog.csdn.net/qq_42345237/article/details/124895617",target:"_blank",rel:"noopener noreferrer"},k=l(`<p>在 TS 中，<code>type</code> 和 <code>interface</code> 相似，都可以给类型命名并通过该名字来引用表示的类型。不过它们之间是存在一些差别的，我们在使用时也需要注意一些特殊场景。</p><h3 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h3><h5 id="type" tabindex="-1"><a class="header-anchor" href="#type" aria-hidden="true">#</a> type</h5><p><code>type</code> 关键字是声明类型别名的关键字。它的语法如下：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">AliasName</span> <span class="token operator">=</span> Type<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>type：声明类型别名的关键字</li><li>AliasName：类型别名的名称</li><li>Type：类型别名关联的具体类型</li></ul><h5 id="interface" tabindex="-1"><a class="header-anchor" href="#interface" aria-hidden="true">#</a> interface</h5><p>通过关键字 <code>interface</code> 可以定义一个接口类型。它能合并众多类型声明至一个类型声明。</p><p>接口声明只存在于编译阶段，在编译后生成的 JS 代码中不包含任何接口代码。</p><p>语法如下：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">InterfaceName</span> <span class="token punctuation">{</span>
  TypeMember<span class="token punctuation">;</span>
  TypeMember<span class="token punctuation">;</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>interface：定义接口的关键字</li><li>InterfaceName：接口名，首字母需要大写</li><li>TypeMember：接口的类型成员</li></ul><h3 id="异同点" tabindex="-1"><a class="header-anchor" href="#异同点" aria-hidden="true">#</a> 异同点</h3><h5 id="不同点" tabindex="-1"><a class="header-anchor" href="#不同点" aria-hidden="true">#</a> 不同点</h5><p><code>type</code> 在声明类型别名之后<b>实际上是一个赋值操作，它需要将别名与类型关联起来。</b>也就是说类型别名不会创建出一种新的类型，它只是给已有类型命名并直接进行引用。 <code>interface</code> 是<b>定义了一个接口类型。</b></p><p><code>type</code> 能够表示<b>非对象类型</b>， 而 <code>interface</code> 则<b>只能表示对象类型。</b></p><p><code>interface</code> 可以<b>继承其他的接口、类等对象类型，</b> <code>type</code> 不支持继承。</p><blockquote><p>好多文章里都说 type 也支持继承，但是我认为这种说法不严谨。对于类型别名来说，它可以<b>借助交叉类型来实现继承的效果。</b>而且这种方法也只适用于表示<b>对象类型</b>的类型别名，对于非对象类型是无法使用的。</p></blockquote><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">Shape</span> <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">Circle</span> <span class="token operator">=</span> Shape <span class="token operator">&amp;</span> <span class="token punctuation">{</span> radius<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span>circle<span class="token operator">:</span> Circle<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> name <span class="token operator">=</span> circle<span class="token punctuation">.</span>name<span class="token punctuation">;</span>
  <span class="token keyword">const</span> radius <span class="token operator">=</span> circle<span class="token punctuation">.</span>radius<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>interface</code> 接口名总是会直接显示在编译器的诊断信息和代码编辑器的智能提示中，而 <b>type 的名字只在特定情况</b>下才会显示出来——只有当类型别名表示<b>数组类型、元组类型以及类或者接口的泛型实例类型</b>时才展示</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">NumericType</span> <span class="token operator">=</span> <span class="token builtin">number</span> <span class="token operator">|</span> bigint<span class="token punctuation">;</span>

<span class="token keyword">interface</span> <span class="token class-name">Circle</span> <span class="token punctuation">{</span>
  radius<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">f</span><span class="token punctuation">(</span>value<span class="token operator">:</span> NumericType<span class="token punctuation">,</span> circle<span class="token operator">:</span> Circle<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> bar<span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token operator">=</span> value<span class="token punctuation">;</span>
  <span class="token comment">//    ~~~</span>
  <span class="token comment">// 	  Type &#39;number | bigint&#39; is not assignable to type &#39;boolean&#39;</span>
  <span class="token comment">// 		这里没有显示类型别名</span>

  <span class="token keyword">const</span> baz<span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token operator">=</span> circle<span class="token punctuation">;</span>
  <span class="token comment">// 	  ~~~</span>
  <span class="token comment">// 		Type &#39;Circle&#39; is not assignable to type &#39;boolean&#39;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>interface</code> 具有声明合并的行为，而 <code>type</code> 不会，这也意味着我们可以通过声明合并的方式给 <code>interface</code> 定义的类型进行属性扩展。</li><li><code>type</code> 可以通过 <code>typeof</code> 来获取实例的类型从而进行赋值操作</li></ul><h5 id="相同点" tabindex="-1"><a class="header-anchor" href="#相同点" aria-hidden="true">#</a> 相同点</h5><ul><li>都可以用来定义 <b>对象</b> 或者 <b>函数</b> 的结构，而严谨的来说， <code>type</code> 是引用，而 <code>interface</code> 是定义。</li></ul><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>对于 <code>type</code> 来说，更多的是对类型的一种复用，比如在项目中需要用到一些比较复杂的或者书写起来很长的类型。我们可以使用 <code>type</code> 来直接引用该类型：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">FType</span> <span class="token operator">=</span> <span class="token builtin">boolean</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>而对于 <code>interface</code> 来说，它是正儿八经的用来定义接口类型（约束数类型和属性）的，且接口类型是支持继承和声明合并的。</p><p>所以在对于对象结构的类型定义上，建议尽可能的使用 <code>interface</code> ，而在合适的场景使用 <code>type</code> 。</p>`,29);function b(m,v){const t=a("ExternalLinkIcon"),c=a("CommentService");return o(),i("div",null,[d,n("p",null,[n("a",u,[s("原文链接"),e(t)])]),k,e(c)])}const y=p(r,[["render",b],["__file","index.html.vue"]]);export{y as default};
