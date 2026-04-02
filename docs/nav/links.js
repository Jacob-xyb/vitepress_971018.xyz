// 导航链接数据
// 格式说明：
// - 每个分类包含 id, name, icon 和 sections
// - 每个 section 包含 title, icon 和 links
// - 每个 link 包含 name, url, desc, icon 和可选的标识属性
// - baseCount: 基准访问次数（用于显示初始热度）

// 热度配置：根据访问次数排名显示火焰标识
export const hotConfig = {
	minCount: 5,        // 最少访问次数才显示热度
	topHot: 5,          // 前 5 名显示 🔥🔥🔥
	secondHot: 10,      // 前 6-10 名显示 🔥🔥
	thirdHot: 20        // 前 11-20 名显示 🔥
}

// 全场最佳配置：根据访问次数排名显示特殊标识
export const mvpConfig = {
	minCount: 5,        // 最少访问次数才能进入全场最佳
	onePiece: 1,        // 前 1 名：OnePiece（海贼王）
	yonko: 4,           // 前 2-5 名：四皇
	shichibukai: 7      // 前 6-12 名：七武海
}

export const navData = {
	categories: [
		{ id: 'mvp', name: '全场最佳', icon: '🏆' },
		{ id: 'daily', name: '日常使用', icon: '⭐' },
		{ id: 'media', name: '影视资源', icon: '🎬' },
		{ id: 'dev', name: '开发工具', icon: '🛠️' },
		{ id: 'design', name: '设计资源', icon: '🎨' },
		{ id: 'resources', name: '素材中心', icon: '📦' },
		{ id: 'ai', name: 'AI工具', icon: '🤖' },
		{ id: 'study', name: '学习相关', icon: '📚' },
		{ id: 'life', name: '生活服务', icon: '/icon/openmoji-viennese-coffee-house.svg' },
		{ id: 'game', name: '游戏娱乐', icon: '🎮' },
		{ id: 'uncategorized', name: '待分类', icon: '📋' },
	],

	links: {
		daily: [
			{
				title: '日常必备',
				icon: '💎',
				links: [
					{ name: 'DeepSeek', url: 'https://chat.deepseek.com/', desc: '国产AI对话助手', icon: '/logo/deepseek-logo.svg', isFree: true, needLogin: true, baseCount: 9 },
					{ name: '闲鱼', url: 'https://www.goofish.com/', desc: '最大闲置交易市场', icon: 'https://img.alicdn.com/tfs/TB19WObTNv1gK0jSZFFXXb0sXXa-144-144.png', needLogin: true, baseCount: 3 },
				]
			},
			{
				title: '强烈推荐',
				icon: '⭐',
				links: [
					{ name: 'Simple Icons', url: 'https://simpleicons.org/', desc: '3000+ 品牌图标库', icon: 'simpleicons', isFree: true, baseCount: 6 },
					{ name: 'GitHub', url: 'https://github.com', desc: '全球最大的代码托管平台', icon: 'github', needVPN: true, isFree: true, baseCount: 7 },
					{ name: 'Notion', url: 'https://www.notion.so', desc: 'AI工作空间，你的智能助手', icon: 'https://www.notion.so/front-static/favicon.ico', needLogin: true, isFree: true, baseCount: 2 },
				]
			}
		],

		media: [
			{
				title: '在线观看',
				icon: '📺',
				links: [
					{ name: '观影', url: 'https://www.xn--wcv59z.com/', desc: '聚合类 很强', icon: '👻', isFree: true, needLogin: true, baseCount: 1, backupUrl: "https://www.xn--ykq321c.com/" },
				]
			},
			{
				title: '资源下载',
				icon: '/icon/openmoji-film-projector.svg',
				links: [
					// 在这里添加下载网站
				]
			},
			{
				title: '动漫',
				icon: '🎭',
				links: [
					{ name: 'AGE动漫', url: 'https://www.agedm.io/', desc: '在线、免费', icon: 'https://www.agedm.io/favicon.ico', isFree: true, needLogin: true, baseCount: 0, backupUrl: "age.tv" },
					
				]
			},
			{
				title: '美剧',
				icon: '🇺🇸',
				links: [
					// 在这里添加美剧网站
				]
			},
			{
				title: '日剧',
				icon: '🇯🇵',
				links: [
					// 在这里添加日剧网站
				]
			},
			{
				title: '韩剧',
				icon: '🇰🇷',
				links: [
					// 在这里添加韩剧网站
				]
			},
			{
				title: '纪录片',
				icon: '🎥',
				links: [
					// 在这里添加纪录片网站
				]
			},
			{
				title: '字幕资源',
				icon: '💬',
				links: [
					// 在这里添加字幕网站
				]
			},
			{
				title: '影视素材',
				icon: '🎞️',
				links: [
					// 在这里添加影视素材网站
				]
			}
		],

		dev: [
			{
				title: '开发工具',
				icon: '🛠️',
				links: [
					{ name: 'VS Code', url: 'https://code.visualstudio.com', desc: '微软开发的代码编辑器', icon: '💻', baseCount: 0 },
					{ name: 'Git', url: 'https://git-scm.com', desc: '版本控制系统', icon: '📦', baseCount: 0 },
					{ name: 'npm', url: 'https://www.npmjs.com', desc: 'Node包管理器', icon: '📦', baseCount: 0 },
					{ name: 'Postman', url: 'https://www.postman.com', desc: 'API测试工具', icon: '📮', baseCount: 0 },
					// 图片示例：将图片放在 docs/public/icons/ 目录下
					// { name: 'VitePress', url: 'https://vitepress.dev', desc: '静态站点生成器', icon: '/logo/vitepress-logo.svg', baseCount: 0 },
				]
			},
			{
				title: '在线工具',
				icon: '🌐',
				links: [
					{ name: 'Notion', url: 'https://www.notion.so', desc: 'AI工作空间，你的智能助手', icon: 'https://www.notion.so/front-static/favicon.ico', needLogin: true, isFree: true, baseCount: 2 },
					{ name: 'CodePen', url: 'https://codepen.io', desc: '在线代码编辑器', icon: '✏️', baseCount: 0 },
					{ name: 'Gitee', url: 'https://gitee.com', desc: '代码托管平台', icon: 'https://gitee.com/favicon.ico', baseCount: 0 },
					{ name: 'RegExr', url: 'https://regexr.com', desc: '正则表达式测试', icon: '🔍', baseCount: 0 },
					{ name: 'Can I Use', url: 'https://caniuse.com', desc: '浏览器兼容性查询', icon: '✅', baseCount: 0 },
				]
			},
			{
				title: '云服务平台',
				icon: '☁️',
				links: [
					{ name: 'Cloudflare', url: 'https://dash.cloudflare.com/', desc: 'CDN与网站安全服务', icon: 'cloudflare#F38020', needLogin: true, needVPN: true, isFree: true, baseCount: 2 },
				]
			}
		],

		design: [
			{
				title: '设计工具',
				icon: '🎨',
				links: [
					{ name: 'Figma', url: 'https://www.figma.com', desc: '在线UI设计工具', icon: '🎨', baseCount: 0 },
					{ name: 'Dribbble', url: 'https://dribbble.com', desc: '设计师作品分享', icon: '🏀', baseCount: 0 },
					{ name: 'Unsplash', url: 'https://unsplash.com', desc: '免费高质量图片', icon: '📷', baseCount: 0 },
				]
			}
		],

		resources: [
			{
				title: '图标资源',
				icon: '🎨',
				links: [
					{ name: 'Simple Icons', url: 'https://simpleicons.org/', desc: '3000+ 品牌图标库', icon: 'simpleicons', isFree: true, baseCount: 6 },
					{ name: 'OpenMoji', url: 'https://openmoji.org/', desc: '开源 Emoji 图标库', icon: '/logo/openmoji-logo.svg', isFree: true, baseCount: 3 },
					{ name: 'iconfont', url: 'https://www.iconfont.cn/', desc: '阿里巴巴矢量图标库', icon: 'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg', isFree: true, needLogin: true, baseCount: 3 },
				]
			},
			{
				title: '游戏素材',
				icon: '🖌️',
				links: [
					{ name: 'Game FAQ', url: 'https://gamefaqs.gamespot.com/', desc: '齐全的游戏封面论坛', icon: '/logo/game-faq.ico', needVPN: true, isFree: true, baseCount: 5 },
				]
			},
			{
				title: 'CDN服务',
				icon: '🌐',
				links: [
					{ name: 'jsDelivr', url: 'https://www.jsdelivr.com/', desc: '免费开源CDN', icon: '📦', isFree: true, baseCount: 1 },
					{ name: 'cdnjs', url: 'https://cdnjs.com/', desc: '前端库CDN', icon: '📚', isFree: true, baseCount: 0 },
				]
			}
		],

		ai: [
			{
				title: 'AI工具',
				icon: '🤖',
				links: [
					{ name: 'DeepSeek', url: 'https://chat.deepseek.com/', desc: '国产AI对话助手', icon: '/logo/deepseek-logo.svg', isFree: true, needLogin: true, baseCount: 9 },
					{ name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'OpenAI对话AI', icon: '💬', needVPN: true, needLogin: true, baseCount: 0 },
					{ name: 'Midjourney', url: 'https://www.midjourney.com', desc: 'AI绘画工具', icon: '🎨', needLogin: true, needPay: true, baseCount: 0 },
					{ name: 'Claude', url: 'https://claude.ai', desc: 'Anthropic AI助手', icon: '🤖', needVPN: true, needLogin: true, baseCount: 1 },
				]
			},
			{
				title: 'Coding Plan',
				links: [
					{ name: 'MiniMax', url: 'https://www.minimaxi.com/', desc: '与所有人共创智能', icon: 'https://www.minimaxi.com/favicon.ico', needLogin: true, needPay: true, baseCount: 5 },
				]
			}
		],

		study: [
			{
				title: '学习工具',
				icon: '📖',
				links: [
					{ name: '有道词典', url: 'https://www.youdao.com/', desc: '在线翻译与词典', icon: '📕', isFree: true, baseCount: 2 },
				]
			}
		],

		life: [
			{
				title: '聚合搜索',
				icon: '🔍',
				links: [
					{ name: '龙轩导航', url: 'http://ilxdh.com/cat/171', desc: '做个有用的导航', icon: 'http://ilxdh.com/cat/171/favicon.ico', isFree: true, baseCount: 0 },
				]
			},
			{
				title: '生活服务',
				icon: '🏠',
				links: [
					{ name: '百度地图', url: 'https://map.baidu.com', desc: '地图导航服务', icon: '🗺️', baseCount: 0 },
					{ name: '天气预报', url: 'https://www.weather.com.cn', desc: '天气查询', icon: '🌤️', baseCount: 0 },
					{ name: '12306', url: 'https://www.12306.cn', desc: '火车票预订', icon: '🚄', baseCount: 0 },
				]
			},
		],

		game: [
			{
				title: '游戏平台',
				icon: '🎮',
				links: [
					{ name: 'Steam', url: 'https://store.steampowered.com', desc: 'PC游戏平台', icon: '🎮', baseCount: 0 },
					{ name: 'PlayStation', url: 'https://www.playstation.com', desc: 'PS游戏平台', icon: '🎮', baseCount: 0 },
					{ name: 'Nintendo', url: 'https://www.nintendo.com', desc: '任天堂官网', icon: '🎮', baseCount: 0 },
				]
			},
			{
				title: '游戏下载',
				icon: '/icon/mage--video-download.svg',
				links: [
					{ name: 'switch520', url: 'https://www.gamer520.com/', desc: '完全的免费的switch下载', icon: 'https://ig.freer.blog/2023/10/25/d67adcffb89dd.jpg', isFree: true, }
				]
			},
			{
				title: '游戏攻略',
				icon: '📖',
				links: [
					{ name: 'PSN中文站', url: 'https://www.psnine.com/', desc: 'PS白金中文站', icon: 'https://www.psnine.com/View/aimage/p9.png', isFree: true, needLogin: true, baseCount: 1 }
				]
			}
		],

		uncategorized: [
			{
				title: '待整理',
				icon: '📋',
				links: [
					{ name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: '程序员问答社区', icon: '📚', hasAds: true, baseCount: 0 },
					{ name: 'MDN', url: 'https://developer.mozilla.org', desc: 'Web开发文档', icon: '📖', isFree: true, baseCount: 0 },
					// 在这里添加待分类的链接
				]
			}
		]
	}
}
