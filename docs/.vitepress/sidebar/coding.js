// C++ 公共侧边栏
const cppCommonSidebar = [
	{
		text: 'C++',
		items: [
			{ text: '概览', link: '/coding/cpp/' }
		]
	},
	{
		text: '面向对象',
		items: [
			{ text: '概述', link: '/coding/cpp/oop/' },
			{ text: '封装', link: '/coding/cpp/oop/encapsulation/' },
			{ text: '继承', link: '/coding/cpp/oop/inheritance/' },
			{ text: '多态', link: '/coding/cpp/oop/polymorphism/' }
		]
	}
]

export default {
	'/coding/': [
		{
			text: '编程',
			items: [
				{ text: '概览', link: '/coding/' }
			]
		}
	],
	'/coding/git/': [
		{
			text: 'Git',
			items: [
				{ text: '介绍', link: '/coding/git/' }
			]
		},
		{
			text: '核心技术',
			items: [
				{ text: 'Rebase 变基', link: '/coding/git/rebase' }
			]
		},
		{
			text: '应用配置',
			items: [
				{ text: '代理配置', link: '/coding/git/proxy' }
			]
		}
	],
	'/coding/file-io/': [
		{
			text: '文件读写',
			items: [
				{ text: '介绍', link: '/coding/file-io/' },
				{ text: 'INI 文件读写', link: '/coding/file-io/ini-file' }
			]
		}
	],
	'/coding/cpp/': cppCommonSidebar,
	'/coding/cpp/oop/': [
		...cppCommonSidebar,
		{
			text: '多态详解',
			items: [
				{ text: '虚函数重写与函数隐藏区别', link: '/coding/cpp/oop/polymorphism/virtual-override-vs-hiding' }
			]
		}
	]
}
