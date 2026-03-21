<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-20 23:31:19
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-20 23:31:31
 * @Description: Life is struggle.
-->
# Rust Tauri

## 基础指令

| 命令 | 作用 | 产物 |
|------|------|------|
| `npm run tauri dev` | 开发模式，热重载 | 无 exe，仅内存运行 |
| `npm run tauri build` | 生产构建 | 生成 `src-tauri/target/release/` 下的 exe |
| `cargo tauri build --no-bundle` | 不打包，仅编译 | 仅生成 exe，不生成安装包 |

::: tip 提示
使用 `npm run tauri dev` 开发时，无需每次重新编译，直接保存即可热重载。
:::

::: warning 注意
`cargo tauri build --no-bundle` 仅生成 exe 可执行文件，不包含安装包，适用于快速验证。
:::

## Windows Crate 编译优化

`windows` crate 默认会为多个 Windows API 版本编译实现，导致 `target` 缓存体积巨大。实际上项目只需针对特定 Windows 版本编译，可通过以下方式限制：

### 方案一：使用 Feature Flags 限制目标版本

```toml
# Cargo.toml
[dependencies]
windows = { version = "0.58", default-features = false, features = [
    # 只编译 Windows 10 相关的 API
    "Win32_Foundation",
    "Win32_UI_WindowsAndMessaging",
    # 按需添加其他功能
] }
```

### 方案二：使用 cargo-hakari 统一依赖

`cargo-hakari` 主要解决**工作空间依赖矩阵**问题 —— 当多个 crate 依赖同一 crate 的不同版本时，cargo 会为每种组合分别编译，导致缓存膨胀。

::: warning 仅限工作空间
`cargo-hakari` **不适用于单个项目**，仅对工作空间有效。
:::

#### 什么是工作空间

**Rust 工作空间（Workspace）** 是指多个 crate 共享同一个 `Cargo.toml` 和编译缓存的项目结构：

```
my-project/                    # 工作空间根目录
├── Cargo.toml                  # 工作空间配置
├── crate-a/                    # 子 crate 1
│   └── Cargo.toml
└── crate-b/                    # 子 crate 2
    └── Cargo.toml
```

根目录 `Cargo.toml` 声明成员：

```toml
# 根目录 Cargo.toml
[workspace]
members = ["crate-a", "crate-b"]
resolver = "2"  # 推荐启用
```

| 特性 | 单项目 | 工作空间 |
|------|--------|----------|
| `target` 缓存 | 各项目独立 | **共享** |
| 依赖版本 | 各项目独立 | 可统一 |
| `cargo-hakari` | ❌ 无效 | ✅ 有效 |

**判断方法** — 查看项目根目录是否有 `[workspace]` 配置：

```bash
grep -A 5 "\[workspace\]" Cargo.toml
```

如果没有输出就是单项目。

```bash
# 安装
cargo install cargo-hakari

# 在工作空间根目录运行
cargo hakari generate --format toml > rust-toolchain.toml
cargo hakari manage
```

```toml
# 生成的 rust-toolchain.toml
[tool.hakari]
# 统一 Windows crate 的特征
unified-features = ["windows/Win32_Foundation"]
```

::: tip 效果
- `cargo-hakari` 统一工作空间中所有 crate 的依赖特征，消除重复编译
- 配合 `cargo-hakari timeload` 可查看依赖覆盖情况
- 对于 `windows` crate 单独使用（不在工作空间中），直接使用 feature flags 限制即可
:::

### 方案三：使用 sccache 缓存编译结果

`sccache` 是一个编译缓存工具，支持 Rust/C/C++ 等语言。相同代码再次编译时直接返回缓存结果，大幅缩短编译时间。

```bash
# 安装
cargo install sccache

# 配置环境变量（Windows）
set RUSTC_WRAPPER=sccache
set SCCACHE_DIR=D:\.sccache  # 缓存目录
set SCCACHE_CACHE_SIZE=10G   # 最大缓存大小

# 或在项目根目录创建 .cargo/config.toml
[build]
rustc-wrapper = "sccache"
```

```toml
# .cargo/config.toml (项目级配置)
[build]
rustc-wrapper = "D:/path/to/sccache.exe"
```

::: tip 效果
- 首次编译后，相同代码再次编译几乎瞬间完成
- 适合频繁重新编译的场景（如开发调试）
- 缓存可在不同项目间共享（相同依赖版本）
- 查看缓存命中率：`sccache --show-stats`
:::

### 查看当前编译目标

```bash
# 查看 windows crate 实际编译了哪些目标
cargo build --message-format=short | grep "Compiling windows"
```
