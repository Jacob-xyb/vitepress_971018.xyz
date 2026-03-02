---
---
# VitePress

::: info
VitePress 是一个基于 Vite 的静态站点生成器，专为编写技术文档而设计。
:::

## 📚 文档导航

- [快速开始](#快速开始) - 常用命令和开发流程
- [Markdown 扩展语法](./vitepress中的MarkDown) - VitePress 特有的 Markdown 功能
- [UI 美化](#🎨-ui-美化) - 页面布局和样式优化
- [常见问题](#💡-常见问题) - 开发中遇到的问题和解决方案

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

## 💡 常见问题

- [文件相关问题](./issue/file-issues) - 大小写、路径、404 等
- [样式相关问题](./issue/style-issues) - 自定义样式、深色模式等
- [构建相关问题](./issue/build-errors) - dev vs build、死链接等

## 🎨 UI 美化

- [宽布局配置](./ui-宽布局) - 让页面充分利用屏幕空间
- [大纲隐藏](./ui-大纲隐藏) - 移除右侧大纲占位空间

### 主题收集

- [teek](https://vp.teek.top/)
