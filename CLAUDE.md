# CLAUDE.md - 项目指南

## 文档编写规范

### 1. 标题层级
- VitePress 文档的主要内容从 **二级标题** 开始
- 一级标题与文件名大体一致，用于页面标题

### 2. 新增文档检查清单
- 检查并更新侧边栏配置（`docs/.vitepress/sidebar/`）
- 检查主页 index 的导航卡片（`docs/xxx/links.js` 或对应 index.md 中的 NavCards）
- 补充文档概括/导航链接

### 3. VitePress 代码块语法
- 使用 VitePress 特定语法：`::: code-group` 包裹可切换代码块
- 代码块标题格式：`` ```bash [标题] ``
- 容器提示：`` ::: tip ``、`` ::: warning `` 等

### 4.润色
- 润色文档时主要是补充一些内容和整理现有逻辑
- 润色时可以添加一些unicode emoji 来提高文档的可读性
