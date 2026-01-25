import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'Jacob\'s 百宝箱',
	description: '专业的导航网站',

	themeConfig: {
		nav: [
			{ text: '首页', link: '/' },
			{ text: '指南', link: '/guide/' },
			{
				text: 'API参考',
				items: [
					{ text: '符号大全', link: '/Manual/symbols.md' },
				]
			}
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
			{ icon: 'github', link: 'https://github.com/Jacob-xyb' }
		]
	}
})
