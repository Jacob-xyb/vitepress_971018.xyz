# Rust 开发环境

## 安装 Rust

### 使用 rustup（推荐）

rustup 是 Rust 官方的工具链管理器，支持多版本管理和跨平台编译。

**Windows 安装**
```bash
# 下载并运行安装程序
# 访问 https://rustup.rs/ 下载 rustup-init.exe
```

**macOS / Linux 安装**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**验证安装**
```bash
rustc --version  # 查看 Rust 编译器版本
cargo --version  # 查看 Cargo 包管理器版本
```

### 更新 Rust

```bash
rustup update  # 更新到最新稳定版
```

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

## 国内镜像配置（可选）

如果下载速度慢，可以配置国内镜像。

编辑 `~/.cargo/config.toml`（Windows: `%USERPROFILE%\.cargo\config.toml`）：

```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"
```

## 学习资源

- [Rust 官方文档](https://doc.rust-lang.org/)
- [Rust 程序设计语言（中文版）](https://kaisery.github.io/trpl-zh-cn/)
- [Rust By Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings 练习](https://github.com/rust-lang/rustlings)
