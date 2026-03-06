# VSCode 开发 Rust

## VSCode 是否适合 Rust 开发？

**答案：非常适合！** VSCode 是目前最流行的 Rust 开发环境之一。

### 优势

**强大的语言支持**
- rust-analyzer 提供一流的智能补全
- 实时错误检查和类型提示
- 代码导航（跳转定义、查找引用）
- 自动导入和重构支持

**轻量高效**
- 启动快速，资源占用少
- 插件生态丰富
- 跨平台支持（Windows/macOS/Linux）

**集成开发体验**
- 内置终端，方便运行 cargo 命令
- Git 集成
- 调试支持
- 任务自动化

**社区支持**
- Rust 官方推荐
- 活跃的插件维护
- 丰富的教程和文档

### 对比其他 IDE

| IDE | 优势 | 劣势 |
|-----|------|------|
| VSCode | 轻量、插件丰富、免费 | 需要配置插件 |
| IntelliJ IDEA + Rust 插件 | 功能强大、开箱即用 | 较重、付费版功能更全 |
| CLion + Rust 插件 | 专业 C/C++ IDE 体验 | 付费、资源占用大 |
| Vim/Neovim | 轻量、高度可定制 | 配置复杂、学习曲线陡 |

## 必装插件

### 1. rust-analyzer

**最重要的插件**，提供核心语言支持。

**安装方式：**
- 在 VSCode 扩展市场搜索 "rust-analyzer"
- 或访问：[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

**主要功能：**
- 智能代码补全
- 类型推断和提示
- 错误诊断
- 代码导航
- 重构工具
- 内联提示（类型、参数名）

### 2. CodeLLDB

**调试器插件**，支持断点调试。

**安装方式：**
- 搜索 "CodeLLDB"
- 或访问：[CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)

**功能：**
- 断点调试
- 变量查看
- 调用栈追踪
- 表达式求值

### 3. crates

**依赖管理插件**，管理 Cargo.toml 中的依赖。

**功能：**
- 显示依赖的最新版本
- 一键更新依赖
- 依赖文档链接

### 4. Even Better TOML

**TOML 文件支持**，用于编辑 Cargo.toml。

**功能：**
- 语法高亮
- 格式化
- 错误检查

## 配置 VSCode

### settings.json 推荐配置

打开 VSCode 设置（`Ctrl+,` 或 `Cmd+,`），点击右上角的 `{}` 图标编辑 JSON：

```json
{
  // Rust Analyzer 配置
  "rust-analyzer.check.command": "clippy",  // 使用 clippy 进行检查
  "rust-analyzer.cargo.features": "all",    // 启用所有 features
  "rust-analyzer.inlayHints.typeHints.enable": true,  // 显示类型提示
  "rust-analyzer.inlayHints.parameterHints.enable": true,  // 显示参数提示
  
  // 编辑器配置
  "editor.formatOnSave": true,  // 保存时自动格式化
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer",
    "editor.tabSize": 4
  },
  
  // 文件关联
  "files.associations": {
    "*.rs": "rust"
  }
}
```

### 调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug executable",
      "cargo": {
        "args": [
          "build",
          "--bin=your_project_name",
          "--package=your_project_name"
        ],
        "filter": {
          "name": "your_project_name",
          "kind": "bin"
        }
      },
      "args": [],
      "cwd": "${workspaceFolder}"
    },
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug unit tests",
      "cargo": {
        "args": [
          "test",
          "--no-run",
          "--lib",
          "--package=your_project_name"
        ],
        "filter": {
          "name": "your_project_name",
          "kind": "lib"
        }
      },
      "args": [],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### 任务配置

创建 `.vscode/tasks.json`，快速运行常用命令：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "cargo",
      "command": "build",
      "problemMatcher": ["$rustc"],
      "group": "build",
      "label": "rust: cargo build"
    },
    {
      "type": "cargo",
      "command": "run",
      "problemMatcher": ["$rustc"],
      "group": "build",
      "label": "rust: cargo run"
    },
    {
      "type": "cargo",
      "command": "test",
      "problemMatcher": ["$rustc"],
      "group": "test",
      "label": "rust: cargo test"
    }
  ]
}
```

## 快捷键

**常用操作：**
- `F5`：开始调试
- `Ctrl+Shift+B`：构建项目
- `F12`：跳转到定义
- `Shift+F12`：查找所有引用
- `F2`：重命名符号
- `Ctrl+.`：快速修复

## 开发工作流

1. **创建项目**
   ```bash
   cargo new my_project
   code my_project
   ```

2. **编写代码**
   - rust-analyzer 提供实时错误提示
   - 保存时自动格式化

3. **运行和测试**
   ```bash
   cargo run    # 运行
   cargo test   # 测试
   cargo check  # 快速检查
   ```

4. **调试**
   - 设置断点（点击行号左侧）
   - 按 F5 启动调试
   - 查看变量、调用栈

5. **发布**
   ```bash
   cargo build --release
   ```

## 常见问题

### rust-analyzer 加载慢

**解决方案：**
- 首次打开项目时，rust-analyzer 需要索引代码
- 大型项目可能需要几分钟
- 可以在状态栏查看进度

### 代码补全不工作

**检查：**
1. 确认已安装 rust-analyzer 插件
2. 确认已安装 `rust-src` 组件：
   ```bash
   rustup component add rust-src
   ```
3. 重启 VSCode

### 调试器无法启动

**检查：**
1. 确认已安装 CodeLLDB 插件
2. 确认 `launch.json` 配置正确
3. 项目需要先编译成功

## 总结

VSCode + rust-analyzer 是目前 Rust 开发的黄金组合，提供了接近专业 IDE 的体验，同时保持轻量和灵活。对于初学者和专业开发者都非常友好。
