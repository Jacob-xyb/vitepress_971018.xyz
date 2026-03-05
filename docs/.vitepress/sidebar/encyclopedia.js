// 生活百科公共侧边栏
const encyclopediaCommonSidebar = [
	{
		text: '生活百科',
		items: [
			{ text: '概览', link: '/encyclopedia/' },
			{ text: '孕期常识', link: '/encyclopedia/pregnancy/' },
		]
	}
]

export default {
	'/encyclopedia/': encyclopediaCommonSidebar,
	'/encyclopedia/pregnancy/': [
		...encyclopediaCommonSidebar,
		{
			text: '孕期常识',
			items: [
				{ text: '概览', link: '/encyclopedia/pregnancy/' },
				{ text: '日常琐事', link: '/encyclopedia/pregnancy/daily-matters' },
				{ text: '隐私话题', link: '/encyclopedia/pregnancy/privacy' }
			]
		}
	]
}
