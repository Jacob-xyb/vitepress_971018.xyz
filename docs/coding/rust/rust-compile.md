<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-20 20:57:45
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-20 20:58:15
 * @Description: Life is struggle.
-->
# Rust 编译


## 编译速度

关于 Rust 在实际开发中的编译速度和最终应用体积，简单来说：**开发时的“快”是可以实现的，而最终产物的“小”则是 Tauri 的一大核心优势。**

下面为你分别拆解这两个方面。

### 🏃 开发时编译速度：可以很快

Rust 编译”慢”的说法主要源于**首次构建**或**正式发布构建**。在日常开发中，通过合理的配置，你可以获得接近即时反馈的体验。

| 场景 | 编译速度 | 原因与核心优化 |
| :--- | :--- | :--- |
| **首次 / 全量构建** | **慢** (几分钟) | 需要下载并编译所有项目依赖。网络和 CPU 是主要瓶颈。可通过配置国内镜像源、使用 `sccache` 编译缓存来加速。 |
| **日常开发 / 增量构建** | **快** (数秒到十几秒) | Rust 默认启用**增量编译**，只重新编译你修改过的部分。配合下面的优化，效率会非常高。 |

为了达到开发时”快”的目标，强烈建议你进行以下配置：

#### 0️⃣ 配置 crates.io 国内镜像源（首步，非常重要）

首次编译时需要从 crates.io 下载大量依赖包，默认服务器在国外，下载速度很慢。配置国内镜像可以大幅加速。

创建或编辑 `~/.cargo/config.toml` 文件，添加以下配置：

```toml
# 中科大镜像源（推荐）
[source.crates-io]
replace-with = “ustc”

[source.ustc]
registry = “srs://https://mirrors.ustc.edu.cn/crates.io-index”

# 如果使用清华源
[source.tuna]
registry = “https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git”

# 如果上述 srs 格式不行，尝试 git 格式
[source.ustc-git]
git = “https://mirrors.ustc.edu.cn/crates.io-index”
```

> **提示**：`~/.cargo/config.toml` 的位置由 `CARGO_HOME` 环境变量决定。如果设置 `CARGO_HOME=D:\ProgramData\rust`，则配置文件为 `D:\ProgramData\rust\config.toml`。

#### 1️⃣ 为 IDE 设置独立的编译目录

> 效果最明显的一步，能有效避免文件锁冲突导致的卡顿。

在 VS Code 的 `settings.json` 中配置，让 `rust-analyzer` 插件和 `tauri dev` 命令使用各自的编译缓存：

```json
{
  “rust-analyzer.cargo.targetDir”: “target/analyzer”
}
```

#### 2️⃣ 优化开发编译配置

在项目根目录的 `Cargo.toml` 文件中，为开发环境（`[profile.dev]`）进行针对性设置，优先保证速度：

```toml
[profile.dev]
incremental = true      # 启用增量编译，这是默认开启的，可以显式确认一下
codegen-units = 16      # 增加并行编译单元，牺牲一点最终优化来换取更快的编译速度
opt-level = 0           # 禁用优化，让编译更快
debug = 1               # 仅生成行号信息，便于调试且不影响速度
```

#### 3️⃣ 使用更快的链接器

链接是编译的最后一步，对大型项目耗时明显。使用 `lld` 或 `mold` 可以显著缩短链接时间。

在 `~/.cargo/config.toml` 文件中添加配置：

```toml
# Windows 平台推荐使用 lld
[target.x86_64-pc-windows-msvc]
linker = “lld”
rustflags = [“-C”, “link-args=-flavor link”]

# Linux 平台
[target.x86_64-unknown-linux-gnu]
linker = “clang”
rustflags = [“-C”, “link-arg=-fuse-ld=lld”]
```

> **macOS 用户**：默认链接器已经很快，通常无需配置。

#### 4️⃣ 编译缓存工具 `sccache`

`sccache` 是一个编译缓存工具，可以缓存编译结果，在再次编译相同代码时直接使用缓存，大幅缩短编译时间。

```bash
# 安装
cargo install sccache

# 配置环境变量
# Windows (PowerShell)
$env:RUSTC_WRAPPER = “sccache”

# Linux/macOS
export RUSTC_WRAPPER=sccache
```

配置后，首次编译会正常编译，但再次编译相同代码时会显著加速。

#### 5️⃣ 使用 `cargo-nextest` 加速测试

`cargo-nextest` 是 `cargo test` 的替代工具，测试运行速度更快。

```bash
# 安装
cargo install cargo-nextest

# 使用方式与 cargo test 完全兼容
cargo nextest run
```

#### 6️⃣ 其他实用技巧

- **合理拆分 `crate` 类型**：将不常修改的代码分离到独立 `crate` 中，可以利用缓存减少编译范围
- **使用 `cargo check` 代替 `cargo build` 进行日常检查**：仅进行类型检查，不生成二进制文件，速度快很多
- **减少依赖数量**：定期审查 `Cargo.toml`，移除未使用的依赖

完成以上设置后，你的日常开发体验会非常接近使用 Node.js 或 Go 等语言，每次代码修改后的热重载等待时间会被压缩到几秒钟。

### 📦 最终应用体积：非常小

这正是 Tauri 最引以为傲的特性之一。一个 Tauri 应用的最小体积主要由其 Rust 后端决定，而 Rust 编译出的二进制文件本身就以“小而精”著称。

-   **基础体积**：一个空白的 Tauri 应用，编译后的体积通常在 **3 MB 到 10 MB** 之间。这比一个包含完整 Chromium 内核的 Electron 应用（动辄上百 MB）要小一个数量级。
-   **为什么可以这么小？**
    -   **静态链接**：Rust 会将你用到的标准库和依赖库直接编译进最终的二进制文件中，不依赖外部运行时。
    -   **高级优化**：Rust 编译器可以进行极其激进的优化，比如**链接时优化**，它会移除所有未使用的代码。

如果你希望应用体积能“小上加小”，Tauri 官方文档提供了详尽的优化指南。主要方法是在 `Cargo.toml` 中为发布版本（`[profile.release]`）进行配置：

```toml
[profile.release]
opt-level = "z"        # 优化体积，'z' 代表体积最小化，'s' 次之
lto = true             # 开启链接时优化，移除未使用代码
codegen-units = 1      # 减少并行单元，让优化更彻底
strip = true           # 从二进制文件中移除调试信息
panic = "abort"        # 发生恐慌时直接终止，能减少体积
```

> **配置小贴士**：请注意区分 `[profile.dev]` 和 `[profile.release]`。前者用于开发，追求**编译速度**；后者用于最终交付，追求**运行性能和体积**。

### 💎 总结

| 特性 | 核心要点 | 最终体验 |
| :--- | :--- | :--- |
| **开发编译速度** | **首次慢，增量快**。通过为 IDE 设置独立目录、使用 `lld` 链接器等配置，日常开发可实现**秒级热重载**。 | **快** |
| **应用体积** | **天生小，可更小**。基础应用仅 **3-10 MB**，通过优化配置可进一步压缩。 | **非常小** |

所以，不必被“Rust 编译很慢”的传言劝退。**首次构建的等待换来的是日常开发的高效流畅和最终产物的极致轻量**，这对于追求性能和应用体积的开发者来说，是一个非常值得的权衡。

如果你在配置过程中遇到任何具体问题，比如找不到配置文件位置或优化后效果不明显，可以随时再来问我。