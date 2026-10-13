# VSCode 插件离线下载

## 为什么需要离线下载

VSCode 自带的插件市场在以下场景下装不了插件：

- 🌐 **网络受限**：公司内网/防火墙拦截了 VSCode 插件市场
- 🐢 **下载极慢**：扩展体积大、跨地区下载耗时严重
- 💻 **离线/隔离环境**：没有公网，只能靠 U 盘搬运
- 🚚 **批量部署**：要给十几台机器装同一批插件，逐个点击不现实

解决思路很简单：**把扩展文件（`.vsix`）下载到本机** → 拷到目标机器 → 让 VSCode 安装这个本地文件。

---

## 📦 下载扩展文件的几种方式

下面按"从简单到复杂"排列，挑一个适合你的就行。

---

### 方式 1：在 VSCode 里直接下载（最简单）

如果你现在能打开 VSCode，并且能搜到目标扩展，这是最快的方式。

**步骤**：

1. 打开 VSCode，按 `Ctrl+Shift+X` 打开扩展面板
2. 在搜索框输入你想要的扩展名字（比如 `python`、`chinese`）
3. **右键**点击你想要的扩展（不要点"Install"，那会直接装上）
4. 在弹出的菜单里找 **Download VSIX** 这一项（中文显示为"下载 VSIX"）
5. 选择保存位置，VSCode 会把扩展保存为一个 `.vsix` 文件

> ⚠️ **"Download VSIX" 选项只在较新版本的 VSCode 才有**（大约 1.96 及以上）。如果你右键菜单里没看到这一项，请用方式 2。

#### ⚠️ 关于版本选择

VSCode 右键下载的是**当前列表里显示的那个版本**——也就是**最新版**（如果还没装），或**已经装上的那个版本**（如果已经装过）。

如果你想要**某个特定的历史版本**：

1. 在扩展面板里点击这个扩展（不是右键，是左键点名字），打开它的详情页
2. 详情页右上角找 **Install Another Version**（安装其他版本）链接
3. 在弹出的列表里选你想要的版本，VSCode 会自动装上
4. 装好之后再右键 → **Download VSIX**，下下来的就是那个版本

---

### 方式 2：在网页上找插件，VSCode 接管下载

> 💡 **关键认知**：VSCode 插件市场网页**没有"Download"按钮**。但网页可以**唤起 VSCode**，由 VSCode 来下载和选版本。

#### 工作流程

```
网页找插件 → 点击页面上的 Install 按钮
       ↓
VSCode 自动打开（通过 vscode:// 协议）
       ↓
VSCode 里选版本、下载或安装
```

#### 第一步：打开插件市场网页

浏览器访问：

```
https://marketplace.visualstudio.com/vscode
```

或者直接打开首页 `https://marketplace.visualstudio.com`，点上面的 **Visual Studio Code** 标签。

#### 第二步：搜索插件

页面顶部搜索框输入关键字：

- 搜 `python` → 找到 Python 插件
- 搜 `chinese` → 找到中文语言包
- 搜 `theme` → 找到各种主题

#### 第三步：进入详情页，记下关键信息

点击你看中的那个插件，进入详情页。右侧 **More Info** 区域会显示：

| 字段 | 含义 | 例子（Python Debugger） |
| :--- | :--- | :--- |
| **Version** | 当前版本号 | `2026.7.12811010` |
| **Unique Identifier** | 插件唯一标识 | `ms-python.debugpy` |
| **Publisher** | 发布者 | `Microsoft` |
| **Last updated** | 最后更新时间 | `2026/10/8` |

#### 第四步：让 VSCode 接管

详情页通常有一个绿色的 **Install** 按钮：

- **直接点击 Install** → 浏览器会触发 `vscode://` 协议，**VSCode 自动打开**并准备安装最新版

如果你想下载到本地而不是直接安装：

- **复制详情页的 URL**（形如 `https://marketplace.visualstudio.com/items?itemName=ms-python.debugpy`）
- 打开 VSCode
- 按 `Ctrl+Shift+P`，执行 **Extensions: Install from Location...**（从位置安装 VSIX）
- 选择之前记下的 Identifier 和 Version，用方式 1 的"先装指定版本，再下载 VSIX"思路操作

或者更直接：

- 把详情页 URL 粘到 VSCode 命令面板的某些命令里，让 VSCode 解析并下载

> ⚠️ **关键约束**：不管怎么操作，**真正下载 `.vsix` 的动作都在 VSCode 里发生**，不是在浏览器里。浏览器只是个"跳转入口"。

---

### 方式 2 备选：从 GitHub Releases 下载（碰运气）

> ⚠️ **GitHub 上的源码 ≠ `.vsix` 扩展**。源码是给人读的代码，不能直接装。
>
> 但**很多扩展作者**会把打包好的 `.vsix` 也上传到 GitHub Releases 的 Assets 区域，**碰碰运气**说不定就有。

#### 操作步骤

1. 在 Marketplace 详情页找到 **Project Details**（项目详情）链接
2. 点进去跳到 GitHub 仓库
3. 在仓库右侧或顶部找到 **Releases**（或直接访问 `https://github.com/<owner>/<repo>/releases`）
4. 选一个版本，点开详情
5. **往下滚动到页面最底部的 Assets 区域**——这里可能有 `.vsix` 文件
6. 点击下载

#### 找到 vsix 是什么样？

GitHub Releases 的 Assets 区域通常列出几个文件：

```
Source code (zip)
Source code (tar.gz)
xxx.vsix        ← 这就是要的
```

#### 找不到怎么办？

- 这个扩展的作者可能没上传 `.vsix` 到 Releases（很常见）
- 那就只能回到**方式 1 或方式 2**

---

## 📥 拿到 `.vsix` 后，怎么装到 VSCode

不管用上面哪种方式拿到了 `.vsix` 文件，接下来就是"安装"这一步。三种方式：

### 方法 A：图形界面（最直观）

1. 打开目标机器上的 VSCode
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 点击扩展面板右上角的 **`···`** 三个点
4. 选择 **Install from VSIX...**（从 VSIX 安装）
5. 选择你下载的 `.vsix` 文件
6. 等几秒钟，VSCode 会提示安装完成

### 方法 B：命令行（最快）

打开终端（PowerShell / CMD / Terminal），执行：

```bash [安装单个扩展]
code --install-extension 文件名.vsix
```

比如：

```bash
code --install-extension ms-python.debugpy-2026.7.12811010.vsix
```

> 💡 如果提示 `code` 命令找不到，需要先在 VSCode 里按 `Ctrl+Shift+P`，搜索 **Shell Command: Install 'code' command in PATH** 执行一次。

### 方法 C：把整个文件夹拖给 VSCode

直接把 `.vsix` 文件**拖到** VSCode 的扩展面板里，VSCode 就会自动安装。

---

## ❓ 常见问题

### 扩展装上了但不生效？

1. **完全重启 VSCode**（关掉所有窗口再开）
2. 看 VSCode 底部的通知，有时候会有"需要重启"或"需要安装依赖"的提示
3. 看 **Help → Toggle Developer Tools → Console** 里的报错

### 提示"版本不兼容"？

VSCode 版本太旧，装不了新插件。**升级 VSCode** 到最新版。

### `.vsix` 文件用什么打开？

`.vsix` 本质上是一个 `.zip` 压缩包（可以改后缀为 `.zip` 解压看里面），但**不要手动解压安装**，直接用 VSCode 的安装功能即可。

### 装完之后想卸载？

```bash
code --uninstall-extension 发布者.扩展名
```

比如：

```bash
code --uninstall-extension ms-python.debugpy
```

---

## 🎯 一句话总结

> **网页找插件 → 触发 VSCode 接管 → VSCode 里选版本、下载 `.vsix`**。

整个过程的关键认知：**真正干活的是 VSCode，不是浏览器**。网页只是个找插件和跳转到 VSCode 的入口 ✅。
