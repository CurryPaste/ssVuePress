import { defineUserConfig } from 'vuepress';
import { commentPlugin } from 'vuepress-plugin-comment2';
import { defaultTheme } from '@vuepress/theme-default'


const htmlCssChildren = [
  {
    text: 'css混合模式',
    link: '/htmlCss/cssMixedMode'
  },
  {
    text: 'css和js的动画比较',
    link: '/htmlCss/cssAndJsAnimation'
  },
  {
    text: '什么是BFC',
    link: '/htmlCss/bfc'
  },
  {
    text: 'Echarts',
    link: '/htmlCss/echarts'
  }
];

const jsTsChildren = [
  {
    text: 'js 原型与原型链',
    link: '/jsTs/proto_prototype'
  },
  {
    text: 'JS中 require 和 import 区别',
    link: '/jsTs/require_import_diff'
  },
  {
    text: 'js中的call、apply、bind',
    link: '/jsTs/call_apply_bind'
  },
  {
    text: '作用域与上下文',
    link: '/jsTs/scope_context'
  },
  {
    text: '深拷贝和浅拷贝',
    link: '/jsTs/deepCopy_shallowCopy'
  },
  {
    text: 'TS类型推断',
    link: '/jsTs/ts_typeInference'
  },
  {
    text: 'nodeJsV12',
    link: '/jsTs/nodeJsV12'
  },
  {
    text: 'TS: type 和 interface 的区别',
    link: '/jsTs/ts_type_interface_diff'
  },
  {
    text: 'npx、npm、cnpm、pnpm的区别',
    link: '/jsTs/npx_npm_cnpm_pnpm_diff'
  },
];

const httpChildren = [
  {
    text: 'http缓存',
    link: '/http/http_cache'
  }
];

const sidebar = [
  {
    text: 'HTML 与 CSS',
    link: '/htmlCss',
    children: htmlCssChildren
  }, {
    text: 'JS 与 TS',
    link: '/jsTs',
    children: jsTsChildren
  }, {
    text: 'Http 与 网络协议',
    link: '/http',
    children: httpChildren,
  }, {
    text: '小程序 - 跨平台',
    link: '/applet'
  }, {
    text: 'App - 跨平台',
    link: '/app'
  }
]

export default defineUserConfig({
  // 站点配置
  lang: 'zh-CN',
  base: "/ssVuePress/",
  title: 'curryPaste`s VuePress ！',
  description: '用VuePress偷懒整的一个站点',

  // 主题和它的配置
  theme: defaultTheme({
    logo: 'https://avatars.githubusercontent.com/u/51729441?s=96&v=4',
    sidebar: [
      {
        text: 'CurryPaste',
        link: '/'
      },
      ...sidebar
    ]
  }),
  plugins: [
    commentPlugin({
      // 插件选项
      provider: "Giscus", //评论服务提供者。
      comment: true, //启用评论功能
      repo: "CurryPaste/ssVuePress", //远程仓库
      repoId: "R_kgDOHB3Haw", //对应自己的仓库Id
      category: "Announcements",
      categoryId: "xxDIC_kwDOHB3Ha84CObYUx" //对应自己的分类Id
    }),
  ]
})


// git评论相关配置
// [
//   "vuepress-plugin-giscus", {
//     repo: "CurryPaste/ssVuePress",  // required, string, format: user_name/repo_name
//     repoId: "R_kgDOHB3Haw",  // required, string, generate it on Giscus's website
//     category: "Announcements",  // required, string
//     categoryId: "DIC_kwDOHB3Ha84CObYU",  // required, string, generate it on Giscus's website
//     mapping: "pathname",  // optional, string, default="title"
//     reactionsEnabled: "1",  // optional, boolean, default=true
//     // theme: "light", // optional, string, default="light"
//     lang: "zh-CN",  // optional, string, default="auto" (follow the site's language, fell to "en" if your site's language is not supported by Giscus)
//     crossorigin: "anonymous"  // optional, string, default="anonymous"
//   }
// ]