---
outline: deep
---

# GitHub 使用指南

GitHub 是全球最大的代码托管平台和开发者社区，提供基于 Git 的版本控制、协作开发、项目管理等功能。

## 基础概念

### Repository（仓库）

仓库是项目的存储空间，包含所有文件、历史记录和版本信息。

- Public Repository：公开仓库，任何人都可以查看
- Private Repository：私有仓库，只有授权用户可以访问

### Fork

Fork 是将别人的仓库复制到自己账号下，可以自由修改而不影响原仓库。

### Pull Request（PR）

Pull Request 是向原仓库提交代码修改的请求，是开源协作的核心机制。

### Issue

Issue 用于追踪任务、功能需求、Bug 报告等，是项目管理的重要工具。

### Star & Watch

- Star：收藏项目，表示喜欢或关注
- Watch：订阅项目动态，接收更新通知

### Release（发布版本）

Release 是 GitHub 提供的版本发布功能，用于标记项目的重要里程碑版本。

- 基于 Git Tag 创建
- 可以附加发布说明（Release Notes）
- 可以上传编译好的二进制文件、安装包等
- 用户可以直接下载特定版本的文件

### Assets（发布资源）

Assets 是附加在 Release 中的文件资源，通常包括：

- 编译好的可执行文件（.exe、.app、.deb 等）
- 安装包（.msi、.dmg、.pkg 等）
- 压缩包（.zip、.tar.gz 等）
- 文档、配置文件等

用户可以直接从 Release 页面下载这些文件，无需克隆整个仓库或自行编译。

## 常用操作

### 创建仓库

1. 点击右上角 "+" 按钮，选择 "New repository"
2. 填写仓库名称和描述
3. 选择公开或私有
4. 可选择添加 README、.gitignore、License
5. 点击 "Create repository"

### 克隆仓库

```bash
# HTTPS 方式
git clone https://github.com/username/repository.git

# SSH 方式（需要配置 SSH Key）
git clone git@github.com:username/repository.git
```

### 提交代码

```bash
# 添加文件到暂存区
git add .

# 提交到本地仓库
git commit -m "提交说明"

# 推送到远程仓库
git push origin main
```

### 创建分支

```bash
# 创建并切换到新分支
git checkout -b feature-branch

# 推送分支到远程
git push origin feature-branch
```

### 提交 Pull Request

1. Fork 目标仓库到自己账号
2. Clone 到本地并创建新分支
3. 修改代码并提交
4. 推送到自己的远程仓库
5. 在 GitHub 上点击 "New pull request"
6. 填写 PR 说明，提交审核

### 创建 Release

详细的 Release 创建和管理指南，请查看 [GitHub Release 发布指南](./release.md)。

## SSH Key 配置

### 生成 SSH Key

```bash
# 生成新的 SSH Key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或使用 RSA（兼容性更好）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

### 添加到 GitHub

1. 复制公钥内容：
   ```bash
   # Windows
   cat ~/.ssh/id_ed25519.pub | clip
   
   # Linux/Mac
   cat ~/.ssh/id_ed25519.pub
   ```

2. 在 GitHub 设置中添加：
   - 进入 Settings → SSH and GPG keys
   - 点击 "New SSH key"
   - 粘贴公钥内容并保存

3. 测试连接：
   ```bash
   ssh -T git@github.com
   ```

## GitHub Actions

GitHub Actions 是 GitHub 提供的 CI/CD 自动化工具。

### 基本概念

- Workflow：工作流程，定义在 `.github/workflows/` 目录下的 YAML 文件
- Job：作业，一个 Workflow 可以包含多个 Job
- Step：步骤，每个 Job 包含多个 Step
- Action：可复用的操作单元

### 示例：自动化测试

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
```

## GitHub Pages

GitHub Pages 可以免费托管静态网站。

### 启用 Pages

1. 进入仓库 Settings → Pages
2. 选择分支和目录（通常是 main 分支的 /docs 或根目录）
3. 保存后等待部署完成
4. 访问 `https://username.github.io/repository/`

### 自定义域名

1. 在仓库根目录添加 `CNAME` 文件，内容为你的域名
2. 在域名 DNS 设置中添加 CNAME 记录指向 `username.github.io`

## 最佳实践

### README 编写

一个好的 README 应该包含：

- 项目简介和功能特性
- 安装和使用说明
- 示例代码
- 贡献指南
- 许可证信息

### Commit Message 规范

推荐使用约定式提交（Conventional Commits）：

```
<type>: <description>

[optional body]

[optional footer]
```

常用类型：
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 分支管理

常见的分支策略：

- `main/master`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支
- `release/*`: 发布分支

### .gitignore 配置

忽略不需要版本控制的文件：

```gitignore
# 依赖目录
node_modules/
vendor/

# 构建产物
dist/
build/
*.exe

# 环境配置
.env
.env.local

# IDE 配置
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db
```

## 常见问题

### 如何撤销提交？

```bash
# 撤销最后一次提交，保留修改
git reset --soft HEAD~1

# 撤销最后一次提交，丢弃修改
git reset --hard HEAD~1

# 修改最后一次提交信息
git commit --amend -m "新的提交信息"
```

### 如何解决冲突？

1. 拉取最新代码：`git pull`
2. 手动编辑冲突文件，解决冲突标记
3. 添加解决后的文件：`git add .`
4. 提交：`git commit -m "解决冲突"`

### 如何同步 Fork 的仓库？

```bash
# 添加上游仓库
git remote add upstream https://github.com/original/repository.git

# 拉取上游更新
git fetch upstream

# 合并到本地分支
git merge upstream/main

# 推送到自己的远程仓库
git push origin main
```

## 学习资源

- [GitHub 官方文档](https://docs.github.com/)
- [GitHub Skills](https://skills.github.com/) - 交互式学习课程
- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 书籍](https://git-scm.com/book/zh/v2) - 免费在线阅读

## 相关链接

- [GitHub](https://github.com)
- [GitHub Desktop](https://desktop.github.com/) - 图形化客户端
- [GitHub CLI](https://cli.github.com/) - 命令行工具
