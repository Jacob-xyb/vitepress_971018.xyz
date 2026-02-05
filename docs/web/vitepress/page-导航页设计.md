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
             class="link-card">
            <div class="link-icon">
              <img v-if="isImageIcon(link.icon)" :src="link.icon" :alt="link.name" />
              <span v-else>{{ link.icon || '🔗' }}</span>
            </div>
            <div class="link-info">
              <div class="link-name">{{ link.name }}</div>
              <div class="link-desc">{{ link.desc }}</div>
            </div>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { navData } from '../../../nav/links.js'

const activeCategory = ref(navData.categories[0]?.id || 'daily')
const categories = navData.categories
const links = navData.links

const currentSections = computed(() => links[activeCategory.value] || [])

// 判断是否为图片路径
const isImageIcon = (icon) => {
  if (!icon) return false
  return icon.startsWith('/') || icon.startsWith('http') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.svg') || icon.endsWith('.webp')
}
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
          { name: 'GitHub', url: 'https://github.com', desc: '全球最大的代码托管平台', icon: '🐙' },
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
        ]
      }
    ],
    
    design: [
      {
        title: '设计工具',
        icon: '🎨',
        links: [
          { name: 'Figma', url: 'https://www.figma.com', desc: '在线UI设计工具', icon: '🎨' },
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
  icon: '🔥' 
}
```

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

### 修改卡片悬停效果

```css
.link-card:hover {
  transform: translateY(-2px); /* 上移距离 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 阴影 */
}
```

## 注意事项

1. 数据文件 `links.js` 必须放在 `docs/nav/` 目录下
2. 组件会自动识别 icon 类型（emoji 或图片）
3. 图片路径相对于 `docs/public/` 目录
4. 移动端会自动切换为横向滚动的分类导航
5. 支持 VitePress 的深色模式，使用 CSS 变量自动适配

## 扩展功能

### 添加搜索功能

可以在组件中添加搜索框，过滤链接：

```vue
<input v-model="searchQuery" placeholder="搜索..." />
```

### 添加收藏功能

使用 `localStorage` 保存用户收藏的链接：

```javascript
const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))
```

### 添加访问统计

记录链接点击次数：

```javascript
const handleLinkClick = (link) => {
  // 统计逻辑
}
```

## 总结

通过这种方式，你可以：
- ✅ 在 JS 文件中轻松管理导航数据
- ✅ 支持 emoji 和图片 icon
- ✅ 响应式布局，移动端友好
- ✅ 符合 VitePress 的设计风格
- ✅ 易于扩展和定制
