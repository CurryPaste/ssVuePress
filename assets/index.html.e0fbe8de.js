import{_ as e,r as p,o,c,b as n,d as a,a as t,e as i}from"./app.4f2cb50a.js";const l="/ssVuePress/assets/hanoi.98583b9a.jpg",u={},r=n("h1",{id:"递归——汉诺塔",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#递归——汉诺塔","aria-hidden":"true"},"#"),a(" 递归——汉诺塔")],-1),d={href:"https://baijiahao.baidu.com/s?id=1726173466527059448&wfr=spider&for=pc",target:"_blank",rel:"noopener noreferrer"},k={href:"https://blog.csdn.net/reqingfendou/article/details/123474981",target:"_blank",rel:"noopener noreferrer"},h=i('<h3 id="首先-何为汉诺塔问题" tabindex="-1"><a class="header-anchor" href="#首先-何为汉诺塔问题" aria-hidden="true">#</a> 首先，何为汉诺塔问题？</h3><p>如图</p><p><img src="'+l+'" alt=""></p><blockquote><p>汉诺塔有个口诀叫做：单左双右，先小后大，一步两步循环往复。以下图所示举例 A 表示第一个柱子 B 表示第二个珠子 C 表示第三个柱子 --&gt;表示盘的移动方向。</p></blockquote><h3 id="js-解法" tabindex="-1"><a class="header-anchor" href="#js-解法" aria-hidden="true">#</a> js 解法</h3><h4 id="思路" tabindex="-1"><a class="header-anchor" href="#思路" aria-hidden="true">#</a> 思路</h4><ul><li>定义一个函数：hannuo(a, b, c, n)；此函数的意义是将 a 柱上的模块借助 b 柱转移到 c 柱上</li><li>找到递归出口，即当 n=1 时，就转移 a 柱上的第 n 层板块到 c 柱上，也就是 a 柱上的最大的那一个模块 n，代码语句为：document.write(<code>请把${a}移到${c}&lt;br&gt;</code>)</li><li>要解决第 n 块模块，就必然要先解决第 n-1 块模块，所以，就可以套用该函数，来解决这第 n-1 块的转移，且这第 n-1 块模块要先转移到 b 柱上，再输出 document.write(<code>请把${a}移到${c}&lt;br&gt;</code>)，再将第 n-1 块从 b 柱上转移到 c 柱上，以此类推即可。</li></ul><h4 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">hannuo</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c<span class="token punctuation">,</span> n</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    document<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">请把</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>a<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">移到</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>c<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;br&gt;</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    <span class="token function">hannuo</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> c<span class="token punctuation">,</span> b<span class="token punctuation">,</span> n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    document<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">请把</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>a<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">移到</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>c<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;br&gt;</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">hannuo</span><span class="token punctuation">(</span><span class="token string">&quot;a&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;b&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;c&quot;</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>',9),b={href:"https://haokan.baidu.com/v?pd=wisenatural&vid=3741179232668217031",target:"_blank",rel:"noopener noreferrer"};function m(v,g){const s=p("ExternalLinkIcon");return o(),c("div",null,[r,n("p",null,[n("a",d,[a("参考链接"),t(s)]),n("a",k,[a("原文链接"),t(s)])]),h,n("p",null,[n("a",b,[a("汉诺塔玩法介绍-视频"),t(s)])])])}const f=e(u,[["render",m],["__file","index.html.vue"]]);export{f as default};