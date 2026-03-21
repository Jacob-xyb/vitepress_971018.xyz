import { defineConfig } from 'vitepress'
import { nav } from './nav.js'
import { sidebar } from './sidebar/index.js'

// 自动转义 blogs 目录下 md 文件中未闭合的 HTML 标签（如泛型 <T>）
function blogsSafePlugin() {
	return {
		name: 'vitepress-blogs-safe',
		transform(code, id) {
			if (!id.includes('/blogs/') || !id.endsWith('.md')) return
			// 转义代码块以外的裸 <Tag> 和 </Tag>（非标准 HTML 标签）
			// 先将代码块内容保护起来，再处理代码块外的内容
			const blocks = []
			const placeholder = '\x00CODEBLOCK\x00'
			let safe = code.replace(/(```[\s\S]*?```|`[^`]*`)/g, (match) => {
				blocks.push(match)
				return `${placeholder}${blocks.length - 1}${placeholder}`
			})
			// 转义非 HTML 标准标签的尖括号（如 <T>, <Type>, </T>）
			safe = safe.replace(/<(\/?)([A-Z][\w.]*|[a-z][\w.]*(?![\w-]))>/g, (match, slash, tag) => {
				// 保留常见 HTML 标签
				const htmlTags = new Set(['div','span','p','a','b','i','u','em','strong','code','pre','h1','h2','h3','h4','h5','h6','ul','ol','li','table','thead','tbody','tr','th','td','img','br','hr','blockquote','section','article','header','footer','nav','main','aside','details','summary','mark','small','sub','sup'])
				if (htmlTags.has(tag.toLowerCase())) return match
				return `&lt;${slash}${tag}&gt;`
			})
			// 还原代码块
			safe = safe.replace(new RegExp(`${placeholder}(\\d+)${placeholder}`, 'g'), (_, i) => blocks[i])
			return safe
		}
	}
}

export default defineConfig({
	title: 'Jacob\'s 百宝箱',
	description: '专业的导航网站',
	head: [
		['link', { rel: 'icon', href: '/logo/xyb-logo.svg' }]
	],

	// 忽略死链接，避免构建失败（设置为 'localhostLinks' 只忽略 localhost 链接，true 忽略所有）
	ignoreDeadLinks: true,

	themeConfig: {
		logo: '/logo/xyb-logo.svg',
		outline: [2, 3],
		
		// 显示最后编辑时间
		lastUpdated: {
			text: '最后更新于',
			formatOptions: {
				dateStyle: 'short',
				timeStyle: 'short'
			}
		},
		
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
