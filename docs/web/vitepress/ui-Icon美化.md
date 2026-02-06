# Icon 美化

本文介绍如何在 VitePress 中创建一个支持主题自适应的图标组件，自动适配深色/浅色模式。

## 效果预览

- 支持 2000+ Simple Icons 品牌图标
- 自动适配深色/浅色模式
- 可自定义颜色
- 从 CDN 加载，无需下载
- 支持自定义尺寸

## 实现步骤

### 1. 创建 ThemeIcon 组件

在 `docs/.vitepress/theme/components/` 目录下创建 `ThemeIcon.vue`：

::: details 点击展开 ThemeIcon.vue 完整代码
```vue
<template>
  <img 
    :src="iconUrl" 
    :alt="alt"
    :style="{ width, height }"
    class="theme-icon"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

/**
 * 默认颜色配置
 * 当用户未指定 lightColor/darkColor 且未指定 color 时使用
 */
const PROP_DEFAULTS = {
  lightColor: '#2c3e50',  // 浅色模式默认：深灰
  darkColor: '#e5e7eb'    // 深色模式默认：浅灰
}

const props = defineProps({
  // 图标名称（Simple Icons 的 slug，如 'markdown', 'github', 'vue'）
  icon: {
    type: String,
    required: true
  },
  // 固定颜色（两种主题都使用此颜色，作为 lightColor 和 darkColor 的回退值）
  color: {
    type: String,
    default: undefined
  },
  // 浅色模式颜色（支持 #ffffff 或 ffffff 格式）
  // 优先级：lightColor > color > PROP_DEFAULTS.lightColor
  lightColor: {
    type: String,
    default: undefined
  },
  // 深色模式颜色（支持 #ffffff 或 ffffff 格式）
  // 优先级：darkColor > color > PROP_DEFAULTS.darkColor
  darkColor: {
    type: String,
    default: undefined
  },
  // 图标尺寸（支持 px, rem, em, % 单位）
  size: {
    type: String,
    default: '24px'
  },
  // 图标的 alt 文本（用于无障碍访问）
  alt: {
    type: String,
    default: ''
  }
})

const { isDark } = useData()

/**
 * 处理颜色格式：去掉开头的 # 号
 * Simple Icons CDN 不需要 # 前缀
 */
const normalizeColor = (color) => {
  return color?.replace(/^#/, '')
}

/**
 * 根据当前主题动态生成图标 URL
 * 颜色选择优先级：
 * - 浅色模式：lightColor > color > PROP_DEFAULTS.lightColor
 * - 深色模式：darkColor > color > PROP_DEFAULTS.darkColor
 */
const iconUrl = computed(() => {
  let color
  
  if (isDark.value) {
    // 深色模式
    color = normalizeColor(props.darkColor ?? props.color ?? PROP_DEFAULTS.darkColor)
  } else {
    // 浅色模式
    color = normalizeColor(props.lightColor ?? props.color ?? PROP_DEFAULTS.lightColor)
  }
  
  return `https://cdn.simpleicons.org/${props.icon}/${color}`
})

const width = computed(() => props.size)
const height = computed(() => props.size)
</script>

<style scoped>
.theme-icon {
  object-fit: contain;
  vertical-align: middle;
}
</style>
```
:::

### 2. 注册全局组件

在 `docs/.vitepress/theme/index.js` 中注册组件：

```javascript
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ThemeIcon from './components/ThemeIcon.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ThemeIcon', ThemeIcon)
  }
}
```

### 3. 使用组件

在 Markdown 或 Vue 组件中使用：

**基础用法：**
```vue
<ThemeIcon icon="github" />
```

**自定义尺寸：**
```vue
<ThemeIcon icon="vue" size="48px" />
```

**自定义颜色（两种模式相同）：**
```vue
<ThemeIcon icon="twitter" color="#1DA1F2" />
```

**分别设置浅色/深色模式颜色：**
```vue
<ThemeIcon 
  icon="github" 
  lightColor="#181717"
  darkColor="#ffffff"
/>
```

## 使用说明

### 查找图标名称

访问 [Simple Icons](https://simpleicons.org/) 查找你需要的图标：

1. 搜索品牌名称（如 "GitHub"）
2. 点击图标查看详情
3. 复制 "Slug" 字段的值（如 `github`）
4. 在组件中使用：`<ThemeIcon icon="github" />`

**常用图标：**
- `github` - GitHub
- `twitter` - Twitter / X
- `discord` - Discord
- `youtube` - YouTube
- `linkedin` - LinkedIn
- `facebook` - Facebook
- `instagram` - Instagram
- `vue` - Vue.js
- `react` - React
- `nodejs` - Node.js
- `python` - Python
- `javascript` - JavaScript
- `typescript` - TypeScript

### 颜色配置

**优先级：**
```
lightColor > color > 默认浅色 (#2c3e50)
darkColor > color > 默认深色 (#e5e7eb)
```

**示例：**

| 配置 | 浅色模式 | 深色模式 |
|------|---------|---------|
| 无配置 | #2c3e50 | #e5e7eb |
| `color="#ff0000"` | #ff0000 | #ff0000 |
| `lightColor="#000" darkColor="#fff"` | #000000 | #ffffff |

### 在导航页中使用

如果你有导航页组件，可以这样集成：

**1. 导入 ThemeIcon：**
```vue
<script setup>
import ThemeIcon from './ThemeIcon.vue'
</script>
```

**2. 判断图标类型：**
```javascript
// 判断是否为 Simple Icons 名称
const isSimpleIcon = (icon) => {
  if (!icon || typeof icon !== 'string') return false
  // 不包含 / . http 等路径特征
  return !icon.includes('/') && 
         !icon.includes('.') && 
         !icon.startsWith('http') && 
         /^[a-z0-9-]+$/i.test(icon)
}

// 判断是否为图片路径
const isImageIcon = (icon) => {
  if (!icon) return false
  return icon.startsWith('/') || 
         icon.startsWith('http') || 
         icon.endsWith('.png') || 
         icon.endsWith('.jpg') || 
         icon.endsWith('.svg')
}
```

**3. 在模板中使用：**
```vue
<div class="link-icon">
  <!-- Simple Icons -->
  <ThemeIcon 
    v-if="isSimpleIcon(link.icon)" 
    :icon="link.icon" 
    size="36px"
    :alt="link.name"
  />
  <!-- 图片路径 -->
  <img 
    v-else-if="isImageIcon(link.icon)" 
    :src="link.icon" 
    :alt="link.name" 
  />
  <!-- Emoji 或默认图标 -->
  <span v-else>{{ link.icon || '🔗' }}</span>
</div>
```

**4. 数据配置：**
```javascript
export const navData = {
  links: {
    dev: [
      {
        title: '开发工具',
        icon: '🛠️',
        links: [
          // 使用 Simple Icons
          { name: 'GitHub', icon: 'github', url: '...' },
          { name: 'VS Code', icon: 'visualstudiocode', url: '...' },
          
          // 使用图片
          { name: 'Custom', icon: '/logo/custom.png', url: '...' },
          
          // 使用 Emoji
          { name: 'Link', icon: '🔗', url: '...' }
        ]
      }
    ]
  }
}
```

## 优势

### 相比 Emoji

| 特性 | ThemeIcon | Emoji |
|------|-----------|-------|
| 专业度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 主题适配 | ✅ 自动 | ✅ 自动 |
| 品牌一致性 | ✅ 官方图标 | ❌ 样式不统一 |
| 自定义颜色 | ✅ 支持 | ❌ 不支持 |

### 相比本地图片

| 特性 | ThemeIcon | 本地图片 |
|------|-----------|---------|
| 文件大小 | ✅ CDN 加载 | ❌ 增加仓库体积 |
| 主题适配 | ✅ 自动 | ❌ 需要手动处理 |
| 维护成本 | ✅ 无需维护 | ❌ 需要下载管理 |
| 加载速度 | ✅ CDN 缓存 | ⭐ 取决于服务器 |

### 相比 VitePress socialLinks

| 特性 | ThemeIcon | socialLinks |
|------|-----------|-------------|
| 使用场景 | ✅ 任意位置 | ❌ 仅导航栏 |
| 自定义颜色 | ✅ 支持 | ❌ 固定颜色 |
| 自定义尺寸 | ✅ 支持 | ❌ 固定尺寸 |
| 图标数量 | ✅ 2000+ | ⭐ 常用社交 |

## 注意事项

1. **网络依赖**：图标从 CDN 加载，需要网络连接
2. **图标名称**：必须使用 Simple Icons 的 slug（全小写，用连字符分隔）
3. **颜色格式**：支持 `#ffffff` 或 `ffffff` 格式
4. **尺寸单位**：支持 `px`、`rem`、`em`、`%` 等 CSS 单位
5. **无障碍**：建议设置 `alt` 属性

## 扩展功能

### 添加加载失败处理

可以添加图片加载失败的回退方案：

```vue
<template>
  <img 
    :src="iconUrl" 
    :alt="alt"
    :style="{ width, height }"
    class="theme-icon"
    @error="handleError"
  />
</template>

<script setup>
const handleError = (e) => {
  // 加载失败时显示默认图标
  e.target.src = 'data:image/svg+xml,<svg>...</svg>'
}
</script>
```

### 添加品牌原色支持

Simple Icons 提供了品牌原色，可以添加 `brandColor` 选项：

```javascript
const iconUrl = computed(() => {
  // 如果指定使用品牌色
  if (props.brandColor) {
    return `https://cdn.simpleicons.org/${props.icon}`
  }
  
  // 否则使用自定义颜色
  let color = isDark.value 
    ? normalizeColor(props.darkColor ?? props.color ?? PROP_DEFAULTS.darkColor)
    : normalizeColor(props.lightColor ?? props.color ?? PROP_DEFAULTS.lightColor)
  
  return `https://cdn.simpleicons.org/${props.icon}/${color}`
})
```

## 总结

ThemeIcon 组件提供了：
- ✅ 2000+ 品牌图标支持
- ✅ 自动主题适配
- ✅ 灵活的颜色配置
- ✅ 简单易用的 API
- ✅ 无需下载维护
- ✅ CDN 加速加载

适合用于：
- 导航页图标
- 技术栈展示
- 社交链接
- 品牌标识
- 任何需要图标的场景
