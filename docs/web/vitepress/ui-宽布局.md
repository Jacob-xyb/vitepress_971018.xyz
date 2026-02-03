# VitePress 宽布局配置

::: tip 适用场景
当页面需要展示大量数据、图表或表格时，默认的 688px 内容宽度可能不够用。通过宽布局配置，可以让特定页面充分利用屏幕空间。
:::

## 快速使用

在需要宽布局的 Markdown 文件的 frontmatter 中添加 `pageClass`：

```yaml
---
title: 页面标题
pageClass: wide-page
---

# 页面内容
```

保存后刷新页面，内容区域会自动变宽。

## 实现原理

### 1. VitePress 的布局结构

VitePress 的页面布局是多层嵌套的：

```
.Layout (外层容器)
  └── .VPDoc (文档容器)
      └── .content-container (内容容器)
          └── .vp-doc (文档内容，默认 max-width: 688px)
```

### 2. pageClass 的作用

在 frontmatter 中设置 `pageClass: wide-page` 后，VitePress 会将这个类名添加到 `.Layout` 元素上：

```html
<div class="Layout wide-page">
  <!-- 页面内容 -->
</div>
```

### 3. CSS 实现

在 `docs/.vitepress/theme/custom.css` 中添加以下样式：

```css
/* 只让带 wide-page 类的页面变宽 */

/* 1. 设置全局布局最大宽度（核心） */
.Layout.wide-page {
  --vp-layout-max-width: 90vw; /* 使用屏幕宽度的 90%，左右各留 5% 空白 */
}

/* 2. 解除容器宽度限制（必需） */
.Layout.wide-page .VPDoc.has-aside .content-container {
  max-width: 100% !important;
}
```

::: tip 为什么只需要两个 CSS 规则？
VitePress 内部通过 CSS 变量 `--vp-layout-max-width` 控制多个层级的宽度，包括 `.vp-doc`。

当设置 `--vp-layout-max-width` 后，`.vp-doc` 会自动响应这个变量，无需单独设置。

只有在某些特殊情况下，才需要额外设置：
```css
.Layout.wide-page .vp-doc {
  max-width: 90vw !important; /* 作为保险，通常不需要 */
}
```
:::

## 宽度选项

根据需求选择不同的宽度设置：

### 选项 1：使用视口宽度百分比（推荐）

```css
.Layout.wide-page {
  --vp-layout-max-width: 90vw; /* 屏幕宽度的 90% */
}
```

**效果：** 左右各留 5% 空白，大屏幕上视觉效果更好

### 选项 2：完全移除限制

```css
.Layout.wide-page {
  --vp-layout-max-width: none;
}
```

**效果：** 内容会尽可能撑满可用空间

### 选项 3：固定最大宽度

```css
.Layout.wide-page {
  --vp-layout-max-width: 1400px;
}
```

**效果：** 在超大屏幕上不会过宽，保持可读性

### 选项 4：动态计算

```css
.Layout.wide-page {
  --vp-layout-max-width: calc(100vw - 100px); /* 屏幕宽度减去固定边距 */
}
```

**效果：** 灵活控制左右边距

## 响应式优化

为移动端添加特殊处理：

```css
/* 移动端保持默认宽度 */
@media (max-width: 768px) {
  .Layout.wide-page {
    --vp-layout-max-width: 100%;
  }
}
```

## 使用示例

### 示例 1：数据表格页面

```yaml
---
title: 数据统计
pageClass: wide-page
---

# 数据统计

<table>
  <!-- 宽表格内容 -->
</table>
```

### 示例 2：图表展示页面

```yaml
---
title: 体重记录
pageClass: wide-page
---

# 体重记录

<div class="chart-container">
  <!-- 图表组件 -->
</div>
```

## 常见问题

### 为什么设置后没有生效？

**可能原因：**

1. **CSS 文件未正确引入**
   
   检查 `docs/.vitepress/theme/index.js`：
   ```js
   import DefaultTheme from 'vitepress/theme'
   import './custom.css' // 确保引入了 custom.css
   
   export default DefaultTheme
   ```

2. **选择器不正确**
   
   确保使用 `.Layout.wide-page` 而不是 `.wide-page`

3. **缺少必要的 CSS 规则**
   
   必须同时设置 CSS 变量和容器宽度：
   ```css
   .Layout.wide-page {
     --vp-layout-max-width: 90vw;
   }
   
   .Layout.wide-page .VPDoc.has-aside .content-container {
     max-width: 100% !important;
   }
   ```

4. **浏览器缓存**
   
   清除缓存或强制刷新（Ctrl+Shift+R / Cmd+Shift+R）

### 需要设置 .vp-doc 的 max-width 吗？

**通常不需要！**

VitePress 内部通过 CSS 变量 `--vp-layout-max-width` 控制布局宽度，`.vp-doc` 会自动响应这个变量。

只有在极少数情况下（如遇到兼容性问题），才需要额外设置：
```css
.Layout.wide-page .vp-doc {
  max-width: none !important;
}
```

### 如何让所有页面都变宽？

如果想让所有页面都使用宽布局，直接在 `:root` 设置即可：

```css
:root {
  --vp-layout-max-width: 90vw;
}

.VPDoc.has-aside .content-container {
  max-width: 100% !important;
}
```

不需要使用 `pageClass`。

### 如何自定义其他页面类？

可以定义多个不同的页面类：

```css
/* 超宽布局 */
.Layout.extra-wide {
  --vp-layout-max-width: 95vw;
}

.Layout.extra-wide .VPDoc.has-aside .content-container {
  max-width: 100% !important;
}

/* 中等宽度 */
.Layout.medium-wide {
  --vp-layout-max-width: 1000px;
}

.Layout.medium-wide .VPDoc.has-aside .content-container {
  max-width: 100% !important;
}
```

使用时：
```yaml
pageClass: extra-wide
```

## 参考资源

- [VitePress 官方文档 - Frontmatter](https://vitepress.dev/reference/frontmatter-config)
- [VitePress 主题定制](https://vitepress.dev/guide/extending-default-theme)
