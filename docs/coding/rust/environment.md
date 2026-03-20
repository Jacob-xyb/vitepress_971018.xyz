# Rust 开发环境

## 配置 Rust 开发环境

配置 Rust 开发环境，核心就是三步：**安装工具链、配置 IDE、优化国内镜像**。整个过程非常直接，官方工具 `rustup` 会帮你搞定绝大部分工作。

下面我按操作系统和 IDE 选择，为你梳理了最实用的配置路径。

### 🛠️ 第一步：安装核心工具链 (rustup + cargo)

Rust 官方推荐通过 `rustup` 来安装和管理工具链。它会自动安装 `rustc`（编译器）、`cargo`（包管理器/构建工具）等所有必需品。

你可以根据使用的操作系统，参照下表进行操作：

| 操作系统 | 核心安装命令 / 步骤 | ⚠️ 关键注意事项 |
| :--- | :--- | :--- |
| **macOS / Linux** | 打开终端，执行：<br>`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` | 1. **不要**使用系统包管理器（如 `apt`、`brew`）安装，版本会滞后。<br>2. 安装后，运行 `source "$HOME/.cargo/env"` 让环境变量生效。<br>3. **（Linux）** 可能需要先安装编译依赖：<br>   `sudo apt update && sudo apt install -y curl gcc` |
| **Windows** | 1. 下载并运行 [rustup-init.exe](https://rustup.rs/)。<br>2. 若提示缺少 **Visual Studio C++ 构建工具**，请按提示安装。 | **必须先安装** “使用C++的桌面开发” 组件（MSVC），这是编译Rust代码的基础。 |

安装完成后，**重启终端**，用以下命令验证是否成功：
```bash
rustc --version   # 应显示类似 rustc 1.91.0 的信息
cargo --version   # 应显示类似 cargo 1.91.0 的信息
```

### 💻 第二步：选择与配置 IDE (VSCode / RustRover)

一个好的 IDE 能极大提升 Rust 的开发体验。目前主流选择有两种：

| IDE | 推荐插件/版本 | 核心优势 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **Visual Studio Code** | **[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)** | 免费、轻量、响应快，提供顶级的代码补全、类型分析和实时错误提示。 | 绝大多数开发者，尤其是希望快速上手和获得流畅 AI 编程体验的用户。 |
| **RustRover** | 独立 IDE (来自 JetBrains) | 开箱即用，集成了调试器、分析器、数据库工具和 VCS 等全套功能。 | 习惯 JetBrains 全家桶，需要一个一体化、大而全开发环境的专业开发者。 |

> **💡 小贴士**：如果你已经是 IntelliJ IDEA 用户，可以安装官方的 **Rust 插件**，它能获得和 RustRover 几乎一样的功能。

### 🇨🇳 第三步：配置国内镜像加速

在国内，不配置镜像的话，下载依赖会非常慢，甚至失败。

**1. 配置 Rustup 镜像**
在终端中设置环境变量，加速 Rust 工具链本身的下载：
```bash
# 临时设置 (在当前终端窗口生效)
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
```
若希望永久生效，可以将这两行 `export` 命令添加到你的 shell 配置文件（如 `~/.bashrc` 或 `~/.zshrc`）中。

**2. 配置 Cargo 镜像**
创建（或编辑）文件 `~/.cargo/config.toml`，添加以下内容，加速第三方库的下载：
```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"
```
> 也可以使用字节跳动提供的 `rsproxy` 镜像源，配置方法类似。

### 🚀 第四步：创建并运行你的第一个项目

所有配置完成后，就可以创建你的第一个 Rust 程序了：

```bash
# 1. 创建一个新的二进制项目
cargo new hello_world

# 2. 进入项目目录
cd hello_world

# 3. 编译并运行项目
cargo run
```
如果一切正常，你会在屏幕上看到经典的 `Hello, world!`。


## Cargo 包管理器

Cargo 是 Rust 的构建系统和包管理器，类似于 npm、pip。

**常用命令**
```bash
cargo new my_project      # 创建新项目
cargo build              # 编译项目
cargo run                # 编译并运行
cargo test               # 运行测试
cargo check              # 快速检查代码（不生成可执行文件）
cargo build --release    # 发布版本编译（优化）
```

**添加依赖**

编辑 `Cargo.toml` 文件：
```toml
[dependencies]
serde = "1.0"
tokio = { version = "1.0", features = ["full"] }
```

然后运行：
```bash
cargo build  # 自动下载并编译依赖
```

## 工具链管理

### 版本管理

```bash
rustup default stable      # 设置默认为稳定版
rustup default nightly     # 设置默认为每夜版
rustup default 1.70.0      # 设置特定版本
```

### 目标平台

```bash
rustup target list                    # 查看所有支持的目标平台
rustup target add x86_64-pc-windows-gnu  # 添加交叉编译目标
```

### 组件管理

```bash
rustup component add rustfmt    # 代码格式化工具
rustup component add clippy     # 代码检查工具
rustup component add rust-src   # Rust 源码（用于 IDE 补全）
```

## 常用工具

### rustfmt - 代码格式化

```bash
cargo fmt  # 格式化项目代码
```

配置文件 `rustfmt.toml`：
```toml
max_width = 100
tab_spaces = 4
```

### Clippy - 代码检查

```bash
cargo clippy  # 运行代码检查
```

Clippy 提供比编译器更严格的代码质量检查。

### rust-analyzer - 语言服务器

为 IDE 提供智能补全、跳转定义、错误提示等功能。

安装：
```bash
rustup component add rust-analyzer
```

## 项目结构

标准 Rust 项目结构：
```
my_project/
├── Cargo.toml          # 项目配置和依赖
├── Cargo.lock          # 依赖版本锁定（自动生成）
├── src/
│   ├── main.rs         # 二进制项目入口
│   └── lib.rs          # 库项目入口
├── tests/              # 集成测试
├── benches/            # 性能测试
└── examples/           # 示例代码
```

## 学习资源

- [Rust 官方文档](https://doc.rust-lang.org/)
- [Rust 程序设计语言（中文版）](https://kaisery.github.io/trpl-zh-cn/)
- [Rust By Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings 练习](https://github.com/rust-lang/rustlings)
