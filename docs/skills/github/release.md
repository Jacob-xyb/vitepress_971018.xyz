# GitHub Release 发布指南

Release 是 GitHub 提供的版本发布功能，用于标记项目的重要里程碑版本，并分发编译好的文件给用户。

## 什么是 Release

Release 基于 Git Tag 创建，主要用途：

- 标记项目的正式版本（如 v1.0.0、v2.0.0）
- 提供版本更新说明（Release Notes）
- 分发编译好的二进制文件、安装包等
- 让用户无需克隆仓库或自行编译即可使用

## 什么是 Assets

Assets 是附加在 Release 中的文件资源，通常包括：

- 编译好的可执行文件（.exe、.app、.deb 等）
- 安装包（.msi、.dmg、.pkg 等）
- 压缩包（.zip、.tar.gz 等）
- 文档、配置文件等

GitHub 还会自动生成两个源码压缩包：
- Source code (zip)
- Source code (tar.gz)

## 创建 Release

### 方法 1：通过 GitHub 网页创建

这是最常用的方法，适合大多数场景。

#### 步骤

1. 进入仓库页面，点击右侧 "Releases"（或直接访问 `https://github.com/用户名/仓库名/releases`）

2. 点击 "Create a new release" 或 "Draft a new release"

3. 填写版本信息：

   **Tag version（标签版本）**
   - 输入版本号，如 `v1.0.0`
   - 如果 Tag 不存在，会自动创建
   - 可以选择基于哪个分支创建（默认是主分支）

   **Release title（版本标题）**
   - 版本的显示名称，如 "Version 1.0.0" 或 "首个正式版本"
   - 可以使用中文或英文

   **Description（版本说明）**
   - 详细的更新内容
   - 支持 Markdown 格式
   - 建议包含：新功能、Bug 修复、破坏性变更、升级说明等

4. 上传 Assets 文件：

   - 点击 "Attach binaries by dropping them here or selecting them" 区域
   - 选择要上传的文件（可以多选）
   - 支持拖拽上传
   - 单个文件最大 2GB

5. 选择发布选项：

   - ✅ **Set as the latest release**：标记为最新版本（推荐）
   - ⚠️ **Set as a pre-release**：标记为预发布版本（测试版、Beta 版）
   - 📝 **Create a discussion for this release**：为此版本创建讨论话题

6. 点击 "Publish release" 发布

   或点击 "Save draft" 保存为草稿，稍后再发布

#### 示例：Release 说明模板

```markdown
## 🎉 新功能

- 添加了深色模式支持
- 新增用户设置页面
- 支持导出数据为 CSV 格式

## 🐛 Bug 修复

- 修复了登录页面在移动端显示异常的问题
- 解决了数据加载时的内存泄漏
- 修复了文件上传失败的问题

## 💥 破坏性变更

- API 接口 `/api/v1/users` 已废弃，请使用 `/api/v2/users`
- 配置文件格式从 JSON 改为 YAML

## 📦 下载说明

- **Windows 用户**：下载 `myapp-v1.0.0-windows-x64.exe`
- **macOS 用户**：下载 `myapp-v1.0.0-macos-arm64.dmg`
- **Linux 用户**：下载 `myapp-v1.0.0-linux-amd64.tar.gz`

## 🔧 升级指南

1. 备份现有配置文件
2. 下载对应平台的安装包
3. 运行安装程序
4. 参考文档更新配置文件格式

## 📝 完整更新日志

查看 [CHANGELOG.md](https://github.com/用户名/仓库名/blob/main/CHANGELOG.md)
```

### 方法 2：通过命令行创建

适合自动化发布流程或 CI/CD 集成。

#### 使用 GitHub CLI

首先安装 [GitHub CLI](https://cli.github.com/)：

```bash
# Windows (使用 winget)
winget install --id GitHub.cli

# macOS
brew install gh

# Linux
# 参考官方文档：https://github.com/cli/cli/blob/trunk/docs/install_linux.md
```

登录 GitHub：

```bash
gh auth login
```

创建 Release：

```bash
# 基本用法
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes "Release notes here"

# 上传 Assets
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes "Release notes here" \
  ./build/app.exe \
  ./build/installer.msi \
  ./build/app.zip

# 从文件读取 Release Notes
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes-file RELEASE_NOTES.md \
  ./dist/*

# 创建预发布版本
gh release create v1.0.0-beta.1 \
  --title "Version 1.0.0 Beta 1" \
  --notes "Beta release" \
  --prerelease

# 创建草稿
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes "Draft release" \
  --draft
```

#### 使用 Git Tag + 手动上传

```bash
# 1. 创建 Tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# 2. 推送 Tag 到远程
git push origin v1.0.0

# 3. 在 GitHub 网页上基于这个 Tag 创建 Release
```

### 方法 3：通过 GitHub Actions 自动发布

适合需要自动化构建和发布的项目。

创建 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'  # 当推送 v 开头的 tag 时触发

jobs:
  build-and-release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build project
      run: |
        # 你的构建命令
        npm install
        npm run build
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      with:
        files: |
          dist/app.exe
          dist/installer.msi
          dist/app.zip
        body: |
          ## 更新内容
          
          - 新功能 1
          - Bug 修复 1
        draft: false
        prerelease: false
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

使用方法：

```bash
# 创建并推送 Tag，自动触发发布
git tag v1.0.0
git push origin v1.0.0
```

## 版本号规范

推荐使用 **语义化版本（Semantic Versioning）**。

### 格式

```
v主版本号.次版本号.修订号[-预发布标识]

示例：
v1.0.0
v1.2.3
v2.0.0-beta.1
v1.0.0-rc.2
```

### 版本号含义

- **主版本号（Major）**：不兼容的 API 修改
- **次版本号（Minor）**：向下兼容的功能新增
- **修订号（Patch）**：向下兼容的问题修正

### 版本号示例

| 版本号 | 说明 |
|--------|------|
| `v1.0.0` | 首个正式版本 |
| `v1.1.0` | 新增功能，向下兼容 |
| `v1.1.1` | Bug 修复 |
| `v2.0.0` | 重大更新，可能不兼容旧版本 |
| `v1.0.0-alpha.1` | Alpha 测试版 |
| `v1.0.0-beta.1` | Beta 测试版 |
| `v1.0.0-rc.1` | Release Candidate（候选版本） |

### 版本号递增规则

1. 修复 Bug：`v1.0.0` → `v1.0.1`
2. 新增功能（兼容）：`v1.0.1` → `v1.1.0`
3. 重大更新（不兼容）：`v1.1.0` → `v2.0.0`

## Assets 管理

### 上传 Assets

**在创建 Release 时上传：**
- 直接在创建页面上传文件

**在已发布的 Release 中添加：**
1. 进入 Release 页面
2. 点击对应版本的 "Edit release"
3. 上传新文件
4. 点击 "Update release"

### Assets 命名建议

清晰的文件命名可以帮助用户快速找到需要的版本：

```
格式：项目名-版本号-平台-架构.扩展名

示例：
myapp-v1.0.0-windows-x64.exe
myapp-v1.0.0-windows-x86.exe
myapp-v1.0.0-macos-arm64.dmg
myapp-v1.0.0-macos-x64.dmg
myapp-v1.0.0-linux-amd64.tar.gz
myapp-v1.0.0-linux-arm64.tar.gz
myapp-v1.0.0-source.zip
```

### 常见平台和架构

| 平台 | 架构 | 说明 |
|------|------|------|
| Windows | x64 | 64位 Windows |
| Windows | x86 | 32位 Windows |
| Windows | arm64 | ARM64 Windows |
| macOS | x64 | Intel Mac |
| macOS | arm64 | Apple Silicon (M1/M2/M3) |
| Linux | amd64 | 64位 Linux |
| Linux | arm64 | ARM64 Linux |
| Linux | armv7 | ARM v7 Linux |

### 删除 Assets

1. 进入 Release 页面
2. 点击 "Edit release"
3. 点击文件旁边的 ❌ 删除
4. 点击 "Update release"

## 下载 Release 文件

### 通过网页下载

1. 访问仓库的 Releases 页面：`https://github.com/用户名/仓库名/releases`
2. 找到需要的版本
3. 在 Assets 区域点击文件名下载

### 直接链接下载

格式：
```
https://github.com/用户名/仓库名/releases/download/标签名/文件名
```

示例：
```
https://github.com/tibold/svg-explorer-extension/releases/download/v1.2.0/SvgSee-x64.msi
```

### 使用命令行下载

```bash
# 使用 wget
wget https://github.com/用户名/仓库名/releases/download/v1.0.0/app.zip

# 使用 curl
curl -L -O https://github.com/用户名/仓库名/releases/download/v1.0.0/app.zip

# 使用 GitHub CLI 下载最新版本
gh release download --repo 用户名/仓库名
```

## 管理 Release

### 编辑 Release

1. 进入 Release 页面
2. 点击对应版本的 "Edit release"
3. 修改标题、说明或上传新文件
4. 点击 "Update release"

### 删除 Release

1. 进入 Release 页面
2. 点击对应版本的 "Edit release"
3. 滚动到底部，点击 "Delete this release"
4. 确认删除

::: warning 注意
删除 Release 不会删除对应的 Git Tag，需要单独删除：

```bash
# 删除本地 Tag
git tag -d v1.0.0

# 删除远程 Tag
git push origin :refs/tags/v1.0.0
```
:::

### 标记为 Latest Release

GitHub 会自动将最新的非预发布版本标记为 "Latest"。

手动修改：
1. 进入 Release 页面
2. 点击要标记的版本的 "Edit release"
3. 勾选 "Set as the latest release"
4. 点击 "Update release"

## 最佳实践

### 1. 保持版本号一致

确保以下位置的版本号一致：
- Git Tag
- Release 标题
- 代码中的版本号（package.json、setup.py 等）
- 文档中的版本号

### 2. 编写详细的 Release Notes

好的 Release Notes 应该包含：
- ✅ 新功能列表
- ✅ Bug 修复列表
- ✅ 破坏性变更说明
- ✅ 升级指南
- ✅ 已知问题
- ✅ 下载说明

### 3. 提供多平台支持

为不同平台的用户提供对应的安装包：
- Windows：.exe、.msi
- macOS：.dmg、.pkg
- Linux：.deb、.rpm、.tar.gz

### 4. 使用 Changelog

在仓库中维护 `CHANGELOG.md` 文件，记录每个版本的详细变更。

### 5. 自动化发布流程

使用 GitHub Actions 或其他 CI/CD 工具自动化构建和发布流程。

### 6. 测试后再发布

- 使用 Draft（草稿）功能先创建 Release
- 测试下载链接和文件完整性
- 确认无误后再正式发布

### 7. 预发布版本

对于测试版本，使用 Pre-release 标记：
- `v1.0.0-alpha.1`：内部测试版
- `v1.0.0-beta.1`：公开测试版
- `v1.0.0-rc.1`：候选发布版

## 常见问题

### 如何修改已发布的 Release？

点击 "Edit release" 即可修改标题、说明和上传新文件。

### 如何删除 Release 但保留 Tag？

删除 Release 不会删除 Tag，Tag 会保留在仓库中。

### 如何删除 Tag？

```bash
# 删除本地 Tag
git tag -d v1.0.0

# 删除远程 Tag
git push origin --delete v1.0.0
```

### Assets 文件大小限制？

单个文件最大 2GB。

### 如何让用户自动获取最新版本？

可以使用 GitHub API 获取最新 Release 信息：

```bash
# 获取最新 Release 信息
curl https://api.github.com/repos/用户名/仓库名/releases/latest

# 获取最新版本号
curl -s https://api.github.com/repos/用户名/仓库名/releases/latest | grep "tag_name"
```

### 如何在 README 中显示最新版本徽章？

使用 shields.io：

```markdown
![GitHub release](https://img.shields.io/github/v/release/用户名/仓库名)
```

效果：![GitHub release](https://img.shields.io/github/v/release/microsoft/vscode)

## 相关资源

- [GitHub Releases 官方文档](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [GitHub CLI 文档](https://cli.github.com/manual/)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/) - Changelog 编写指南
