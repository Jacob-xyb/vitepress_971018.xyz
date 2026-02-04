---

---

# VitePress 代码块美化

::: tip 效果预览
Mac 风格代码块 + 霓虹灯边框动画：
- **Mac 三色圆点**：左上角红黄绿圆点，模拟 macOS 窗口
- **语言标签**：右上角显示代码语言
- **霓虹灯边框**：悬浮时显示蓝绿紫色调的顺时针流动边框
- **深邃配色**：低饱和度的蓝绿色系，带有紫色点缀
:::

## 快速使用

### 1. 在 markdown.css 中添加代码

在 `docs/.vitepress/theme/markdown.css` 文件末尾添加以下代码：

```css
/* ========== Mac 风格代码块 ========== */

/* 代码块容器基础样式 */
.vp-doc div[class*='language-'] {
  position: relative;
  margin: 16px 0;
  border-radius: 8px;
  border: 2px solid transparent;
  /* 使用 background-clip 实现边框渐变效果 */
  background-origin: border-box;
  background-clip: padding-box, border-box;
  transition: all 0.3s ease;
}

/* Mac 窗口三色圆点（红黄绿） */
.vp-doc div[class*='language-']::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff5f56; /* 红色 - 关闭 */
  box-shadow: 
    18px 0 0 #ffbd2e, /* 黄色 - 最小化 */
    36px 0 0 #27c93f; /* 绿色 - 最大化 */
  z-index: 1;
}

/* 右上角语言标签 */
.vp-doc div[class*='language-'] .lang {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  transition: color 0.3s ease;
  z-index: 1;
}

.vp-doc div[class*='language-']:hover .lang {
  color: #aaa;
}

/* 悬浮时的霓虹灯边框 - 蓝绿紫色调顺时针流动 */
.vp-doc div[class*='language-']:hover {
  background-image: 
    /* 第一层：保持代码块背景色 */
    linear-gradient(var(--vp-code-block-bg), var(--vp-code-block-bg)),
    /* 第二层：圆锥渐变实现顺时针旋转的彩色边框 */
    conic-gradient(
      from var(--angle),
      #0369a1 0%,    /* 深蓝 */
      #0891b2 12%,   /* 深青 */
      #5b21b6 18%,   /* 蓝紫（点缀） */
      #0f766e 24%,   /* 深青绿 */
      #047857 36%,   /* 深翠绿 */
      #0f766e 48%,   /* 深青绿 */
      #0891b2 60%,   /* 深青 */
      #6366f1 66%,   /* 靛蓝（点缀） */
      #0369a1 72%,   /* 深蓝 */
      #0369a1 100%   /* 深蓝 */
    );
  animation: neon-rotate 5s linear infinite;
}

/* 霓虹灯旋转动画 - 通过改变角度实现顺时针流动 */
@keyframes neon-rotate {
  0% {
    --angle: 0deg;
  }
  100% {
    --angle: 360deg;
  }
}

/* CSS Houdini 自定义属性 - 让角度可以动画 */
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

/* 代码块内容样式 */
.vp-doc div[class*='language-'] pre {
  padding: 40px 20px 20px 20px !important; /* 顶部留空给圆点和标签 */
  margin: 0;
  background-color: transparent !important;
}

.vp-doc div[class*='language-'] code {
  background-color: transparent !important;
  font-size: 14px;
  line-height: 1.6;
}
```

### 2. 保存并刷新

保存文件后刷新浏览器，悬浮到代码块上即可看到效果。

## 实现原理

### 1. Mac 三色圆点

使用 `::before` 伪元素 + `box-shadow` 创建三个圆点：

```css
.vp-doc div[class*='language-']::before {
  background-color: #ff5f56;  /* 第一个圆点（红色） */
  box-shadow: 
    18px 0 0 #ffbd2e,  /* 第二个圆点（黄色），向右偏移 18px */
    36px 0 0 #27c93f;  /* 第三个圆点（绿色），向右偏移 36px */
}
```

**为什么用 box-shadow？**
- 只需要一个伪元素就能创建三个圆点
- 性能更好，不需要额外的 DOM 元素

### 2. 霓虹灯边框动画

#### 核心技术：background-clip

使用双层背景 + `background-clip` 实现边框渐变：

```css
border: 2px solid transparent;
background-origin: border-box;
background-clip: padding-box, border-box;
background-image: 
  linear-gradient(...),  /* 第一层：内容背景 */
  conic-gradient(...);   /* 第二层：边框渐变 */
```

**工作原理：**
1. 设置透明边框占位
2. 第一层背景裁剪到 padding-box（内容区）
3. 第二层背景裁剪到 border-box（包含边框）
4. 两层背景叠加，形成渐变边框效果

#### 圆锥渐变 (conic-gradient)

使用 `conic-gradient` 创建圆形渐变：

```css
conic-gradient(
  from var(--angle),  /* 起始角度，通过动画改变 */
  #0369a1 0%,         /* 0° 位置的颜色 */
  #0891b2 12%,        /* 43.2° 位置的颜色 */
  /* ... */
)
```

**为什么用圆锥渐变？**
- 颜色沿圆周分布，适合创建旋转效果
- 通过改变起始角度 `--angle`，实现顺时针流动

#### CSS Houdini 自定义属性

使用 `@property` 让自定义属性支持动画：

```css
@property --angle {
  syntax: '<angle>';      /* 定义类型为角度 */
  initial-value: 0deg;    /* 初始值 */
  inherits: false;        /* 不继承 */
}
```

**为什么需要 @property？**
- 普通 CSS 变量不能直接动画
- `@property` 让浏览器知道如何插值计算角度值
- 实现平滑的旋转动画

### 3. 配色设计

#### 主色调：蓝绿色系

```css
#0369a1  /* 深蓝 */
#0891b2  /* 深青 */
#0f766e  /* 深青绿 */
#047857  /* 深翠绿 */
```

这些颜色来自 Tailwind CSS 的 700-800 色阶，饱和度适中，不会太亮眼。

#### 紫色点缀

```css
#5b21b6 18%   /* 蓝紫，占比 6% */
#6366f1 66%   /* 靛蓝，占比 6% */
```

紫色只在两个位置短暂出现，增加神秘感但不突兀。

## 自定义配置

### 调整圆点大小

修改圆点尺寸和间距：

```css
.vp-doc div[class*='language-']::before {
  width: 12px;   /* 更大的圆点 */
  height: 12px;
  box-shadow: 
    20px 0 0 #ffbd2e,  /* 调整间距 */
    40px 0 0 #27c93f;
}
```

### 调整边框粗细

修改 `border` 宽度：

```css
.vp-doc div[class*='language-'] {
  border: 3px solid transparent;  /* 更粗的边框 */
}
```

### 调整动画速度

修改 `animation` 的时间参数：

```css
.vp-doc div[class*='language-']:hover {
  animation: neon-rotate 3s linear infinite;  /* 更快，3 秒一圈 */
}
```

### 更改配色方案

#### 方案 1：赛博朋克风格

```css
conic-gradient(
  from var(--angle),
  #ff00ff 0%,   /* 洋红 */
  #00ffff 20%,  /* 青色 */
  #ff0080 40%,  /* 玫红 */
  #00ff00 60%,  /* 霓虹绿 */
  #0080ff 80%,  /* 电蓝 */
  #ff00ff 100%  /* 洋红 */
)
```

#### 方案 2：暖色调

```css
conic-gradient(
  from var(--angle),
  #dc2626 0%,   /* 红 */
  #ea580c 25%,  /* 橙 */
  #ca8a04 50%,  /* 黄 */
  #ea580c 75%,  /* 橙 */
  #dc2626 100%  /* 红 */
)
```

#### 方案 3：单色渐变

```css
conic-gradient(
  from var(--angle),
  #3b82f6 0%,
  #60a5fa 50%,
  #3b82f6 100%
)
```

### 禁用霓虹灯效果

如果只想要 Mac 圆点，删除 `:hover` 相关的样式即可：

```css
/* 删除这部分 */
.vp-doc div[class*='language-']:hover {
  /* ... */
}

@keyframes neon-rotate {
  /* ... */
}

@property --angle {
  /* ... */
}
```

## 常见问题

### 为什么霓虹灯边框没有显示？

**可能原因：**

1. **浏览器不支持 @property**
   
   `@property` 是较新的特性，检查浏览器兼容性：
   - Chrome 85+
   - Edge 85+
   - Safari 15.4+
   - Firefox 尚不支持（截至 2024）

2. **CSS 变量未定义**
   
   确保 VitePress 定义了 `--vp-code-block-bg` 变量

3. **选择器不匹配**
   
   检查代码块的 class 是否包含 `language-`

### 为什么出现滚动条？

如果使用了 `::after` 伪元素且设置了 `inset: -2px`，会导致滚动条。

**解决方案：** 使用 `background-clip` 方案（本文档推荐的方案）。

### 圆点位置不对怎么办？

调整 `top` 和 `left` 值：

```css
.vp-doc div[class*='language-']::before {
  top: 15px;   /* 向下移动 */
  left: 15px;  /* 向右移动 */
}
```

### 如何让边框一直显示？

删除 `:hover` 伪类，直接应用到基础样式：

```css
.vp-doc div[class*='language-'] {
  background-image: 
    linear-gradient(var(--vp-code-block-bg), var(--vp-code-block-bg)),
    conic-gradient(...);
  animation: neon-rotate 5s linear infinite;
}
```

### 暗色模式下效果不好？

当前配色已经考虑了暗色模式，使用低饱和度颜色。如果还需要调整，可以添加：

```css
.dark .vp-doc div[class*='language-']:hover {
  background-image: 
    linear-gradient(var(--vp-code-block-bg), var(--vp-code-block-bg)),
    conic-gradient(
      from var(--angle),
      /* 使用更暗的颜色 */
      #1e3a8a 0%,
      #155e75 25%,
      /* ... */
    );
}
```

## 性能优化

### 1. 减少动画元素

只在悬浮时启动动画，避免页面加载时就运行：

```css
/* ✅ 推荐：只在悬浮时动画 */
.vp-doc div[class*='language-']:hover {
  animation: neon-rotate 5s linear infinite;
}

/* ❌ 不推荐：一直动画 */
.vp-doc div[class*='language-'] {
  animation: neon-rotate 5s linear infinite;
}
```

### 2. 使用 will-change

提示浏览器优化动画性能：

```css
.vp-doc div[class*='language-']:hover {
  will-change: background-position;
  animation: neon-rotate 5s linear infinite;
}
```

### 3. 降低动画复杂度

如果页面有很多代码块，考虑简化动画：

```css
/* 使用更少的颜色 */
conic-gradient(
  from var(--angle),
  #0369a1 0%,
  #047857 50%,
  #0369a1 100%
)
```

## 注意事项

::: warning 重要提示
1. **浏览器兼容性**：`@property` 在 Firefox 中不支持，考虑提供降级方案
2. **性能影响**：大量代码块同时动画可能影响性能，建议只在悬浮时启动
3. **颜色对比度**：确保边框颜色与背景有足够对比度，在暗色模式下也清晰可见
4. **不要修改 VitePress 原生样式**：只添加新样式，不要覆盖 VitePress 的默认代码高亮
5. **测试多种语言**：确保不同编程语言的代码块都能正常显示
:::

## 浏览器兼容性

| 特性 | Chrome | Edge | Safari | Firefox |
|------|--------|------|--------|---------|
| `conic-gradient` | 69+ | 79+ | 12.1+ | 83+ |
| `@property` | 85+ | 85+ | 15.4+ | ❌ |
| `background-clip` | 1+ | 12+ | 3+ | 1+ |

**Firefox 降级方案：**

```css
/* Firefox 不支持 @property，使用静态渐变 */
@supports not (background: conic-gradient(from 0deg, red, blue)) {
  .vp-doc div[class*='language-']:hover {
    border: 2px solid var(--vp-c-brand-1);
  }
}
```

## 参考资源

- [CSS Houdini @property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [conic-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/conic-gradient)
- [background-clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip)
- [VitePress 代码块](https://vitepress.dev/guide/markdown#syntax-highlighting-in-code-blocks)
