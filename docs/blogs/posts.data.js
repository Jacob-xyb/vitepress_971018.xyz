import { createContentLoader } from 'vitepress'

export default createContentLoader('blogs/*.md', {
	exclude: ['blogs/index.md'],
	transform(rawData) {
		return rawData
			.filter(page => !page.url.endsWith('/blogs/'))
			.map(page => {
				// 从文件名中提取日期和标题，格式：YYYYMMDD_标题.md
				const rawUrl = page.url.replace(/\.html$/, '')
				const filename = rawUrl.split('/').pop() || ''
				const match = filename.match(/^(\d{8})_(.+)$/)
				let date = ''
				let title = page.frontmatter.title || ''

				if (match) {
					const raw = match[1]
					date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
					if (!title) title = decodeURIComponent(match[2])
				}

				return {
					title: title || filename,
					url: rawUrl,
					date,
					description: page.frontmatter.description || ''
				}
			})
			.sort((a, b) => b.date.localeCompare(a.date))
	}
})
