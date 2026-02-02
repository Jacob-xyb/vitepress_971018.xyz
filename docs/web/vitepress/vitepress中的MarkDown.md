# vitepress 中的 MarkDown

 [官方文档](https://vitepress.dev/zh/guide/markdown)

VitePress 的 Markdown 文件非常强大，扩展了很多语法。支持：

## 1. **直接写 HTML**
```markdown
<div class="custom-box">
  <h3>标题</h3>
  <p>内容</p>
</div>
```

## 2. **使用 Vue 组件**
```markdown
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<MyComponent />
```

## 3. **在 Markdown 中使用 Vue 语法**
```markdown
<script setup>
const count = ref(0)
</script>

当前计数：{{ count }}
<button @click="count++">点击</button>
```

## 4. **内联样式**
```markdown
<style scoped>
.my-class {
  color: red;
}
</style>
```

VitePress 会把 Markdown 文件编译成 Vue 组件，所以你可以：
- ✅ 混合使用 Markdown 和 HTML
- ✅ 导入和使用 Vue 组件
- ✅ 使用 Vue 的响应式特性
- ✅ 添加交互功能
- ✅ 自定义样式

这也是 VitePress 比传统静态网站生成器更灵活的原因之一。你基本上可以把每个 `.md` 文件当作一个 Vue 单文件组件来用。

## 强大的功能导致的问题

好问题！确实有这个风险。如果你在写笔记时需要展示 HTML 或 Vue 代码示例，有几种方法避免被解析：

## 1. **使用代码块（最常用）**
````markdown
```html
<div>这不会被解析成真的 HTML</div>
```

```vue
<script setup>
// 这只是代码示例，不会执行
</script>
```
````

## 2. **使用反引号转义**
```markdown
这是内联代码：`<div>不会被解析</div>`
```

## 3. **使用 v-pre 指令**
```markdown
<div v-pre>
  {{ 这些 Vue 语法不会被解析 }}
  <MyComponent /> 也不会被当作组件
</div>
```

## 4. **转义特殊字符**
```markdown
&lt;div>内容</div&gt;
```

## 实际使用建议：

**写笔记时：**
- 代码示例 → 用代码块 ` ```html ` 或 ` ```vue `
- 讲解语法 → 用反引号 `` `<tag>` ``
- 普通文字 → 正常写，Markdown 很智能

**需要实际渲染时：**
- 自定义样式 → 直接写 HTML + `<style>`
- 交互功能 → 用 `<script setup>` + Vue 组件

VitePress 的 Markdown 解析器其实挺智能的，只有在特定情况下才会把内容当作 HTML/Vue：
- 完整的 HTML 标签结构
- `<script setup>` 或 `<style>` 标签
- 明确的 Vue 组件调用

一般写笔记不会误触发，除非你真的写了完整的 HTML 标签。如果担心，就统一用代码块包起来，既安全又有语法高亮。
