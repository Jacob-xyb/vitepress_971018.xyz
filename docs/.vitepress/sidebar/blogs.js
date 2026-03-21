import fs from 'fs'
import path from 'path'

function getBlogSidebar() {
	const blogsDir = path.resolve(__dirname, '../../blogs')
	const files = fs.readdirSync(blogsDir)
		.filter(f => f.endsWith('.md') && f !== 'index.md')
		.sort((a, b) => b.localeCompare(a)) // 按文件名倒序（最新在前）

	const items = files.map(f => {
		const name = f.replace(/\.md$/, '')
		const match = name.match(/^(\d{8})_(.+)$/)
		const text = match ? decodeURIComponent(match[2]) : name
		return { text, link: `/blogs/${name}` }
	})

	return {
		'/blogs/': [
			{
				text: '博客',
				items: [
					{ text: '文章列表', link: '/blogs/' },
					...items
				]
			}
		]
	}
}

export default getBlogSidebar()
