// 外语学习公共侧边栏
const languageCommonSidebar = [
	{
		text: '外语学习',
		items: [
			{ text: '概览', link: '/language/' }
		]
	}
]

export default {
	'/language/': languageCommonSidebar,
	'/language/english/': [
		...languageCommonSidebar,
		{
			text: '英语',
			items: [
				{ text: '概览', link: '/language/english/' }
			]
		}
	]
}
