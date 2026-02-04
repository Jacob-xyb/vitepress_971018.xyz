---
outline: [2, 4]
pageClass: wide-page
---

# VitePress 标题美化

::: tip 效果预览
基于 Phycat 主题设计，为 Markdown 标题添加优雅的视觉效果：
- **H1**：居中显示 + 底部渐变线，悬浮时线条延展
- **H2**：渐变背景 + 圆角，悬浮时背景流动
- **H3**：左侧色块装饰，悬浮时色块变大
- **H4**：实心圆点，悬浮时放大并有光晕
- **H5**：空心圆点，悬浮时填充颜色
- **H6**：横线装饰，悬浮时横线拉长
:::

## 快速使用

### 1. 创建样式文件

在 `docs/.vitepress/theme/` 目录下创建 `markdown.css` 文件。

### 2. 引入样式文件

编辑 `docs/.vitepress/theme/index.js`：

```js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './markdown.css'  // 添加这行
import ThemeIcon from './components/ThemeIcon.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ThemeIcon', ThemeIcon)
  }
}
```

### 3. 添加样式代码

将以下代码复制到 `markdown.css` 中：

```css
/**
 * Markdown 样式主题 - 基于 Phycat 设计
 * 参考：https://github.com/sumruler/typora-theme-phycat
 */

/* ========== H1 标题 - 居中 + 底部渐变线 ========== */
.vp-doc h1 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 1em auto 0.8em;
  line-height: 1.4;
  width: fit-content;
  min-width: 120px;
  color: #222;
  position: relative;
  padding-bottom: 12px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.vp-doc h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 40px;
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transform: translateX(-50%);
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.vp-doc h1:hover {
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.vp-doc h1:hover::after {
  width: 100%;
}

/* ========== H2 标题 - 渐变背景 + 圆角 ========== */
.vp-doc h2 {
  color: #fff;
  font-size: 1.4rem;
  line-height: 1.5;
  width: fit-content;
  font-weight: 700;
  margin: 20px 0;
  padding: 5px 12px;
  border-radius: 8px;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  background-size: 200% auto;
  background-position: 0 center;
  box-shadow: 0 2px 5px rgba(61, 184, 211, 0.15);
  transition: background-position 0.5s ease-out, transform 0.4s ease, box-shadow 0.4s ease;
}

.vp-doc h2:hover {
  background-position: 100% center;
  transform: scale(1.01);
  box-shadow: 0 8px 20px rgba(61, 184, 211, 0.35);
}

/* ========== H3 标题 - 左侧色块 ========== */
.vp-doc h3 {
  position: relative;
  width: fit-content;
  margin: 20px 0;
  font-size: 1.3rem;
  padding-left: 10px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.vp-doc h3::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 61%;
  border-radius: 4px;
  background-color: var(--vp-c-brand-1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.vp-doc h3:hover {
  padding-left: 18px;
  color: var(--vp-c-brand-1);
}

.vp-doc h3:hover::before {
  height: 66%;
  width: 7px;
}

/* ========== H4 标题 - 圆点装饰 ========== */
.vp-doc h4 {
  margin: 20px 0;
  font-size: 1.15rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.vp-doc h4::before {
  content: "";
  margin-right: 7px;
  display: inline-block;
  background-color: var(--vp-c-brand-1);
  width: 6px;
  height: 6px;
  border-radius: 100%;
  border: var(--vp-c-brand-1) 1px solid;
  vertical-align: middle;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vp-doc h4:hover::before {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(var(--vp-c-brand-rgb), 0.1);
}

.vp-doc h4:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(6px);
}

/* ========== H5 标题 - 空心圆点 ========== */
.vp-doc h5 {
  margin: 23px 0;
  font-size: 1.1rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.vp-doc h5::before {
  content: "";
  margin-right: 7px;
  display: inline-block;
  background-color: #fff;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  border: var(--vp-c-brand-1) 2px solid;
  vertical-align: inherit;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vp-doc h5:hover::before {
  background-color: var(--vp-c-brand-1);
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(var(--vp-c-brand-rgb), 0.1);
}

.vp-doc h5:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(6px);
}

/* ========== H6 标题 - 横线装饰 ========== */
.vp-doc h6 {
  margin: 23px 0;
  font-size: 1.1rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.vp-doc h6::before {
  content: "-";
  color: var(--vp-c-brand-1);
  margin-right: 7px;
  display: inline-block;
  vertical-align: inherit;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vp-doc h6:hover::before {
  transform: scaleX(1.8) translateX(1px);
  font-weight: 700;
}

.vp-doc h6:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(6px);
}

/* ========== 暗色模式适配 ========== */
.dark .vp-doc h1 {
  color: #e0e0e0;
}

.dark .vp-doc h2 {
  color: #e0e0e0;
  background: linear-gradient(120deg, rgba(100, 108, 255, 0.4), rgba(65, 209, 255, 0.4));
  box-shadow: 0 2px 5px rgba(100, 108, 255, 0.1);
}

.dark .vp-doc h2:hover {
  box-shadow: 0 8px 20px rgba(100, 108, 255, 0.2);
}

/* ========== 标题间距优化 ========== */
.vp-doc h2 + h3,
.vp-doc h3 + h4 {
  margin-top: 1rem;
}
```

## 实现原理

### 1. CSS 伪元素装饰

使用 `::before` 和 `::after` 伪元素为标题添加装饰：

- **H1** 使用 `::after` 创建底部渐变线
- **H3** 使用 `::before` 创建左侧色块
- **H4/H5** 使用 `::before` 创建圆点
- **H6** 使用 `::before` 创建横线

### 2. CSS 变量适配主题

使用 VitePress 的 CSS 变量确保样式跟随主题色：

```css
background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
```

这样当你更改 VitePress 主题色时，标题样式会自动适配。

### 3. 流畅的动画效果

使用 `cubic-bezier` 缓动函数创建流畅的动画：

```css
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
```

### 4. 暗色模式处理

为暗色模式单独设置样式，降低亮度避免刺眼：

```css
.dark .vp-doc h2 {
  background: linear-gradient(120deg, rgba(100, 108, 255, 0.4), rgba(65, 209, 255, 0.4));
}
```

## 自定义配置

### 调整颜色

如果想使用自定义颜色而不是主题色，可以直接指定：

```css
.vp-doc h2 {
  background: linear-gradient(120deg, #ff6b6b, #4ecdc4);
}
```

### 调整尺寸

修改标题大小和间距：

```css
.vp-doc h2 {
  font-size: 1.6rem;  /* 更大的字号 */
  padding: 8px 16px;  /* 更大的内边距 */
}
```

### 调整动画速度

修改 `transition` 的时间参数：

```css
.vp-doc h1::after {
  transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);  /* 更慢的动画 */
}
```

### 禁用某个标题的样式

如果不想要某个级别的标题样式，直接删除对应的 CSS 规则即可。

## 常见问题

### 为什么标题样式没有生效？

**可能原因：**

1. **CSS 文件未正确引入**
   
   检查 `docs/.vitepress/theme/index.js` 是否引入了 `markdown.css`

2. **选择器优先级不够**
   
   VitePress 可能有其他样式覆盖，尝试添加 `!important`：
   ```css
   .vp-doc h2 {
     background: linear-gradient(...) !important;
   }
   ```

3. **浏览器缓存**
   
   清除缓存或强制刷新（Ctrl+Shift+R / Cmd+Shift+R）

### H2 标题的渐变色影响了 emoji

这是 `background-clip: text` 的已知问题。解决方案：

1. 不在 H2 标题中使用 emoji
2. 或者用 span 包裹 emoji：
   ```markdown
   ## <span style="color: initial">🎮</span> 标题文字
   ```

### 如何让 H1 不居中？

删除 `text-align: center` 即可：

```css
.vp-doc h1 {
  /* text-align: center; 删除这行 */
  font-size: 1.8rem;
  /* ... */
}
```

### 暗色模式下 H2 太亮怎么办？

已经在代码中处理了，使用半透明背景：

```css
.dark .vp-doc h2 {
  background: linear-gradient(120deg, rgba(100, 108, 255, 0.4), rgba(65, 209, 255, 0.4));
}
```

如果还是太亮，可以降低透明度（0.4 改为 0.3）。

## 注意事项

::: warning 重要提示
1. **不要修改 H1 的原生样式**：VitePress 的页面标题依赖 H1，过度修改可能影响布局
2. **注意性能**：过多的动画和阴影可能影响性能，建议只在必要的标题上使用
3. **保持一致性**：确保所有标题的动画速度和缓动函数一致，避免视觉混乱
4. **测试暗色模式**：修改样式后务必测试暗色模式下的效果
5. **备份原文件**：修改前建议备份 `markdown.css`，方便回滚
:::

## 参考资源

- [Phycat 主题](https://github.com/sumruler/typora-theme-phycat) - 原始设计灵感
- [VitePress 主题定制](https://vitepress.dev/guide/extending-default-theme)
- [CSS 伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)
