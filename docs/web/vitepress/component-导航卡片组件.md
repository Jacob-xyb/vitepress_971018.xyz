# 导航卡片组件 NavCards

一个通用的导航卡片组件，用于创建美观的内容导航页面。

## 效果展示

导航卡片组件会创建一个响应式网格布局，每个卡片包含：
- 图标（支持 emoji 或自定义图片）
- 标题和描述
- 标签（可选）
- 悬停动画效果

## 组件特点

- ✅ 响应式网格布局，自动适配屏幕宽度
- ✅ 支持 emoji 图标和自定义图片图标
- ✅ 支持标签分类显示
- ✅ 平滑的悬停动画效果
- ✅ 深色模式自动适配
- ✅ 数据与样式分离，易于维护

## 快速开始

### 1. 创建数据文件

在页面同级目录创建 `links.js` 文件：

```js
// 导航链接数据
export const navLinks = [
  {
    id: 'item1',           // 唯一标识
    title: 'Git',          // 标题
    icon: '📦',            // 图标（emoji 或图片路径）
    desc: '版本控制系统',   // 描述
    link: '/coding/git/',  // 链接地址
    tags: ['版本控制', '协作开发']  // 标签（可选）
  },
  {
    id: 'item2',
    title: 'Markdown',
    icon: 'markdown',      // 使用 ThemeIcon 组件的图标名
    desc: '轻量级标记语言',
    link: '/skills/markdown/',
    tags: ['文档', '写作']
  },
  {
    id: 'item3',
    title: 'VitePress',
    icon: '/logo/vitepress-logo.svg',  // 自定义图片路径
    desc: '静态站点生成器',
    link: '/web/vitepress/',
    tags: ['文档', '静态站点']
  }
]
```

### 2. 在页面中使用

在 Markdown 文件中导入并使用组件：

```md
---
layout: home
---

# 我的导航页

这是一个导航页面示例。

## 内容导航

<script setup>
import { navLinks } from './links.js'
</script>

<NavCards :items="navLinks" />
```

就这么简单！组件会自动渲染所有卡片。

## 数据格式说明

### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String | 唯一标识符，用于 Vue 的 key |
| `title` | String | 卡片标题 |
| `link` | String | 跳转链接地址 |

### 可选字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `icon` | String | 图标，支持三种格式：<br>1. emoji：`'📦'`<br>2. 自定义图片：`'/logo/icon.svg'`<br>3. ThemeIcon 名称：`'markdown'` |
| `desc` | String | 卡片描述文字 |
| `tags` | Array | 标签数组，如 `['标签1', '标签2']` |

### 图标类型详解

组件会根据图标内容自动判断类型并使用对应的渲染方式。

#### 1. Emoji 图标（推荐）

最简单的方式，直接使用 emoji：

```js
{
  icon: '📦'  // Git
  icon: '🐍'  // Python
  icon: '🐳'  // Docker
}
```

**优点**：
- 无需额外资源，直接显示
- 跨平台兼容性好
- 颜色丰富，自动适配系统

#### 2. 自定义图片

使用自定义 SVG 或图片（相对于 `docs/public/` 目录）：

```js
{
  icon: '/logo/vitepress-logo.svg'  // 对应 docs/public/logo/vitepress-logo.svg
  icon: '/icons/custom-icon.png'    // 对应 docs/public/icons/custom-icon.png
}
```

**识别规则**：
- 以 `/` 开头
- 或包含 `.` 和 `/`（文件路径特征）

#### 3. ThemeIcon 图标

使用 Simple Icons 的图标名称（纯英文字母、数字和连字符）：

```js
{
  icon: 'markdown'  // Markdown 图标
  icon: 'github'    // GitHub 图标
  icon: 'vue'       // Vue 图标
  icon: 'node-js'   // Node.js 图标（注意使用连字符）
}
```

**识别规则**：
- 仅包含英文字母、数字和连字符 `-`
- 符合正则表达式：`/^[a-z0-9-]+$/i`

**注意**：
- ThemeIcon 仅支持 [Simple Icons](https://simpleicons.org/) 中的图标名称
- 图标名称必须是纯英文，不能包含特殊字符或 emoji
- 如果图标名称不存在，会显示加载失败

#### 图标类型判断优先级

组件按以下顺序判断图标类型：

1. **自定义图片**：检查是否包含路径特征（`/` 或 `.` + `/`）
2. **ThemeIcon**：检查是否为纯英文字母、数字和连字符
3. **Emoji/文本**：其他情况直接显示

```js
// 示例：不同类型的图标
const examples = [
  { icon: '/logo/icon.svg' },      // → 自定义图片
  { icon: 'github' },               // → ThemeIcon
  { icon: 'node-js' },              // → ThemeIcon
  { icon: '📦' },                   // → Emoji
  { icon: '🎨' },                   // → Emoji
  { icon: 'Git 图标' },             // → 文本（包含空格和中文）
]
```

## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | Array | `[]` | 导航数据数组（必填） |
| `iconSize` | String | `'48px'` | 图标大小 |

### 自定义图标大小

```md
<NavCards :items="navLinks" iconSize="64px" />
```

## 完整示例

### 示例 1：编程导航页

**文件：`docs/coding/links.js`**

```js
export const codingLinks = [
  {
    id: 'git',
    title: 'Git',
    icon: '📦',
    desc: '版本控制系统',
    link: '/coding/git/',
    tags: ['版本控制', '协作开发']
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    icon: '🟨',
    desc: 'Web开发语言',
    link: '/coding/javascript/',
    tags: ['前端', '编程语言']
  },
  {
    id: 'python',
    title: 'Python',
    icon: '🐍',
    desc: '通用编程语言',
    link: '/coding/python/',
    tags: ['编程语言', '数据分析']
  }
]
```

**文件：`docs/coding/index.md`**

```md
---
layout: home
---

# 编程

记录编程开发过程中的各种知识点和技巧。

## 内容导航

<script setup>
import { codingLinks } from './links.js'
</script>

<NavCards :items="codingLinks" />
```

### 示例 2：IT技能导航页

**文件：`docs/skills/links.js`**

```js
export const skillsLinks = [
  {
    id: 'markdown',
    title: 'Markdown',
    icon: 'markdown',
    desc: '轻量级标记语言',
    link: '/skills/markdown/',
    tags: ['文档', '写作']
  },
  {
    id: 'shell',
    title: 'Shell脚本',
    icon: '💻',
    desc: '命令行脚本编程',
    link: '/skills/shell/',
    tags: ['命令行', '自动化']
  },
  {
    id: 'nginx',
    title: 'Nginx',
    icon: '🚀',
    desc: 'Web服务器',
    link: '/skills/nginx/',
    tags: ['服务器', '反向代理']
  }
]
```

**文件：`docs/skills/index.md`**

```md
---
layout: home
---

# IT必备技能

记录IT从业者必备的基础技能和工具使用。

## 内容导航

<script setup>
import { skillsLinks } from './links.js'
</script>

<NavCards :items="skillsLinks" />
```

## 样式定制

组件使用 VitePress 的 CSS 变量，自动适配主题颜色。如需自定义样式，可以在页面中添加：

```md
<NavCards :items="navLinks" />

<style scoped>
/* 自定义卡片间距 */
:deep(.nav-cards) {
  gap: 1.5rem;
}

/* 自定义卡片最小宽度 */
:deep(.nav-cards) {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

/* 自定义悬停效果 */
:deep(.nav-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>
```

## 最佳实践

### 1. 数据组织

- 将数据文件放在页面同级目录
- 使用有意义的文件名，如 `links.js`
- 按分类组织数据，便于维护

### 2. 图标选择

- 优先使用 emoji，简单直观
- 需要品牌图标时使用自定义图片
- 保持同一页面图标风格统一

### 3. 标签使用

- 标签数量建议 1-3 个
- 使用简短的关键词
- 标签要有实际意义，帮助用户理解

### 4. 描述文字

- 描述要简洁明了，一句话说清楚
- 长度建议 10-20 字
- 突出核心特点

## 常见问题

### Q: 图标不显示？

**A:** 检查以下几点：

1. **Emoji 不显示**：
   - 确认 emoji 已正确复制
   - 某些 emoji 在不同系统上显示可能不同

2. **自定义图片不显示**：
   - 检查图片路径是否正确（相对于 `docs/public/`）
   - 确认图片文件存在
   - 路径必须以 `/` 开头，如 `/logo/icon.svg`

3. **ThemeIcon 不显示**：
   - 确认图标名称在 [Simple Icons](https://simpleicons.org/) 中存在
   - 图标名称只能包含英文字母、数字和连字符 `-`
   - 不能包含空格、下划线或其他特殊字符
   - 示例：`'github'` ✅  `'node-js'` ✅  `'node_js'` ❌

4. **图标类型判断错误**：
   - 如果想使用 ThemeIcon 但显示为文本，检查名称是否包含非法字符
   - 如果想显示文本但被识别为 ThemeIcon，可以添加空格或特殊字符

### Q: 如何强制使用某种图标类型？

**A:** 根据识别规则调整图标格式：

```js
// 强制使用自定义图片
{ icon: '/logo/icon.svg' }  // 以 / 开头

// 强制使用 ThemeIcon
{ icon: 'github' }  // 纯英文字母

// 强制显示为文本/Emoji
{ icon: '📦' }      // Emoji
{ icon: 'Git 图标' } // 包含空格或中文
```

### Q: 如何调整卡片宽度？

**A:** 修改 `grid-template-columns` 的 `minmax` 值：

```css
:deep(.nav-cards) {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}
```

### Q: 如何隐藏标签？

**A:** 不设置 `tags` 字段，或设置为空数组：

```js
{
  id: 'item1',
  title: 'Git',
  icon: '📦',
  desc: '版本控制系统',
  link: '/coding/git/'
  // 不设置 tags 字段
}
```

### Q: 可以添加外部链接吗？

**A:** 可以，直接使用完整 URL：

```js
{
  id: 'github',
  title: 'GitHub',
  icon: '🐙',
  desc: '代码托管平台',
  link: 'https://github.com',  // 外部链接
  tags: ['代码托管']
}
```

## 技术实现

### 组件源码位置

```
docs/.vitepress/theme/components/NavCards.vue
```

### 组件注册

在 `docs/.vitepress/theme/index.js` 中全局注册：

```js
import NavCards from './components/NavCards.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NavCards', NavCards)
  }
}
```

### 核心特性

1. **响应式布局**：使用 CSS Grid 自动适配
2. **图标智能识别**：自动判断图标类型并渲染
3. **主题适配**：使用 CSS 变量，自动适配深色模式
4. **性能优化**：使用 Vue 3 的 `v-for` 和 `key` 优化渲染

## 相关文档

- [ThemeIcon 组件](/web/vitepress/ui-Icon美化.md) - 了解图标组件
- [导航页设计](/web/vitepress/page-导航页设计.md) - 了解导航页设计思路

## 总结

NavCards 组件提供了一个简单而强大的方式来创建导航页面：

- ✅ 数据驱动，易于维护
- ✅ 样式统一，自动适配主题
- ✅ 使用简单，只需两步
- ✅ 功能完整，支持多种图标和标签

现在你可以快速创建美观的导航页面了！
