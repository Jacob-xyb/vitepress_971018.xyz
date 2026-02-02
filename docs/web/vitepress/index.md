# Vitepress

[vitepress 官方网站](https://vitepress.dev/zh/)

# 快速调试

## 常用指令

[详情可见npm文档](/web/npm/)

常用指令分为三个：dev、build、preview

```bash
npm run docs:dev
```

# 常见问题

## 大小写问题

在windows下，vitepress对文件大小写不敏感，在linux下敏感，所以要保证文件名大小写一致，建议文件夹用小写命名

---

**为什么 `npm run docs:dev` 不报错，但 `npm run docs:build` 会报错？**

1. **dev 模式（开发模式）**
   - 不检查死链接
   - 只在你访问页面时才加载
   - 更宽松，为了开发体验
   - 即使链接错误，也能正常运行

2. **build 模式（构建模式）**
   - 会检查所有链接的有效性
   - 预渲染所有页面
   - 严格模式，确保生产环境没有问题
   - 发现死链接会直接报错并停止构建

**VitePress 的配置：**
```js
export default {
  ignoreDeadLinks: false  // 默认值，build 时检查死链接
}
```

如果你想在 build 时忽略死链接检查（不推荐），可以设置：
```js
export default {
  ignoreDeadLinks: true
}
```

但最好的做法是修复所有死链接，确保用户不会点到 404 页面。

>>> 注意：VitePress 的死链接检查只检查 Markdown 文件中的链接，不检查 配置文件（config.js）中的导航链接