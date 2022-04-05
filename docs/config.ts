import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';

const htmlCssChildren = [
  {
    text: 'css混合模式',
    link: '/htmlCss/cssMixedMode'
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
  }
]

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
    link: '/http'
  }, {
    text: '小程序 - 跨平台',
    link: '/applet'
  }, {
    text: 'App - 跨平台',
    link: '/app'
  }
]

export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  lang: 'zh-CN',
  base: "/ssVuePress/",
  title: 'curryPaste`s VuePress ！',
  description: '用VuePress偷懒整的一个站点',

  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: 'https://avatars.githubusercontent.com/u/51729441?s=96&v=4',
    sidebar: [
      {
        text: 'CurryPaste',
        link: '/'
      },
      ...sidebar
    ]
  },
  plugins: [
    [
      "vuepress-plugin-giscus", {
        repo: "CurryPaste/ssVuePress",  // required, string, format: user_name/repo_name
        repoId: "R_kgDOHB3Haw",  // required, string, generate it on Giscus's website
        category: "Announcements",  // required, string
        categoryId: "DIC_kwDOHB3Ha84CObYU",  // required, string, generate it on Giscus's website
        mapping: "pathname",  // optional, string, default="title"
        reactionsEnabled: "1",  // optional, boolean, default=true
        theme: "light", // optional, string, default="light"
        lang: "zh-CN",  // optional, string, default="auto" (follow the site's language, fell to "en" if your site's language is not supported by Giscus)
        crossorigin: "anonymous"  // optional, string, default="anonymous"
      }
    ]
  ]
})