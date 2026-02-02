# 样式相关问题

## 自定义样式不生效

**检查清单：**

### 1. 确认样式文件已引入

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

### 2. 检查 CSS 选择器优先级

VitePress 的默认样式可能会覆盖你的自定义样式，需要提高选择器优先级：

```css
/* ❌ 优先级不够 */
.nav-card {
  border: 1px solid red;
}

/* ✅ 提高优先级 */
.vp-doc .nav-card {
  border: 1px solid red;
}

/* ✅ 或使用 !important（不推荐） */
.nav-card {
  border: 1px solid red !important;
}
```

### 3. 使用 CSS 变量

VitePress 提供了很多 CSS 变量，建议使用它们：

```css
.nav-card {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
```

## 深色模式样式问题

**使用 CSS 变量自动适配：**

```css
/* ✅ 推荐：使用 VitePress 的 CSS 变量 */
.my-element {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* ❌ 不推荐：硬编码颜色 */
.my-element {
  background: #ffffff;
  color: #000000;
}
```

**手动适配深色模式：**

```css
/* 浅色模式 */
.my-element {
  background: #ffffff;
}

/* 深色模式 */
.dark .my-element {
  background: #1a1a1a;
}
```

## Scoped 样式在 Markdown 中不生效

在 Markdown 文件中的 `<style scoped>` 只对当前页面生效：

```markdown
<style scoped>
.nav-card {
  /* 只在当前页面生效 */
}
</style>
```

如果需要全局样式，去掉 `scoped`：

```markdown
<style>
.nav-card {
  /* 全局生效 */
}
</style>
```

或者在 `.vitepress/theme/custom.css` 中定义全局样式。
