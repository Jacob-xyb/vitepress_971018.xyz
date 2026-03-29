<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-14 21:33:28
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-14 21:33:50
 * @Description: Life is struggle.
-->
# Vscode中使用vibe-coding

## Claude Code

### 🧰 第一部分：Claude Code 官方扩展的两种用法

你可以根据自己的喜好和场景，选择以下两种方式之一来使用 Claude Code：

| 使用方式 | 核心特点 | 典型操作流程 |
| --- | --- | --- |
| **VS Code 图形界面扩展** | **更直观，适合日常编码** <br> • 安装后，会在侧边栏出现一个“火花”图标✨ 。<br> • 通过**图形化面板**与AI对话，AI的修改会以**代码差异对比**的方式清晰展示，你可以逐行决定接受或拒绝。<br> • 能自动感知你在编辑器中打开的文件和选中的代码，提供精准的上下文。 | 1. 在 VS Code 扩展市场搜索并安装 `Claude Code` 扩展。<br>2. 点击侧边栏的✨图标打开对话面板。<br>3. 在面板中提问或下达指令，AI的修改会以差异对比形式呈现，确认后应用。 |
| **终端命令行工具** | **更强大，适合复杂任务和自动化** <br> • 作为一个全局的命令行工具 `claude` 使用。<br> • 可以运行在 VS Code 的内置终端中，功能与扩展互补。<br> • 支持丰富的**子命令** (如 `/init` 初始化项目, `/review` 审查代码) 和**脚本集成**。 | 1. 确保已安装 Node.js (18+)，然后在终端全局安装：`npm install -g @anthropic-ai/claude-code` 。<br>2. 在项目目录下，通过 `claude` 命令启动交互式对话。<br>3. 在终端中直接提问或使用 `/` 开头的命令执行特定操作。 |

**总结一下**：如果你喜欢在编辑器的侧边栏里点点鼠标就能完成工作，**VS Code扩展**最适合你；如果你更习惯键盘操作，或者需要把AI能力集成到脚本里，**命令行工具**会是你的好帮手。而且，这两个方式可以同时使用，互不冲突。

### 🔗 第二部分：如何配置 Claude Code 使用 Minimax 模型

无论你选择哪种方式，想要让 Claude Code 调用 Minimax 的模型（比如强大的 **MiniMax-M2.5** ），核心原理都是**修改它的API调用地址和密钥**，让它把请求发送到 Minimax 的接口上。

在开始之前，你需要先准备好：

1. **Minimax API Key**：登录 [Minimax开放平台](https://platform.minimaxi.com/)，在控制台中创建并获取你的API密钥。
2. **接口地址**：根据你的网络环境选择对应的地址：
    - 国内用户请用：`https://api.minimaxi.com/anthropic`
    - 国际用户请用：`https://api.minimax.io/anthropic`

---

### 配置方法 A：如果你主要使用 **VS Code 扩展**

这种配置方式最直接，通过修改 VS Code 的设置文件来完成。

1. **打开设置**：在 VS Code 中，按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 打开命令面板，输入 `Preferences: Open Settings (JSON)` 并选择，打开你的 `settings.json` 文件。
2. **添加配置**：在 `settings.json` 文件的末尾（注意在最后一个大括号 `}` 之前），粘贴以下配置。**请务必将 `<MINIMAX_API_KEY>` 替换为你自己的真实API密钥**。
    
    ```json
    "claudeCode.environmentVariables": [
            {
                "name": "ANTHROPIC_BASE_URL",
                "value": "<https://api.minimaxi.com/anthropic>" // 国内用户
                // "value": "<https://api.minimax.io/anthropic>" // 国际用户请用此行
            },
            {
                "name": "ANTHROPIC_AUTH_TOKEN",
                "value": "<MINIMAX_API_KEY>" // 替换为你的真实API密钥
            },
            {
                "name": "API_TIMEOUT_MS",
                "value": "3000000"
            },
            {
                "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
                "value": "1"
            },
            {
                "name": "ANTHROPIC_MODEL",
                "value": "MiniMax-M2.5"
            },
            {
                "name": "ANTHROPIC_DEFAULT_SONNET_MODEL",
                "value": "MiniMax-M2.5"
            }
            // ... 你可以根据需要添加其他模型的映射
        ]
    ```
    
3. **保存并生效**：保存 `settings.json` 文件。之后，当你打开 Claude Code 扩展面板时，它就会自动使用 Minimax 的模型了。

> **注意**：在 VS Code 的设置中添加环境变量后，原有的系统环境变量（如 `ANTHROPIC_AUTH_TOKEN`）会被覆盖，以避免冲突。
> 

### 配置方法 B：如果你主要使用 **终端命令行工具**

这种方式通过在启动 `claude` 命令前设置临时的环境变量来实现。

1. **打开终端**：进入你的项目目录。
2. **设置环境变量**：在终端中依次执行以下命令，同样，**记得替换 `<MINIMAX_API_KEY>`**。
    
    ```bash
    # 设置API调用的基础地址（根据你的位置选择）
    export ANTHROPIC_BASE_URL="<https://api.minimaxi.com/anthropic>"  # 国内用户
    # export ANTHROPIC_BASE_URL="<https://api.minimax.io/anthropic>" # 国际用户请用此行
    
    # 设置你的Minimax API密钥
    export ANTHROPIC_AUTH_TOKEN="<MINIMAX_API_KEY>"
    
    # （可选）指定使用的模型，不设置的话默认也会用MiniMax-M2.5
    export ANTHROPIC_MODEL="MiniMax-M2.5"
    ```
    
3. **启动 Claude Code**：在当前终端中，直接运行 `claude` 命令即可。
    
    ```bash
    claude
    ```
    
    之后在这个终端会话中，所有的请求都会通过 Minimax 的模型来处理。
    

### ✨ 配置方法 C：使用图形化工具 CCswitch（推荐新手）

如果你觉得手动修改配置文件有点复杂，还有一个更简单的办法，就是使用一个叫 **CCswitch** 的开源小工具。

1. **下载安装**：在 [CCswitch的GitHub页面](https://github.com/farion1231/ccswitch) 找到适合你系统的版本（Windows/Mac）并安装。
2. **添加配置**：打开 CCswitch，点击“+”号，选择预设的 **MiniMax** 供应商，然后在弹出的窗口中填入你的 **Minimax API Key**，并选择模型（如 `MiniMax-M2.5`）。
3. **一键启用**：保存配置后，回到 CCswitch 首页，点击“启用”按钮。它会自动帮你修改好所有必要的配置文件。之后你在终端里直接输入 `claude` 就可以使用 Minimax 模型了。

### 配置的优先顺序

当你同时使用了多种配置方式时，可能会出现配置冲突的情况。Claude Code 会按照以下优先级来决定使用哪个配置：

| 优先级 | 配置方式 | 配置文件位置 | 生效范围 |
| :---: | --- | --- | --- |
| 🔴 **最高** | 终端环境变量 | 终端会话中 `export` 设置 | 仅当前终端会话 |
| 🟠 **高** | CCSwitch | `~/.claude.settings.json` (用户级别) | 全局生效，重启终端后 |
| 🟡 **中** | VS Code settings.json | 工作区或用户级 `settings.json` | 仅 VS Code 扩展 |

**简单来说**：

- 🟡 **VS Code 扩展**会读取用户级和工作区级的 `settings.json`
- 🟠 **命令行工具**主要读取 `~/.claude.settings.json`（CCSwitch 就是修改这个文件）
- 🔴 **环境变量**最"强势"，只要它设了，就会覆盖其他所有配置

::: tip 实际使用建议
如果你用 CCSwitch 配置了 Minimax，但突然想临时切换回官方 API 测试一下，只需要**在终端里手动设置环境变量**即可，优先级最高，无需修改任何配置文件。测试完后关掉终端，环境变量自动失效，又会回到 CCSwitch 配置的状态。
:::

### 💡 总结一下

- **VS Code 扩展**适合在图形界面中直观地使用，通过修改 `settings.json` 来配置。
- **命令行工具**更加强大和灵活，通过在终端中设置环境变量来配置。
- **CCswitch** 是一个图形化的“开关”，可以帮你一键完成所有配置，对新手非常友好。

配置好之后，你就可以在 VS Code 里尽情体验 Minimax 模型带来的编程快感了。

## MCP (Model Context Protocol)

### 简介

MCP 是一种开放协议，让 AI 助手能够与外部工具和数据源无缝连接。通过 MCP，你可以让 Claude Code 访问文件系统、搜索代码库、执行命令等。

### MCP 的核心用途

| 功能 | 说明 |
| --- | --- |
| **工具调用** | AI 可以调用外部工具（如文件系统、搜索、Git 等） |
| **资源访问** | AI 可以读取外部资源（如文件内容、数据库等） |
| **提示模板** | 共享可复用的提示模板 |

### 配置位置

MCP 服务可以通过以下方式配置：

| 配置文件 | 位置 | 生效范围 | 稳定性 |
| --- | --- | --- | --- |
| `.vscode/mcp.json` | 项目根目录 | 仅当前项目 | ⚠️ 可能被 `/install` 覆盖 |
| `.claude.json` | 项目根目录 | 仅当前项目 | ⚠️ 可能被 `/install` 覆盖 |
| `~/.claude/settings.json` | 用户目录 | 全局所有项目 | ✅ 推荐 |

### 为什么配置经常被重置？

运行 `/install` 命令时会重写 `.claude.json`，导致项目级的 MCP 配置丢失。

**解决方案**：
- **全局配置**：将 MCP 配置放在 `~/.claude/settings.json`，不会被项目级操作覆盖
- **备份习惯**：修改配置前先备份原有内容

### 配置示例

在项目根目录的 `.vscode/mcp.json` 中配置：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./docs"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

全局配置则放在 `~/.claude/settings.json`：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

### 常用 MCP 服务

| 服务 | 包名 | 功能 |
| --- | --- | --- |
| 文件系统 | `@modelcontextprotocol/server-filesystem` | 读写文件、列出目录 |
| Git | `@modelcontextprotocol/server-git` | Git 操作 |
| GitHub | `@modelcontextprotocol/server-github` | GitHub API |
| 搜索 | `@modelcontextprotocol/server-fetch` | 网页内容获取 |

配置完成后，Claude Code 就能通过 MCP 调用这些工具扩展自己的能力。

在配置过程中如果遇到任何问题，比如找不到文件、填了密钥报错，随时可以再来问我，我们一起看看怎么解决～