import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'Jacob\'s 百宝箱',
	description: '专业的导航网站',

	themeConfig: {
		search: {
			provider: 'local',
			options: {
				translations: {
					button: {
						buttonText: '搜索文档',
						buttonAriaLabel: '搜索文档'
					},
					modal: {
						noResultsText: '无法找到相关结果',
						resetButtonTitle: '清除查询条件',
						footer: {
							selectText: '选择',
							navigateText: '切换'
						}
					}
				}
			}
		},

		nav: [
			{ text: '首页', link: '/' },
			{ text: '指南', link: '/guide/' },
			{
				text: 'API参考',
				items: [
					{ text: '符号大全', link: '/manual/symbols.md' },
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
			]
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/Jacob-xyb' }
		]
	}
})
