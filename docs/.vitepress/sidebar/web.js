export default {
	'/web/': [
		{
			text: 'Web开发',
			items: [
				{ text: '概览', link: '/web/' },
				{ text: 'npm', link: '/web/npm/' }
			]
		}
	],
	'/web/vitepress/': [
		{
			text: 'VitePress',
			items: [
				{ text: '介绍', link: '/web/vitepress/' },
				{ text: 'Markdown扩展', link: '/web/vitepress/vitepress中的MarkDown' }
			]
		},
		{
			text: 'UI美化',
			items: [
				{ text: '宽布局配置', link: '/web/vitepress/ui-宽布局' },
				{ text: '大纲隐藏', link: '/web/vitepress/ui-大纲隐藏' }
			]
		},
		{
			text: '常见问题',
			// collapsed: false,
			items: [
				{ text: '文件相关', link: '/web/vitepress/issue/file-issues' },
				{ text: '样式相关', link: '/web/vitepress/issue/style-issues' },
				{ text: '构建相关', link: '/web/vitepress/issue/build-errors' }
			]
		}
	]
}
