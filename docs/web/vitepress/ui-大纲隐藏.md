# VitePress 大纲隐藏配置

::: tip 适用场景
当页面内容较少或不需要显示大纲时，可以隐藏右侧大纲。但 VitePress 默认会保留大纲容器的占位空间，导致右侧留白。本文介绍如何完全移除这个占位空间。
:::

## 问题描述

### 默认行为

在 Markdown 文件的 frontmatter 中设置 `outline: false`：

```yaml
---
title: 页面标题
outline: false
---
```

**效果：**
- ✅ 大纲内容被隐藏
- ❌ 右侧仍有空白占位区域

### 原因分析

VitePress 的大纲结构：

```html
<div class="aside">
  <nav class="VPDocAsideOutline">
    <ul class="VPDocOutlineItem root">
      <!-- 大纲项目 -->
    </ul>
  </nav>
</div>
```

当设置 `outline: false` 时：
- 大纲列表 `.VPDocOutlineItem.root` 变为空
- 但容器 `.aside` 仍然存在并占据空间

## 解决方案

### 方案 1：检测空大纲自动隐藏（推荐）

使用 CSS `:has()` 伪类选择器，当大纲为空时自动隐藏容器。

在 `docs/.vitepress/theme/custom.css` 中添加：

```css
/* 当大纲为空时隐藏 aside 容器 */
.aside:has(.VPDocOutlineItem.root:empty) {
  display: none !important;
}
```

**优点：**
- ✅ 自动检测，无需额外配置
- ✅ 只影响设置了 `outline: false` 的页面
- ✅ 其他页面正常显示大纲

**兼容性：**
- 需要支持 CSS `:has()` 的浏览器
- Chrome 105+, Firefox 121+, Safari 15.4+

### 方案 2：全局隐藏大纲

如果所有页面都不需要大纲：

```css
/* 全局隐藏大纲 */
.aside {
  display: none !important;
}
```

**优点：**
- ✅ 简单直接
- ✅ 兼容性好

**缺点：**
- ❌ 所有页面的大纲都会被隐藏

### 方案 3：使用 pageClass 控制

结合 `pageClass` 实现更灵活的控制：

```css
/* 只隐藏特定页面的大纲 */
.Layout.no-outline .aside {
  display: none !important;
}
```

使用时：
```yaml
---
title: 页面标题
pageClass: no-outline
outline: false
---
```

**优点：**
- ✅ 精确控制
- ✅ 兼容性好

**缺点：**
- ❌ 需要同时设置 `pageClass` 和 `outline`

## 完整示例

### 示例 1：自动隐藏（推荐）

**CSS 配置：**
```css
/* docs/.vitepress/theme/custom.css */
.aside:has(.VPDocOutlineItem.root:empty) {
  display: none !important;
}
```

**页面配置：**
```yaml
---
title: 体重记录
outline: false
---

# 体重记录

页面内容...
```

**效果：** 右侧完全没有空白，内容充分利用空间

### 示例 2：结合宽布局

同时使用宽布局和隐藏大纲：

```yaml
---
title: 数据展示
pageClass: wide-page
outline: false
---
```

**CSS 配置：**
```css
/* 宽布局 */
.Layout.wide-page {
  --vp-layout-max-width: 90vw;
}

.Layout.wide-page .VPDoc.has-aside .content-container {
  max-width: 100% !important;
}

/* 隐藏空大纲 */
.aside:has(.VPDocOutlineItem.root:empty) {
  display: none !important;
}
```

**效果：** 页面变宽 + 右侧无空白 = 最大化内容展示区域

## 常见问题

### `:has()` 选择器不生效？

**原因：** 浏览器版本过低，不支持 `:has()` 伪类。

**解决方案：**

1. **升级浏览器**（推荐）
   - Chrome 105+
   - Firefox 121+
   - Safari 15.4+

2. **使用方案 3**（pageClass 方式）
   ```css
   .Layout.no-outline .aside {
     display: none !important;
   }
   ```

### 如何只在移动端隐藏大纲？

```css
@media (max-width: 768px) {
  .aside {
    display: none !important;
  }
}
```

### 如何调整大纲宽度？

如果不想隐藏，只是想调整宽度：

```css
.aside {
  width: 200px !important; /* 默认是 256px */
}
```

### 大纲隐藏后内容还是没有变宽？

需要同时配置宽布局，参考 [宽布局配置](./ui-宽布局)。

## 浏览器兼容性

| 浏览器 | `:has()` 支持版本 |
|--------|------------------|
| Chrome | 105+ (2022年8月) |
| Edge | 105+ (2022年8月) |
| Firefox | 121+ (2023年12月) |
| Safari | 15.4+ (2022年3月) |

::: tip 建议
推荐使用方案 1（`:has()` 选择器），它能自动检测并只影响需要隐藏的页面，是最优雅的解决方案。
:::

## 参考资源

- [VitePress 官方文档 - Frontmatter](https://vitepress.dev/reference/frontmatter-config#outline)
- [MDN - :has() 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:has)
- [宽布局配置](./ui-宽布局)
