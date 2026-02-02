import { defineConfig } from 'vitepress'
import { nav } from './nav.js'
import { sidebar } from './sidebar/index.js'

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

		nav,
		sidebar,

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/Jacob-xyb' }
		]
	}
})
