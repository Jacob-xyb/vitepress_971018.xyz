// 导航链接数据
// 格式说明：
// - 每个分类包含 id, name, icon 和 sections
// - 每个 section 包含 title, icon 和 links
// - 每个 link 包含 name, url, desc 和 icon

export const navData = {
  categories: [
    { id: 'daily', name: '每日推荐', icon: '👑' },
    { id: 'dev', name: '开发工具', icon: '🛠️' },
    { id: 'design', name: '设计资源', icon: '🎨' },
    { id: 'ai', name: 'AI工具', icon: '🤖' },
    { id: 'life', name: '生活服务', icon: '🏠' },
    { id: 'game', name: '游戏娱乐', icon: '🎮' },
  ],
  
  links: {
    daily: [
      {
        title: '每日推荐',
        icon: '⭐',
        links: [
          { name: 'GitHub', url: 'https://github.com', desc: '全球最大的代码托管平台', icon: '🐙' },
          { name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: '程序员问答社区', icon: '📚' },
          { name: 'MDN', url: 'https://developer.mozilla.org', desc: 'Web开发文档', icon: '📖' },
        ]
      }
    ],
    
    dev: [
      {
        title: '开发工具',
        icon: '🛠️',
        links: [
          { name: 'VS Code', url: 'https://code.visualstudio.com', desc: '微软开发的代码编辑器', icon: '💻' },
          { name: 'Git', url: 'https://git-scm.com', desc: '版本控制系统', icon: '📦' },
          { name: 'npm', url: 'https://www.npmjs.com', desc: 'Node包管理器', icon: '📦' },
          { name: 'Postman', url: 'https://www.postman.com', desc: 'API测试工具', icon: '📮' },
          // 图片示例：将图片放在 docs/public/icons/ 目录下
          // { name: 'VitePress', url: 'https://vitepress.dev', desc: '静态站点生成器', icon: '/logo/vitepress-logo.svg' },
        ]
      },
      {
        title: '在线工具',
        icon: '🌐',
        links: [
          { name: 'CodePen', url: 'https://codepen.io', desc: '在线代码编辑器', icon: '✏️' },
          { name: 'RegExr', url: 'https://regexr.com', desc: '正则表达式测试', icon: '🔍' },
          { name: 'Can I Use', url: 'https://caniuse.com', desc: '浏览器兼容性查询', icon: '✅' },
        ]
      }
    ],
    
    design: [
      {
        title: '设计工具',
        icon: '🎨',
        links: [
          { name: 'Figma', url: 'https://www.figma.com', desc: '在线UI设计工具', icon: '🎨' },
          { name: 'Dribbble', url: 'https://dribbble.com', desc: '设计师作品分享', icon: '🏀' },
          { name: 'Unsplash', url: 'https://unsplash.com', desc: '免费高质量图片', icon: '📷' },
        ]
      }
    ],
    
    ai: [
      {
        title: 'AI工具',
        icon: '🤖',
        links: [
          { name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'OpenAI对话AI', icon: '💬' },
          { name: 'Midjourney', url: 'https://www.midjourney.com', desc: 'AI绘画工具', icon: '🎨' },
          { name: 'Claude', url: 'https://claude.ai', desc: 'Anthropic AI助手', icon: '🤖' },
        ]
      }
    ],
    
    life: [
      {
        title: '生活服务',
        icon: '🏠',
        links: [
          { name: '百度地图', url: 'https://map.baidu.com', desc: '地图导航服务', icon: '🗺️' },
          { name: '天气预报', url: 'https://www.weather.com.cn', desc: '天气查询', icon: '🌤️' },
          { name: '12306', url: 'https://www.12306.cn', desc: '火车票预订', icon: '🚄' },
        ]
      }
    ],
    
    game: [
      {
        title: '游戏平台',
        icon: '🎮',
        links: [
          { name: 'Steam', url: 'https://store.steampowered.com', desc: 'PC游戏平台', icon: '🎮' },
          { name: 'PlayStation', url: 'https://www.playstation.com', desc: 'PS游戏平台', icon: '🎮' },
          { name: 'Nintendo', url: 'https://www.nintendo.com', desc: '任天堂官网', icon: '🎮' },
        ]
      }
    ]
  }
}
