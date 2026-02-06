---
pageClass: wide-page
---

# 导航页设计

本文介绍如何在 VitePress 中创建一个左侧分类导航 + 右侧卡片式链接的导航页面。

## 效果预览

- 左侧分类导航栏，点击切换内容
- 右侧卡片式链接展示
- 支持 emoji 和图片 icon
- 响应式布局，移动端自适应
- 支持深色模式

## 实现步骤

### 1. 创建 Vue 组件

在 `docs/.vitepress/theme/components/` 目录下创建 `NavLinks.vue` 组件：

```vue
<template>
  <div class="nav-links-container">
    <!-- 左侧分类导航 -->
    <aside class="nav-sidebar">
      <div class="nav-category" 
           v-for="category in categories" 
           :key="category.id"
           :class="{ active: activeCategory === category.id }"
           @click="activeCategory = category.id">
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="nav-content">
      <div class="nav-section" v-for="section in currentSections" :key="section.title">
        <h2 class="section-title">
          <span class="title-icon">{{ section.icon }}</span>
          {{ section.title }}
        </h2>
        <div class="links-grid">
          <a v-for="link in section.links" 
             :key="link.name"
             :href="link.url"
             target="_blank"
             class="link-card"
             @click="handleLinkClick(link)">
            <div class="link-icon">
              <img v-if="isImageIcon(link.icon)" :src="link.icon" :alt="link.name" />
              <span v-else>{{ link.icon || '🔗' }}</span>
            </div>
            <div class="link-info">
              <div class="link-name">
                {{ link.name }}
                <span class="badges">
                  <span v-if="link.needVPN" class="badge badge-vpn" title="需要 VPN 访问">🌐</span>
                  <span v-if="link.hasAds" class="badge badge-ads" title="包含广告">📢</span>
                  <span v-if="link.needLogin" class="badge badge-login" title="需要登录">🔐</span>
                  <span v-if="link.needPay" class="badge badge-pay" title="需要付费">💰</span>
                  <span v-if="link.isFree" class="badge badge-free" title="完全免费">✨</span>
                  <span v-if="getHotLevel(link.url) > 0" class="badge badge-hot" :title="`已访问 ${getClickCount(link.url)} 次`">
                    {{ '🔥'.repeat(getHotLevel(link.url)) }}
                  </span>
                </span>
              </div>
              <div class="link-desc">{{ link.desc }}</div>
            </div>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { navData } from '../../../nav/links.js'

const activeCategory = ref(navData.categories[0]?.id || 'daily')
const categories = navData.categories
const links = navData.links
const linkStats = ref({})

const currentSections = computed(() => links[activeCategory.value] || [])

// 判断是否为图片路径
const isImageIcon = (icon) => {
  if (!icon) return false
  return icon.startsWith('/') || icon.startsWith('http') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.svg') || icon.endsWith('.webp')
}

// 加载统计数据
const loadStats = () => {
  try {
    const saved = localStorage.getItem('navLinkStats')
    if (saved) {
      linkStats.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

// 保存统计数据
const saveStats = () => {
  try {
    localStorage.setItem('navLinkStats', JSON.stringify(linkStats.value))
  } catch (error) {
    console.error('Failed to save stats:', error)
  }
}

// 记录点击
const handleLinkClick = (link) => {
  const url = link.url
  if (!linkStats.value[url]) {
    linkStats.value[url] = {
      count: 0,
      lastVisit: null
    }
  }
  linkStats.value[url].count++
  linkStats.value[url].lastVisit = new Date().toISOString()
  saveStats()
}

// 获取点击次数
const getClickCount = (url) => {
  return linkStats.value[url]?.count || 0
}

// 获取热度等级（用于显示火焰图标）
const getHotLevel = (url) => {
  const count = getClickCount(url)
  if (count >= 20) return 3  // 🔥🔥🔥
  if (count >= 10) return 2  // 🔥🔥
  if (count >= 5) return 1   // 🔥
  return 0
}

// 监听 localStorage 变化（跨标签页实时更新）
const handleStorageChange = (e) => {
  if (e.key === 'navLinkStats' && e.newValue) {
    try {
      linkStats.value = JSON.parse(e.newValue)
    } catch (error) {
      console.error('Failed to parse storage change:', error)
    }
  }
}

onMounted(() => {
  loadStats()
  // 监听其他标签页的 localStorage 变化
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
.nav-links-container {
  display: flex;
  min-height: 600px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 100%;
}

/* 左侧分类导航 */
.nav-sidebar {
  width: 200px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  padding: 20px 0;
  flex-shrink: 0;
}

.nav-category {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--vp-c-text-2);
}

.nav-category:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
}

.nav-category.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  border-right: 3px solid var(--vp-c-brand);
}

.category-icon {
  font-size: 20px;
  margin-right: 10px;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
}

/* 右侧内容区 */
.nav-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  max-height: 800px;
}

.nav-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.title-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* 链接卡片网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.link-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.link-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 12px;
  flex-shrink: 0;
  background: var(--vp-c-bg);
  border-radius: 8px;
}

.link-icon img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 4px;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badges {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.badge {
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  animation: pulse 2s ease-in-out infinite;
}

.badge-vpn {
  animation: pulse 2s ease-in-out infinite;
}

.badge-ads {
  animation: none;
  opacity: 0.8;
}

.badge-login {
  animation: none;
  opacity: 0.8;
}

.badge-pay {
  animation: none;
  opacity: 0.8;
}

.badge-free {
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.link-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-links-container {
    flex-direction: column;
  }

  .nav-sidebar {
    width: 100%;
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 10px;
  }

  .nav-category {
    flex-direction: column;
    padding: 10px 15px;
    white-space: nowrap;
  }

  .category-icon {
    margin-right: 0;
    margin-bottom: 4px;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

### 2. 注册全局组件

在 `docs/.vitepress/theme/index.js` 中注册组件：

```javascript
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import NavLinks from './components/NavLinks.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NavLinks', NavLinks)
  }
}
```

### 3. 创建数据文件

在 `docs/nav/` 目录下创建 `links.js` 数据文件：

```javascript
// 导航链接数据
export const navData = {
  categories: [
    { id: 'daily', name: '每日推荐', icon: '👑' },
    { id: 'dev', name: '开发工具', icon: '🛠️' },
    { id: 'design', name: '设计资源', icon: '🎨' },
  ],
  
  links: {
    daily: [
      {
        title: '每日推荐',
        icon: '⭐',
        links: [
          { name: 'GitHub', url: 'https://github.com', desc: '全球最大的代码托管平台', icon: '🐙', needVPN: true, isFree: true },
          { name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: '程序员问答社区', icon: '📚', hasAds: true },
          { name: 'MDN', url: 'https://developer.mozilla.org', desc: 'Web开发文档', icon: '📖', isFree: true },
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
        ]
      }
    ],
    
    design: [
      {
        title: '设计工具',
        icon: '🎨',
        links: [
          { name: 'Figma', url: 'https://www.figma.com', desc: '在线UI设计工具', icon: '🎨', needLogin: true },
        ]
      }
    ]
  }
}
```

### 4. 创建导航页面

在 `docs/nav/` 目录下创建 `index.md`：

```markdown
---
layout: page
aside: false
---

<div class="nav-page-wrapper">

# 导航中心

<NavLinks />

</div>

<style>
.nav-page-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
```

### 5. 添加导航链接

在 `docs/.vitepress/nav.js` 中添加导航项：

```javascript
export const nav = [
  // ... 其他导航
  { text: '导航', link: '/nav/' },
]
```

## 使用说明

### 添加新链接

在 `docs/nav/links.js` 中对应分类的 `links` 数组中添加：

```javascript
{ 
  name: '网站名称', 
  url: 'https://example.com', 
  desc: '网站描述', 
  icon: '🔥',
  needVPN: true,    // 可选，需要 VPN 访问
  hasAds: true,     // 可选，包含广告
  needLogin: true,  // 可选，需要登录
  needPay: true,    // 可选，需要付费
  isFree: true      // 可选，完全免费
}
```

**VPN 标识说明：**
- 添加 `needVPN: true` 会在网站名称后显示 🌐 图标
- 添加 `hasAds: true` 显示 📢（包含广告）
- 添加 `needLogin: true` 显示 🔐（需要登录）
- 添加 `needPay: true` 显示 💰（需要付费）
- 添加 `isFree: true` 显示 ✨（完全免费）
- 不添加或设置为 `false` 则不显示对应标识
- 可以同时使用多个标识

### 添加新分类

1. 在 `categories` 数组中添加分类信息：

```javascript
{ id: 'new', name: '新分类', icon: '🆕' }
```

2. 在 `links` 对象中添加对应数据：

```javascript
new: [
  {
    title: '子分类标题',
    icon: '🆕',
    links: [
      { name: '网站', url: 'https://example.com', desc: '描述', icon: '🔗' }
    ]
  }
]
```

### Icon 使用方式

支持三种 icon 格式：

**1. Emoji（推荐）**
```javascript
icon: '🐙'
```

**2. 本地图片**

将图片放在 `docs/public/` 目录下：
```javascript
icon: '/logo/vitepress-logo.svg'
icon: '/icons/website.png'
```

**3. 外部图片**
```javascript
icon: 'https://example.com/logo.png'
```

### VPN 标识

为需要 VPN 才能访问的网站添加标识：

```javascript
{ 
  name: 'GitHub', 
  url: 'https://github.com', 
  desc: '代码托管平台', 
  icon: '🐙',
  needVPN: true,    // 🌐 需要 VPN 访问
  hasAds: true,     // 📢 包含广告
  needLogin: true,  // 🔐 需要登录
  needPay: true,    // 💰 需要付费
  isFree: true      // ✨ 完全免费
}
```

**标识说明：**

| 标识 | 属性 | 说明 | 动画效果 |
|------|------|------|----------|
| 🌐 | `needVPN: true` | 需要 VPN 才能访问 | 呼吸动画 |
| 📢 | `hasAds: true` | 网站包含广告 | 无 |
| 🔐 | `needLogin: true` | 需要登录才能使用 | 无 |
| 💰 | `needPay: true` | 需要付费/充值 | 无 |
| ✨ | `isFree: true` | 完全免费无广告 | 闪烁动画 |

**效果：**
- 所有标识默认不显示，只有设置对应属性为 `true` 才显示
- 可以同时显示多个标识
- 鼠标悬停显示对应提示文字
- VPN 和免费标识带有动画效果，更醒目

## 样式定制

### 修改左侧导航栏宽度

在 `NavLinks.vue` 中修改：

```css
.nav-sidebar {
  width: 200px; /* 修改这里 */
}
```

### 修改卡片网格列数

```css
.links-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  /* minmax 第一个参数控制最小宽度，影响列数 */
}
```

### 修改标识图标

如果想更换标识图标，在 `NavLinks.vue` 中修改：

```vue
<span v-if="link.needVPN" class="badge badge-vpn" title="需要 VPN 访问">🌐</span>
<!-- 可以改成其他图标，如：🔒 ⚠️ 🔴 等 -->
```

### 添加自定义标识

可以添加更多自定义标识，例如：

1. 在数据中添加新属性：
```javascript
{ name: '网站', url: '...', isNew: true }
```

2. 在组件中添加显示逻辑：
```vue
<span v-if="link.isNew" class="badge badge-new" title="新网站">🆕</span>
```

3. 添加对应样式：
```css
.badge-new {
  animation: bounce 1s ease-in-out infinite;
}
```

## 注意事项

1. 数据文件 `links.js` 必须放在 `docs/nav/` 目录下
2. 组件会自动识别 icon 类型（emoji 或图片）
3. 图片路径相对于 `docs/public/` 目录
4. 移动端会自动切换为横向滚动的分类导航
5. 支持 VitePress 的深色模式，使用 CSS 变量自动适配
6. 标识图标支持鼠标悬停显示提示文字
7. 可以同时使用多个标识，它们会自动排列
8. VPN 和免费标识带有动画效果，更加醒目

## 扩展功能

### 添加搜索功能

可以在组件中添加搜索框，过滤链接：

```vue
<template>
  <div class="search-box">
    <input v-model="searchQuery" placeholder="搜索网站..." />
  </div>
</template>

<script setup>
const searchQuery = ref('')
const filteredLinks = computed(() => {
  // 根据 searchQuery 过滤链接
})
</script>
```

### 添加收藏功能

使用 `localStorage` 保存用户收藏的链接：

```javascript
const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

const toggleFavorite = (link) => {
  // 收藏/取消收藏逻辑
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
```

### 添加分类筛选

支持按标识筛选网站：

```vue
<div class="filter-buttons">
  <button @click="filterBy('isFree')">免费</button>
  <button @click="filterBy('needVPN')">需要VPN</button>
</div>
```

### 添加访问统计

**本教程已内置使用频率统计功能：**
- ✅ 自动记录每个链接的点击次数
- ✅ 根据访问频率排名显示火焰标识（可配置）
- ✅ 鼠标悬停显示具体访问次数
- ✅ 数据保存在浏览器 localStorage 中
- ✅ 火焰图标带有跳动动画效果
- ✅ 支持跨标签页实时更新
- ✅ 提供自动化脚本更新基准值

## 热度配置

在 `docs/nav/links.js` 中配置热度显示规则：

```javascript
export const hotConfig = {
  minCount: 5,        // 最少访问5次才显示热度
  topHot: 5,          // 前5名显示 🔥🔥🔥
  secondHot: 10,      // 前6-15名显示 🔥🔥
  thirdHot: 20        // 前16-35名显示 🔥
}
```

**热度规则说明：**
- 访问次数 < 5：不显示火焰
- 访问次数 ≥ 5 且排名前5：🔥🔥🔥
- 访问次数 ≥ 5 且排名6-15：🔥🔥
- 访问次数 ≥ 5 且排名16-35：🔥
- 其他：不显示火焰

**优势：**
- 基于排名而非固定阈值，更灵活
- 可以自定义各级热度的数量
- 自动适应你的使用习惯

## 统计数据更新工作流 ⭐

### 显示逻辑

**公式：** `显示次数 = baseCount + 用户本地点击次数`

- `baseCount`：基准访问次数（站长设置的全局热度，保存在代码中）
- 用户本地点击：保存在浏览器 localStorage 中
- 不同电脑/浏览器的数据独立

**示例：**

| 场景 | baseCount | 本地点击 | 显示次数 |
|------|-----------|---------|---------|
| 首次访问 | 20 | 0 | 20 |
| 点击10次后 | 20 | 10 | 30 |
| 站长更新到30 | 30 | 10 | 40 |

### 准备工作

1. **安装依赖**

```bash
npm install clipboardy
```

2. **添加 npm 命令**

在 `package.json` 中添加：
```json
{
  "scripts": {
    "update-nav-stats": "node scripts/update-nav-stats.js"
  }
}
{
  "scripts": {
    "update-nav-stats": "node scripts/update-nav-stats.js"
  }
}
```

### 使用流程（仅需两步）⭐

**步骤1：导出并更新**

在浏览器控制台（F12）运行：
```javascript
copyNavStats()
```

然后在终端运行：
```bash
npm run update-nav-stats
```

**步骤2：清除本地数据**

在浏览器控制台运行：
```javascript
clearNavStats()
```

完成！

### 开发模式全局函数

**主要使用：**
```javascript
copyNavStats()   // 一键复制统计数据到剪贴板
clearNavStats()  // 清除本地统计数据
```

**辅助功能（可选）：**
```javascript
exportNavStats()        // 查看详细统计（仅显示，不复制）
exportNavStatsToFile()  // 导出到JSON文件（剪贴板失败时的备用方案）
```

### 为什么要清除本地数据？

**数据流转：**
```
用户使用 → localStorage累积 → 导出 → 更新baseCount → 清除本地 → 新基准
```

**原因：** baseCount 已包含你的使用次数，不清除会重复计数

| 阶段 | baseCount | 本地 | 显示 | 状态 |
|------|-----------|------|------|------|
| 使用后 | 10 | 15 | 25 | 待更新 |
| 更新后 | 25 | 15 | 40 | ❌ 重复 |
| 清除后 | 25 | 0 | 25 | ✅ 正确 |

### 备用方案

**如果剪贴板复制失败：**
```javascript
exportNavStatsToFile()  // 下载 JSON 文件到本地
```
将下载的文件移到项目根目录，然后运行 `npm run update-nav-stats`

**查看详细统计（不更新）：**
```javascript
exportNavStats()  // 在控制台显示详细排名和访问次数
```

## 总结

通过这种方式，你可以：
- ✅ 在 JS 文件中轻松管理导航数据
- ✅ 支持 emoji 和图片 icon
- ✅ 使用多种标识标注网站特性（VPN、广告、登录、付费、免费）
- ✅ 响应式布局，移动端友好
- ✅ 符合 VitePress 的设计风格
- ✅ 易于扩展和定制
- ✅ 标识带有动画效果，用户体验更好

**标识功能总结：**

| 标识 | 属性 | 图标 | 动画 | 用途 |
|------|------|------|------|------|
| VPN | `needVPN: true` | 🌐 | 呼吸 | 需要 VPN 访问 |
| 广告 | `hasAds: true` | 📢 | 无 | 包含广告 |
| 登录 | `needLogin: true` | 🔐 | 无 | 需要登录 |
| 付费 | `needPay: true` | 💰 | 无 | 需要付费 |
| 免费 | `isFree: true` | ✨ | 闪烁 | 完全免费 |
| 热门 | 自动显示 | 🔥/🔥🔥/🔥🔥🔥 | 跳动 | 基于排名的访问热度 |

**使用频率统计说明：**
- 数据存储在浏览器 `localStorage` 中，仅保存在本地
- 每次点击链接自动记录
- 支持跨标签页实时更新（使用 `storage` 事件）
- 不同浏览器/设备的数据独立
- 清除浏览器数据会重置统计
- 适合个人使用，记录自己的常用网站
- Dev 模式下可导出数据并更新基准值
- 火焰标识基于访问次数排名动态显示
- 基于排名显示热度，而非固定阈值
- 可自定义热度配置（minCount、topHot、secondHot、thirdHot）
