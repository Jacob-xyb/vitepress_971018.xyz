<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-20 16:42:35
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-20 16:46:44
 * @Description: Life is struggle.
-->
# Rust 安装手册

## Rust 指定安装路径

Rust **完全可以安装到其他盘**，不是必须装在C盘。

默认装在C盘只是为了开箱即用，对普通用户最省事。但如果你想自己控制安装位置，有两种方法可以实现：

### 💡 方法一：安装前指定路径（推荐）
这是最干净、最推荐的方式。在运行 `rustup-init.exe` 安装程序**之前**，先设置两个系统环境变量：

| 环境变量 | 作用 | 示例值 |
| :--- | :--- | :--- |
| `CARGO_HOME` | 指定 `cargo` 命令和依赖包的存放位置 | `D:\rust\.cargo` |
| `RUSTUP_HOME` | 指定 `rustup` 工具链本身的存放位置 | `D:\rust\.rustup` |

设置好这两个变量后，再正常启动安装程序，Rust 的所有文件就会乖乖地装到你指定的 D 盘了。

### 🔧 方法二：安装后迁移
如果已经安装在C盘，也不想重装，可以手动搬家。步骤如下：
1.  **停止使用**：关闭所有命令行、代码编辑器（如VS Code）和开发工具。
2.  **移动文件夹**：将 `C:\Users\你的用户名\.cargo` 和 `C:\Users\你的用户名\.rustup` 这两个文件夹**剪切**到目标位置，例如 `D:\rust\`。
3.  **修改环境变量**：在系统环境变量中，新建 `CARGO_HOME` 和 `RUSTUP_HOME`，并将它们的值分别设置为新的路径（如 `D:\rust\.cargo` 和 `D:\rust\.rustup`）。
4.  **更新 PATH 变量**：在 `PATH` 环境变量中，找到并更新旧的 `C:\Users\...\.cargo\bin` 路径为新的 `D:\rust\.cargo\bin`。

完成这些后，打开一个新的命令行窗口，输入 `rustc --version` 验证一下，能正常显示版本号就说明搬家成功了。

## 使用镜像

Rust安装慢，通常是因为 `rustup` 默认从国外服务器下载工具链，在国内访问速度很不稳定。可以通过**配置国内镜像源**来加速，这是最有效的方法。

### 🚀 方法一：使用国内镜像源（推荐，无需代理）

在运行 `rustup-init.exe` **之前**，设置两个环境变量，让 `rustup` 从国内镜像站下载。

#### 对于 Windows 用户（图形界面操作）
1. 打开“系统属性” → “高级” → “环境变量”。
2. 在“系统变量”或“用户变量”中，**新建**以下两个变量：

| 变量名 | 变量值（以中科大源为例，也可选其他） |
| :--- | :--- |
| `RUSTUP_DIST_SERVER` | `https://mirrors.ustc.edu.cn/rust-static` |
| `RUSTUP_UPDATE_ROOT` | `https://mirrors.ustc.edu.cn/rust-static/rustup` |

3. 确认保存后，**重新打开**命令行窗口（让环境变量生效），再运行安装程序或 `rustup` 命令，速度会明显提升。

> **其他国内镜像源备选**（任选一组，将上面的值替换即可）：
> - **清华源**：`https://mirrors.tuna.tsinghua.edu.cn/rustup`
> - **上海交大源**：`https://mirrors.sjtug.sjtu.edu.cn/rust-static`

#### 对于命令行临时设置（一次性）
如果你想在本次命令行窗口快速安装，可以不修改系统环境变量，直接在当前终端执行（Windows CMD）：
```cmd
set RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
set RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
rustup-init.exe
```

### 🔌 方法二：使用代理
如果你有 HTTP/HTTPS 代理，可以通过环境变量让 `rustup` 走代理：
```cmd
set HTTP_PROXY=http://127.0.0.1:你的代理端口
set HTTPS_PROXY=http://127.0.0.1:你的代理端口
```
然后再执行安装命令。

### 💡 组合使用（自定义路径 + 加速）
结合你之前关心的安装位置问题，可以在安装前一次性设置好所有环境变量，达到“指定安装盘 + 加速下载”的效果：
```cmd
set CARGO_HOME=D:\rust\.cargo
set RUSTUP_HOME=D:\rust\.rustup
set RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
set RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
rustup-init.exe
```

设置完成后，安装应该会快很多。如果仍然很慢，可以尝试切换不同的镜像源。

> 💡 除了 rustup 镜像，crates.io 依赖下载也可以配置国内镜像加速，详见 [Rust 编译](./rust-compile.md)。

## ✅ 验证设置是否生效

### 检验环境变量是否正确

打开**新的**命令行窗口（不是之前打开的那个），执行以下命令：

```cmd
echo %CARGO_HOME%
echo %RUSTUP_HOME%
echo %RUSTUP_DIST_SERVER%
```

如果显示的是你设置的值，说明环境变量已经生效。

### 检验 Rust 是否正常工作

```cmd
rustc --version
cargo --version
rustup --version
```

能正常显示版本号，说明 Rust 安装成功。

### ⚠️ 设置后不生效的常见原因

| 原因 | 解决方法 |
| :--- | :--- |
| **命令行窗口未关闭** | 关闭所有 CMD/PowerShell 窗口，重新打开 |
| **环境变量编辑错误** | 检查变量名拼写是否正确，确认没有多余空格 |
| **设置了变量但又修改了 PATH** | 确保 PATH 中指向的是新的 `.cargo\bin` 路径 |
| **安装程序已用旧配置缓存运行** | 删除已安装的文件，重新运行 `rustup-init.exe` |
| **系统环境变量 vs 用户变量混淆** | 确认是在"系统变量"还是"用户变量"中设置，互相不影响 |

## 🔄 何时需要重启电脑

大多数情况下，**不需要重启电脑**，只需要关闭并重新打开命令行窗口即可。

但以下情况需要重启：

| 场景 | 是否需要重启 |
| :--- | :--- |
| 修改了 `PATH` 环境变量 | 一般不需要，关闭再打开命令行即可 |
| 新增了 `CARGO_HOME` / `RUSTUP_HOME` | 不需要 |
| 新增了 `RUSTUP_DIST_SERVER` / `RUSTUP_UPDATE_ROOT` | 不需要 |
| 修改了 `PATH` 后 VS Code 终端不认 | 仅需**重启 VS Code**，不需要重启电脑 |
| 环境变量完全不生效，排查无果 | 作为最后的尝试手段，可以重启电脑 |
| 修改了系统级别的环境变量（管理员权限） | 可能需要重启相关程序 |

> 💡 **小技巧**：如果修改环境变量后命令行窗口是**一直开着**的，那么即使重启电脑也需要重新打开命令行才能读到新变量。确保用**新的**命令行窗口测试！