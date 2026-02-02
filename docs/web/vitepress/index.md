# VitePress

::: info
VitePress 是一个基于 Vite 的静态站点生成器，专为编写技术文档而设计。
:::

## 📚 文档导航

- [Markdown 扩展语法](./vitepress中的MarkDown.md) - VitePress 特有的 Markdown 功能
- [快速开始](#快速开始) - 常用命令和开发流程
- [常见问题](#常见问题) - 开发中遇到的问题和解决方案

## 🔗 官方资源

- [VitePress 官方文档](https://vitepress.dev/zh/)
- [GitHub 仓库](https://github.com/vuejs/vitepress)

## 快速开始

### 常用命令

更多 npm 命令详见 [npm 文档](/web/npm/)

```bash
# 开发模式 - 本地预览
npm run docs:dev

# 构建 - 生成静态文件
npm run docs:build

# 预览构建结果
npm run docs:preview
```

### 开发流程

1. 运行 `npm run docs:dev` 启动开发服务器
2. 编辑 markdown 文件，浏览器自动刷新
3. 构建前运行 `npm run docs:build` 检查错误
4. 部署 `docs/.vitepress/dist` 目录

## 常见问题

### 文件名大小写问题

::: warning 注意
Windows 下文件名不区分大小写，但 Linux 服务器区分大小写！
:::

**问题表现：**
- Windows 本地开发正常
- 部署到 Linux 服务器后出现 404

**解决方案：**
- 统一使用小写文件名和文件夹名
- 链接路径与实际文件名保持一致

### dev 正常但 build 报错

**为什么会这样？**

| 模式 | dev（开发） | build（构建） |
|------|------------|--------------|
| 链接检查 | ❌ 不检查 | ✅ 严格检查 |
| 加载方式 | 按需加载 | 预渲染所有页面 |
| 错误处理 | 宽松 | 严格，遇错即停 |

**配置选项：**

```js
// .vitepress/config.js
export default {
  ignoreDeadLinks: false  // 默认值，推荐保持
}
```

::: tip 建议
不要设置 `ignoreDeadLinks: true`，而是修复所有死链接，确保用户体验。
:::

**注意事项：**
- VitePress 只检查 Markdown 文件中的链接
- 配置文件（config.js）中的导航链接不会被检查
- 建议定期运行 `build` 命令验证链接有效性