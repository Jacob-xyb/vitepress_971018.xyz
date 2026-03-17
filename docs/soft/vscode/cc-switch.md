<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-17 16:20:12
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-17 16:26:58
 * @Description: Life is struggle.
-->
# CC-Switch

CC-Switch 是一款用于管理 Claude Code、Codex、Gemini CLI、OpenCode 和 OpenClaw 的桌面应用程序。

## 为什么使用 CC-Switch？

现代 AI 编程依赖于 CLI 工具（如 Claude Code、Codex、Gemini CLI 等），但每个工具都有各自的配置格式。切换 API 提供商意味着手动编辑 JSON、TOML 或 .env 文件，而且没有统一的方式来管理 MCP 和 Skills。

CC-Switch 提供了一个统一的桌面应用来管理这五个 CLI 工具：
- **可视化界面** - 无需手动编辑配置文件
- **50+ 提供商预设** - 包括 AWS Bedrock、NVIDIA NIM 和社区中转服务
- **一键切换** - 从系统托盘快速切换提供商
- **统一 MCP 管理** - 跨四个应用管理 MCP 服务器
- **统一 Skills 管理** - 跨应用管理 Skills
- **云同步** - 支持 Dropbox、OneDrive、iCloud、WebDAV 同步

## 支持的工具

| 工具 | 说明 |
|------|------|
| Claude Code | 支持热切换，无需重启终端 |
| Codex | 需要重启终端生效 |
| Gemini CLI | 需要重启终端生效 |
| OpenCode | 通用提供商配置 |
| OpenClaw | 通用提供商配置 |

## 快速开始

### 基本用法

1. **添加提供商**：点击 "Add Provider" → 选择预设或创建自定义配置
2. **切换提供商**：
   - 主界面：选择提供商 → 点击 "Enable"
   - 系统托盘：直接点击提供商名称（即时生效）
3. **生效**：重启终端或对应的 CLI 工具（Claude Code 无需重启）
4. **恢复官方登录**：从预设列表添加 "Official Login"，重启 CLI 后按其登录流程操作

### MCP、Prompts、Skills

- **MCP**：点击 "MCP" 按钮 → 通过模板或自定义配置添加服务器 → 开启跨应用同步
- **Prompts**：点击 "Prompts" → 使用 Markdown 编辑器创建预设 → 激活后同步到实时文件
- **Skills**：点击 "Skills" → 浏览 GitHub 仓库 → 一键安装到所有应用

## 数据存储位置

- **数据库**：`~/.cc-switch/cc-switch.db` (SQLite)
- **本地设置**：`~/.cc-switch/settings.json`
- **备份**：`~/.cc-switch/backups/` (自动轮换，保留最近 10 个)
- **Skills**：`~/.cc-switch/skills/` (默认符号链接到对应应用)

## 下载安装

### 系统要求

- **Windows**: Windows 10 及以上
- **macOS**: macOS 12 (Monterey) 及以上
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+ 等主流发行版

### 安装

从 [GitHub Releases](https://github.com/farion1231/cc-switch/releases) 下载对应平台的安
装包。

## 误操作解决方案

### 删除配置后 CC-Switch 失效

**问题原因**：CC-Switch 采用"最小侵入"设计原则——即使卸载应用，CLI 工具仍能正常工作。系统始终保留一个活动配置，删除所有配置会导致对应的 CLI 工具无法使用。

当你在 VSCode 或其他地方手动删除了 CC-Switch 写入的配置文件后，CC-Switch 无法再管理该工具，因为源配置文件已丢失。

**解决方案**：
1. 在 CC-Switch 中添加一个新的提供商（可从预设中选择）
2. CC-Switch 会自动重新生成配置文件
3. 或者从备份目录恢复配置：`~/.cc-switch/backups/`

### 如何安全删除提供商

如果需要删除某个提供商：
1. 先切换到其他提供商（确保不是当前活动的）
2. 然后再删除该提供商

### 恢复官方登录

1. 从预设列表添加 "Official Login" 提供商
2. 切换到该提供商
3. 重启 CLI 工具，执行登录/授权流程
4. 之后可以在官方和第三方提供商之间自由切换

## 相关链接

- [GitHub 仓库](https://github.com/farion1231/cc-switch)
- [用户手册](https://github.com/farion1231/cc-switch/tree/master/docs/user-manual/en)

