## mcp配置

在 VSCode 的 Claude Code 插件中配置 MCP (Model Context Protocol) 服务器，有两种主要方式：通过 VSCode 自带的图形界面，或直接在终端使用 `claude` 命令行工具。

为了方便查阅，这里有一个快速概览：

| 配置方式 | 适用场景 | 关键命令/操作 |
| :--- | :--- | :--- |
| **VSCode 图形界面** | 推荐新手使用，可视化操作，避免手动编辑出错 | `Cmd/Ctrl+Shift+P` → `MCP: Add Server`  |
| **命令行 (CLI)** | 适合熟悉终端的用户，效率高，便于脚本化 | `claude mcp add`  |
| **配置文件 (手动)** | 进行高级配置或需要复用配置时 | 编辑 `.mcp.json` 或 `~/.claude.json`  |

---

### 🎨 方式一：通过 VSCode 图形界面配置 (推荐)

这是最直观、不易出错的方法，适合刚开始接触 MCP 的用户。

1.  **打开命令面板**：在 VSCode 中按下 `Cmd/Ctrl + Shift + P`。
2.  **添加服务器**：输入并选择 **`MCP: Add Server`** 。
3.  **填写服务器信息**：根据你要添加的 MCP 服务器类型，在弹出的表单中填入信息。
    - **Transport (传输协议)**：
        - **`stdio`**：如果 MCP 服务器是一个需要在本地运行的命令（如 `npx`、`python` 脚本），选择此项 。
        - **`http`** 或 **`sse`**：如果 MCP 服务器是一个远程的 URL 地址，选择此项 。
    - **Command & Args (命令和参数)**：对于 `stdio` 类型的服务器，需要指定启动它的命令和参数。例如，添加一个文件系统服务器：
        - **Command**: `npx`
        - **Args**: `-y`, `@modelcontextprotocol/server-filesystem`, `/你允许访问的绝对路径` 
    - **Server URL (服务器地址)**：对于 `http` 或 `sse` 类型的服务器，直接填写完整的 URL 即可。

4.  **验证连接**：添加完成后，可以再次打开命令面板 (`Cmd/Ctrl+Shift+P`)，输入 **`MCP: List Servers`**，选择刚添加的服务器并点击 **`Show Output`**，在输出面板中查看是否连接成功 。

### 💻 方式二：通过命令行配置 (CLI)

如果你习惯使用终端，`claude` 命令提供了最高效的配置方式。

#### 1. 配置远程 HTTP/SSE 服务器

对于像 GitHub、Sentry 这类提供云端 MCP 的服务，命令格式非常简单：

```bash
# 添加一个 HTTP 类型的 MCP 服务器
claude mcp add --transport http <服务器名称> <服务器URL>

# 示例：添加 GitHub MCP 服务器
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

- **OAuth 认证**：添加完成后，在 Claude Code 会话中输入 `/mcp`，选择对应的服务器进行浏览器授权即可 。

#### 2. 配置本地 Stdio 服务器

对于需要在本机运行命令的服务器，配置会稍复杂一些。这里的核心是 `--` (双横杠)，用于分隔 `claude` 命令的参数和 MCP 服务器自身的命令及参数 。

```bash
# 基础格式
claude mcp add --transport stdio <服务器名称> -- <启动服务器的命令>

# 示例：添加一个本地文件系统服务器
claude mcp add --transport stdio filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/your/project
```

- **设置环境变量**：如果需要为服务器提供 API 密钥等环境变量，可以使用 `--env` 参数 。

    ```bash
    # 示例：添加 Airtable 服务器，并传入 API Key
    claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY -- npx -y airtable-mcp-server
    ```
- **Windows 用户注意**：在原生 Windows 环境下，如果使用 `npx`，需要用 `cmd /c` 来包装命令 。
    ```bash
    claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
    ```

### ⚙️ 配置文件位置与作用域

`claude` 命令支持三种配置作用域，决定 MCP 服务器的生效范围。在命令后添加 `--scope <作用域>` 即可指定 。

| 作用域 | 配置文件路径 | 特点 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **local (默认)** | 项目目录下的 `.claude.json` | 配置与当前项目文件夹绑定，不共享 | 个人测试、临时使用 |
| **project** | 项目根目录下的 `.mcp.json` | 配置文件可以提交到 Git 仓库，团队成员共享 | 团队统一工具链，如数据库、监控服务 |
| **user** | 用户目录下的 `~/.claude.json` | 对所有项目生效 | 个人常用工具，如笔记、代码搜索 |

手动创建或编辑这些 JSON 文件也是有效的配置方法，文件结构如下 ：

```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${YOUR_API_KEY}"
      }
    }
  }
}
```

> **环境变量支持**：在配置文件中，你可以使用 `${VAR_NAME}` 的语法来引用系统环境变量，避免将密钥硬编码在文件中 。

### 🛠️ 常用管理命令

配置完成后，可以用以下命令进行管理 ：

- `claude mcp list`：列出所有已配置的 MCP 服务器。
- `claude mcp get <服务器名称>`：查看指定服务器的详细配置。
- `claude mcp remove <服务器名称>`：移除一个 MCP 服务器。
- `/mcp`：在 Claude Code 会话中运行的交互式命令，用于管理服务器、进行 OAuth 认证等。

配置完成后，你就可以在 VSCode 的 Claude Code 对话中，通过自然语言让 Claude 调用这些外部工具了。它通常会**自动判断**并选择合适的工具来完成任务 。