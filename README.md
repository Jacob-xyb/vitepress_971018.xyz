# API 文档网站

专业的API文档网站，基于 VitePress 构建。

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run docs:dev
```

访问 http://localhost:5173 查看文档。

### 构建生产版本

```bash
npm run docs:build
```

### 预览生产版本

```bash
npm run docs:preview
```

## 项目结构

```
.
├── docs/
│   ├── .vitepress/
│   │   └── config.js          # VitePress 配置
│   ├── api/                   # API 参考文档
│   │   ├── index.md
│   │   ├── authentication.md
│   │   ├── users.md
│   │   ├── data.md
│   │   └── errors.md
│   ├── guide/                 # 使用指南
│   │   ├── introduction.md
│   │   └── getting-started.md
│   ├── examples/              # 代码示例
│   │   └── index.md
│   └── index.md               # 首页
└── package.json
```

## 功能特性

- ✅ 清晰的导航结构
- ✅ API 端点详细说明
- ✅ 多语言代码示例
- ✅ 内置搜索功能
- ✅ 响应式设计
- ✅ 深色模式支持
- ✅ 页面间相互跳转

## 自定义

### 修改配置

编辑 `docs/.vitepress/config.js` 来自定义：
- 网站标题和描述
- 导航菜单
- 侧边栏结构
- 主题颜色

### 添加新页面

1. 在 `docs/` 目录下创建新的 `.md` 文件
2. 在 `config.js` 中添加导航或侧边栏链接

## 部署

详细的部署教程请查看：[部署指南](docs/my-docs/deployment)

支持的平台：
- GitHub Pages（免费）
- Vercel（免费，推荐）
- Netlify（免费）
- 自己的服务器

已包含配置文件：
- `.github/workflows/deploy.yml` - GitHub Pages 自动部署
- `netlify.toml` - Netlify 配置
- `vercel.json` - Vercel 配置

## 技术栈

- VitePress - 静态站点生成器
- Vue 3 - 组件框架
- Markdown - 内容编写

## 许可证

MIT
