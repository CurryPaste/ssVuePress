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
})