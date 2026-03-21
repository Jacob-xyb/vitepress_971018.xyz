# Go 环境配置

Go 的环境配置非常简单，**全程只需 5 分钟即可完成**。相比 Rust 需要安装 `rustup`、配置多个环境变量、等待漫长的编译过程，Go 的安装体验堪称"开箱即用"。

---

## 🆚 Go vs Rust：环境配置对比

| 对比项 | **Go** | **Rust** |
|--------|--------|----------|
| **安装方式** | `apt install golang-go` 或下载压缩包解压 | 需要先安装 `rustup`（官方脚本），再用 `rustup` 管理工具链 |
| **版本管理** | 系统包管理器直接搞定，或手动下载 | 必须通过 `rustup`，有 stable/beta/nightly 三通道 |
| **环境变量** | 只需配置 `GOPATH`（可选），Go 1.11+ 后模块化场景甚至不需要 | `CARGO_HOME`、`RUSTUP_HOME`、`PATH` 等都需要关心 |
| **编译缓存** | 临时目录，可随时清理，通常几百 MB | `target` 目录动辄几个 GB，难以清理 |
| **IDE 配置** | 装一个 Go 扩展，自动提示安装工具链 | 需要单独安装 `rust-analyzer`、`lldb` 等，配置复杂 |
| **国内网络** | 设置 `GOPROXY` 一行命令搞定 | 需要配置 `rustup` 镜像、crates.io 镜像，多个地方分别设置 |

> 💡 **形象比喻**：Rust 的配置流程就像"自己组装一台电脑"——灵活但繁琐；而 Go 的配置更像是"买一台预装好的品牌机"——开箱即用。

---

## 🚀 Go 环境配置（全程 5 分钟）

### 1️⃣ 安装 Go

::: code-group

```bash [Ubuntu/Debian]
# 最简单的方式
sudo apt update
sudo apt install golang-go -y
go version   # 验证安装
```

```bash [macOS]
# 使用 Homebrew（推荐）
brew install go

# 或下载 pkg 安装包
# 从 https://go.dev/dl 下载对应架构的版本（Intel 选 amd64，M1/M2 选 arm64）
```

```bash [Windows]
# 下载 .msi 安装包，双击安装
# 自动配置 PATH，无需任何手动配置
# 下载地址：https://go.dev/dl
```

:::

### 2️⃣ 配置环境变量（可选，但推荐）

编辑 `~/.bashrc` 或 `~/.zshrc`：

```bash
export GOPATH=$HOME/go          # 工作目录（存放你的代码）
export PATH=$PATH:$GOPATH/bin   # 把 Go 工具加入 PATH
```

然后执行 `source ~/.bashrc` 生效。

::: warning
⚠️ 注意：`GOROOT`（Go 安装目录）**不需要**手动配置！安装程序会自动处理。
:::

### 3️⃣ 配置国内代理（加速依赖下载）

::: tip
这是**唯一可能需要额外操作**的步骤，但只需要一行命令即可搞定。
:::

```bash
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOSUMDB=sum.golang.google.cn
```

### 4️⃣ 安装 IDE 工具（VSCode）

1. 安装 [VSCode](https://code.visualstudio.com/)
2. 安装 **Go 扩展**（作者：Go Team at Google）
3. 打开任意 `.go` 文件，右下角会提示"分析工具缺失，是否安装？"
4. 点击 **Install All**，自动安装 `gopls`（语言服务器）、`dlv`（调试器）等所有必要工具

**🎉 至此，环境配置完成！** 整个过程不超过 5 分钟。

---

## 🧪 验证：跑一个 Hello World

```bash
# 创建项目
mkdir hello && cd hello
go mod init hello                    # 初始化模块

# 创建 main.go
cat > main.go << 'EOF'
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
EOF

# 运行（直接运行，无需编译步骤）
go run main.go
```

::: tip
**对比 Rust**：Rust 需要 `cargo new` → `cargo build` → 再到 `target/debug` 里找可执行文件，多了一步编译流程。
:::

---

## 📦 日常开发命令对比

| 操作 | Go 命令 | Rust 对应命令 |
|------|---------|--------------|
| 运行代码 | `go run .` | `cargo run` |
| 编译 | `go build` | `cargo build`（生成几十 MB 的 target 目录） |
| 格式化 | `go fmt` | `cargo fmt` |
| 检查错误 | `go vet` | `cargo check` |
| 添加依赖 | `go get github.com/xxx` | 编辑 `Cargo.toml` + `cargo build` |
| **清理缓存** | `go clean -cache`（几百 MB） | `cargo clean`（几个 GB 😢） |

> 💡 最重要的区别：**Go 没有类似 `target` 的庞然大物**。编译缓存放在系统临时目录，`go clean -cache` 随时清理，完全不心疼。

---

## 🎯 适用场景

Go 的设计哲学非常适合以下场景：

| 痛点 | Go 如何解决 |
|------|-------------|
| Python 性能低 | Go 性能接近 Rust，goroutine 并发处理日志文件极快 |
| Python 打包体积大 | 编译后单文件 5-15MB，跨平台分发一条命令搞定 |
| Rust 编译慢 | `go build` 秒级完成，没有漫长的等待 |
| Rust 缓存 3GB | Go 缓存几百 MB，随时可清，不占空间 |
| 环境配置麻烦 | 5 分钟搞定，无需 rustup、无需折腾链接器 |

---

## 💡 总结

**Go 的环境配置哲学是"让新手也能 3 分钟上手"**——安装包自带编译器、自动配置 PATH、标准化的项目结构、一个命令解决依赖。

Go 的"够用就好"哲学，特别适合：
- 📝 日志分析工具
- 🌐 网络服务 / API 开发
- 🔧 命令行工具（CLI）
- ☁️ 云原生应用

---

## 📚 相关资源

- [Go 官方网站](https://go.dev/)
- [Go 中文社区](https://go-zh.org/)
- [Go 语言圣经](https://books.studygolang.com/gopl-zh/)
