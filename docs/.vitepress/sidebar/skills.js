export default {
	'/skills/': [
		{
			text: 'IT必备技能',
			items: [
				{ text: '概览', link: '/skills/' }
			]
		}
	],
	'/skills/commandline/': [
		{
			text: '命令行工具',
			items: [
				{ text: '概览', link: '/skills/commandline/' },
				{ text: '统计项目规模', link: '/skills/commandline/统计项目规模' }
			]
		}
	],
	'/skills/LargeAIModel/': [
		{
			text: '人工智能模型',
			items: [
				{ text: '概览', link: '/skills/LargeAIModel/' },
				{ text: 'MiniMax', link: '/skills/LargeAIModel/minimax' }
			]
		}
	],
	'/skills/markdown/': [
		{
			text: 'Markdown',
			items: [
				{ text: '介绍', link: '/skills/markdown/' }
			]
		}
	],
	'/skills/github/': [
		{
			text: 'GitHub',
			items: [
				{ text: '使用指南', link: '/skills/github/' },
				{ text: 'Release 发布', link: '/skills/github/release' }
			]
		},
		{
			text: '基础操作',
			items: [
				{ text: '仓库管理', link: '/skills/github/#创建仓库' },
				{ text: '代码提交', link: '/skills/github/#提交代码' },
				{ text: 'Pull Request', link: '/skills/github/#提交-pull-request' }
			]
		},
		{
			text: '进阶功能',
			items: [
				{ text: 'SSH Key 配置', link: '/skills/github/#ssh-key-配置' },
				{ text: 'GitHub Actions', link: '/skills/github/#github-actions' },
				{ text: 'GitHub Pages', link: '/skills/github/#github-pages' }
			]
		}
	]
}
