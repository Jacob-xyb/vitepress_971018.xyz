// C++ 公共侧边栏
const cppCommonSidebar = [
	{
		text: 'C++',
		items: [
			{ text: '概览', link: '/coding/cpp/' },
			{ text: '类的拷贝', link: '/coding/cpp/类的拷贝/' }
		]
	},
	{
		text: '专题',
		items: [
			{ text: '面向对象', link: '/coding/cpp/oop/' },
			{ text: 'CMake', link: '/coding/cpp/cmake/' }
		]
	}
]

// Qt 公共侧边栏
const qtCommonSidebar = [
	{
		text: 'Qt',
		items: [
			{ text: '介绍', link: '/coding/qt/' }
		]
	},
	{
		text: 'UI',
		items: [
			{ text: '介绍', link: '/coding/qt/qt-ui/' },
			{ text: 'QSS 样式表', link: '/coding/qt/qt-ui/qt-qss/' }
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
	'/coding/go/': [
		{
			text: 'Go',
			items: [
				{ text: '概览', link: '/coding/go/' }
			]
		},
		{
			text: '环境配置',
			items: [
				{ text: 'Go 安装手册', link: '/coding/go/go-install' }
			]
		}
	],
	'/coding/rust/': [
		{
			text: 'Rust',
			items: [
				{ text: '概览', link: '/coding/rust/' },
				{ text: '历史背景', link: '/coding/rust/history' },
				{ text: '性能对比', link: '/coding/rust/performance' },
				{ text: '开发环境', link: '/coding/rust/environment' },
				{ text: 'VSCode 开发配置', link: '/coding/rust/vscode-setup' },
				{ text: 'Rust 安装手册', link: '/coding/rust/rust-install' },
				{ text: 'Rust 编译', link: '/coding/rust/rust-compile' },
				{ text: 'Tauri 框架', link: '/coding/rust/rust-tauri' }
			]
		}
	],
	'/coding/python/': [
		{
			text: 'Python',
			items: [
				{ text: '介绍', link: '/coding/python/' }
			]
		},
		{
			text: '环境配置',
			items: [
				{ text: '版本管理与清理', link: '/coding/python/version-management' }
			]
		}
	],

	'/coding/qt/': qtCommonSidebar,
	'/coding/qt/qt-ui/qt-qss/': [
		...qtCommonSidebar,
		{
			text: 'QSS 样式表',
			items: [
				{ text: '基础简介', link: '/coding/qt/qt-ui/qt-qss/' },
				{ text: 'QSS 的加载原理', link: '/coding/qt/qt-ui/qt-qss/qss的加载原理/' },
				{ text: '快速调试模板', link: '/coding/qt/qt-ui/qt-qss/qss快速调试模板/' }
			]
		}
	],
	'/coding/wxwidgets/': [
		{
			text: 'wxWidgets',
			items: [
				{ text: '介绍', link: '/coding/wxwidgets/' }
			]
		},
		{
			text: '环境配置',
			items: [
				{ text: '安装', link: '/coding/wxwidgets/install' }
			]
		},
		{
			text: '快速入门',
			items: [
				{ text: '入门指南', link: '/coding/wxwidgets/quickstart' }
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
			text: '面向对象',
			items: [
				{ text: '概述', link: '/coding/cpp/oop/' },
				{ text: '封装', link: '/coding/cpp/oop/encapsulation/' },
				{ text: '继承', link: '/coding/cpp/oop/inheritance/' },
				{ text: '多态', link: '/coding/cpp/oop/polymorphism/' }
			]
		},
		{
			text: '多态详解',
			items: [
				{ text: '虚函数重写与函数隐藏区别', link: '/coding/cpp/oop/polymorphism/virtual-override-vs-hiding' }
			]
		}
	],
	'/coding/cpp/cmake/': [
		...cppCommonSidebar,
	],
	'/coding/tool/': [
		{
			text: 'Tool',
			items: [
				{ text: '介绍', link: '/coding/tool/' },
				{ text: 'Gettext', link: '/coding/tool/gettext-wxwidgets' }
			]
		}
	],
	'/coding/godot/': [
		{
			text: 'Godot',
			items: [
				{ text: '介绍', link: '/coding/godot/' }
			]
		}
	]
}
