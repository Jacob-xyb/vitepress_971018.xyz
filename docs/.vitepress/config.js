import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'API 文档',
  description: '专业的API文档网站',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API参考', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API参考',
          items: [
            { text: '概述', link: '/api/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})
