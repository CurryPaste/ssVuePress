module.exports = {
    // 站点配置
    lang: 'zh-CN',
    title: 'curryPaste`s VuePress ！',
    description: '这是我的第一个 VuePress 站点，先偷懒用js写',
  
    // 主题和它的配置
    theme: '@vuepress/theme-default',
    themeConfig: {
      logo: 'https://vuejs.org/images/logo.png',
      base: '/ssVuePress/',
      sidebar: [
        {
          text: '瞎几把记录',
          link: '/'
        },
        {
          text: 'HTML & CSS',
          link: 'htmlCss'
        },
        {
          text: 'JS & TS',
          link: 'jsTs',
          children: [
            {
              text: 'js 原型与原型链',
              link: '/jsTs/原型与原型链'
            }
          ]
        }
      ]
    },
  }
  