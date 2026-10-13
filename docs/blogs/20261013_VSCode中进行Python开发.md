---
title: 在 VSCode 中进行 Python 开发
description: 一站式配置 VSCode 的 Python 开发环境，覆盖解释器、虚拟环境、调试、测试、Jupyter 与常用插件
---

## 为什么选 VSCode

VSCode 并不是 Python 唯一的选择（PyCharm、JupyterLab 都很香），但它在**轻量、通用、可扩展**这三件事上做到了极好的平衡 ✨：

- **轻量**：启动快、内存占用低，老电脑也能流畅运行
- **通用**：前端、后端、脚本、文档、Markdown 都能用同一个编辑器
- **可扩展**：靠插件实现几乎所有 Python 工具链（补全、调试、格式化、测试、Notebook）

如果你不想为 Python 单独装一个 IDE，又希望拿到接近 IDE 的体验，VSCode + 几个插件就是最舒服的组合。

---

## 🛠️ 基础环境搭建

### 1. 安装 Python

::: tip 推荐使用 pyenv 管理多版本
如果你的机器上需要同时跑 Python 3.9 / 3.11 / 3.12，强烈建议装一个 `pyenv-win`（Windows）或 `pyenv`（macOS/Linux），免去反复卸载重装的烦恼。
:::

从 [Python 官网](https://www.python.org/downloads/) 下载安装包，安装时**务必勾选 `Add Python to PATH`**。

```bash [验证安装]
python --version
pip --version
```

### 2. 安装 VSCode 与 Python 插件

1. 下载 [VSCode](https://code.visualstudio.com/)
2. 安装官方插件：**Python**（由 Microsoft 发布）
3. 可选但强烈推荐安装：
   - **Pylance**：速度更快、类型推断更强的语言服务
   - **Python Debugger**：新版调试器（基于 debugpy）

安装完插件后，VSCode 会自动检测系统中的 Python 解释器，并在右下角显示当前使用的版本。

> 💡 如果你的网络环境装不上插件（比如内网/隔离环境），可以参考 [VSCode 插件离线下载](/soft/vscode/plugin/offline-download)。

---

## 🧪 虚拟环境：每个项目一个解释器

::: warning 不建议在系统 Python 里装包
系统解释器是给操作系统和工具用的，往里面塞项目依赖会引发权限问题和版本冲突。请**永远**使用虚拟环境。
:::

### 创建与激活

::: code-group
```bash [Windows (cmd)]
python -m venv .venv
.venv\Scripts\activate
```
```bash [Windows (PowerShell)]
python -m venv .venv
.venv\Scripts\Activate.ps1
```
```bash [macOS / Linux]
python -m venv .venv
source .venv/bin/activate
```
:::

激活后，终端提示符前会出现 `(.venv)`，后续所有 `pip install` 都会装进这个隔离环境。

### 选择解释器

打开命令面板（`Ctrl+Shift+P`），执行 **Python: Select Interpreter**，然后：

- 选择已存在的虚拟环境
- 或者选 **Create Virtual Environment** 让 VSCode 直接帮你创建

选好后 VSCode 的状态栏右下角会显示当前解释器路径，点击可随时切换。

### 依赖管理：requirements.txt

```bash [生成依赖清单]
pip freeze > requirements.txt
```

```bash [在新环境复现依赖]
pip install -r requirements.txt
```

进阶方案是改用 `pyproject.toml`（PEP 621）或 `poetry` / `uv`，但 `requirements.txt` 是最朴素也最通用的入门选择。

---

## 🛠️ 解释器配置：怎么选才对？

正常流程就是两步——

1. **`File → Open Folder`** 打开你的项目根目录
2. 按 `Ctrl+Shift+P` → **`Python: Select Interpreter`** → 选 `.venv/bin/python`（或 `Scripts\python.exe`）

选完之后，**打开任意一个 `.py` 文件**，看右下角状态栏：

- **显示 `Python 3.X.X (.venv)`** → 配置成功 ✅
- **状态栏没显示 Python** → 你可能没打开 `.py` 文件，或者扩展没装

> ⚠️ **关键**：状态栏的 Python 信息**只在打开 `.py` 文件时才显示**。如果当前是 `.md` / `.txt` / 空编辑器，状态栏不会显示 Python 字样——这是正常现象。

### 想让团队共享配置？写进 `.vscode/settings.json`

最稳的办法：手动在项目根目录创建 `.vscode/settings.json`：

```json [.vscode/settings.json]
{
    "python.defaultInterpreterPath": ".venv/bin/python"
}
```

Windows 上把路径换成 `.venv\\Scripts\\python.exe`。这样团队成员 clone 仓库后不用各自选解释器，提交到 Git 还能统一环境。

### 🤔 选了没反应、状态栏不变、记不住选哪个？

详细的排查流程、pyenv 多版本管理、`sys.prefix` 验证法、各种坑——都在 [VSCode Python 解释器配置详解](/soft/vscode/python/python-config) 里，**这里就不展开了**。

---

## 💻 终端默认 shell：建议改成 PowerShell

VSCode 在 Windows 上默认终端是 `cmd.exe`——但**这个默认在 2026 年已经过时了**，建议改成 PowerShell。

### 为什么要改

| | cmd.exe | PowerShell |
| :--- | :--- | :--- |
| **状态** | 已停止功能更新 | PowerShell 7+ 活跃维护 |
| **跨平台** | 仅 Windows | 也支持 Linux/macOS |
| **能力** | 弱 | 完整的脚本语言 |

### 怎么改

1. `Ctrl+Shift+P` → **Python: Select Default Profile**（或者搜 **Terminal: Select Default Profile**）
2. 选 **PowerShell**

之后 `` Ctrl+` `` 打开终端，默认就是 PowerShell 了。

### ⚠️ PowerShell 可能踩的坑：先验证有没有

PowerShell 默认有个"执行策略"——某些 Windows 配置下会禁止运行 `.ps1` 脚本，导致激活 venv 失败。

**但不是所有人都会遇到**——Windows 11 通常默认是 `RemoteSigned`，直接就能跑。

**先验证**：

`` Ctrl+` `` 打开 VSCode 终端（PowerShell），执行：

```powershell
Get-ExecutionPolicy
```

返回结果对照下表：

| 返回值 | 含义 | 需要处理吗 |
| :--- | :--- | :--- |
| `RemoteSigned` | 本地脚本可以跑（**现代 Windows 默认**） | ✅ 不用处理 |
| `Unrestricted` | 所有脚本都能跑 | ✅ 不用处理 |
| `AllSigned` | 所有脚本都要数字签名 | ⚠️ 可能要处理 |
| `Restricted` | 禁止所有脚本（**老 Windows / 公司电脑**） | ❌ 必须处理 |

**只有 `Restricted`（或类似严格策略）才需要执行**：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

这个命令**只影响当前用户**，不影响系统安全。

> 想了解终端、shell、执行策略的更多细节，看 [VSCode Python 解释器配置详解](/soft/vscode/python/python-config) 里的"终端"小节。

---

## 🖥️ 终端不自动激活 venv：正常现象

`Python: Select Interpreter` 只告诉 VSCode 用哪个 Python，但**不会自动激活终端里的虚拟环境**——这是设计如此。

> 💡 **状态栏显示 `.venv` ≠ 终端已经激活 `.venv`**。两者是独立的。

打开终端 `` Ctrl+` `` 后，你看到的提示符**通常没有 `(.venv)`**——这是正常现象。

### 怎么手动激活（最直接）

::: code-group
```powershell [Windows PowerShell]
.venv\Scripts\Activate.ps1
```
```bash [macOS / Linux]
source .venv/bin/activate
```
:::

激活后提示符前面会出现 `(.venv)` 字样。

### 想要"一劳永逸"的自动激活？

最稳的办法是装 [`direnv`](https://direnv.net/)——一个 shell 工具，进入项目目录自动激活、离开自动退出。频繁切换项目的人强烈推荐。

详细的 direnv 配置、不同 shell 的处理，看 [VSCode Python 解释器配置详解](/soft/vscode/python/python-config) 里的"终端"小节。

---

## 🚀 调试：断点、变量、调用栈全都有

VSCode 的调试体验几乎和 PyCharm 一样好，而且配置文件更轻量。

### 最简调试步骤

1. 打开要调试的 Python 文件
2. 在代码左侧行号栏点击，设置**断点**（红点）
3. 按 `F5` 启动调试
4. 调试工具栏会出现：
   - **Continue**（F5）：跳到下一个断点
   - **Step Over**（F10）：单步，不进入函数
   - **Step Into**（F11）：单步，进入函数
   - **Step Out**（Shift+F11）：跳出当前函数
   - **Stop**（Shift+F5）：结束调试

### 左侧调试面板能看什么

| 面板 | 用途 |
|------|------|
| **Variables** | 当前作用域所有变量，含类型提示 |
| **Watch** | 自定义表达式，实时求值 |
| **Call Stack** | 函数调用链 |
| **Breakpoints** | 所有断点列表，支持条件断点 |

### 条件断点

右键断点 → **Edit Breakpoint**，可以设置：

- **Expression**：`x > 100`，只有条件为真时才停
- **Hit Count**：每执行 N 次才停
- **Log Message**：不中断，只在控制台打印（`x = {x}`）

### launch.json：可复用的调试配置

VSCode 默认能直接跑 Python，但你也可以创建 `.vscode/launch.json` 来自定义参数：

```json [launch.json]
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run main.py",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "args": ["--config", "dev.yaml"],
            "cwd": "${workspaceFolder}",
            "env": {
                "PYTHONPATH": "${workspaceFolder}"
            }
        }
    ]
}
```

之后在调试面板的下拉菜单里就能选 `Run main.py`，自动带上参数和环境变量。

---

## 🧹 代码质量：格式化、Lint、类型检查

这三件事强烈建议**项目级**开启（用 `.vscode/settings.json`），让所有协作者自动统一风格。

### 格式化：Black / Ruff Format

```json [settings.json]
{
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter",
        "editor.formatOnSave": true
    }
}
```

> 如果项目用 `ruff`（更快的统一工具），把 `ms-python.black-formatter` 换成 `charliermarsh.ruff`，它能同时做格式化 + Lint + import 排序。

### Lint：flake8 / ruff / pylint

```json [settings.json]
{
    "python.linting.enabled": true,
    "python.linting.flake8Enabled": true,
    "python.linting.flake8Args": ["--max-line-length=120"]
}
```

保存后，VSCode 会在编辑器里直接标红有问题的行，鼠标悬停查看具体原因。

### 类型检查：Pylance / mypy

Pylance 默认开启 `typeCheckingMode: basic`，想要更严格可以在 `settings.json` 里：

```json [settings.json]
{
    "python.analysis.typeCheckingMode": "strict"
}
```

---

## 🧪 测试：unittest / pytest

### 配置 pytest

安装：`pip install pytest`

```json [settings.json]
{
    "python.testing.pytestEnabled": true,
    "python.testing.unittestEnabled": false,
    "python.testing.autoTestDiscoverOnSaveEnabled": true
}
```

之后打开 **Testing** 侧边栏（烧瓶图标），VSCode 会自动发现所有 `test_*.py`，每个测试旁边出现 ▶️ 按钮，单击即可运行。

### 调试测试

在测试代码里设断点 → 右键 ▶️ → **Debug Test**，就能进入 pytest 内部。

---

## 📓 Jupyter Notebook 原生支持

VSCode 的 `.ipynb` 体验已经超过了原生 JupyterLab：

- 打开 `.ipynb` 文件直接编辑
- 每个 cell 可以单独选 **Python 脚本 / Interactive** 模式
- 变量查看器、调试、断点都和 `.py` 文件打通
- 支持多内核：Jupyter、Kernal、Marimo 等

### 最爽的用法：交互窗口

打开任意 `.py`，在函数上方写 `# %%`，VSCode 就会把脚本切成可执行的 cell：

```python [带 # %% 分隔的脚本]
# %%
import pandas as pd

# %%
df = pd.read_csv("data.csv")
df.head()

# %%
df.groupby("category").sum()
```

运行 `Jupyter: Create Interactive Window` 后，左侧脚本、右侧交互结果，所见即所得 🚀。

---

## 🌟 常用插件清单

| 插件 | 作用 |
|------|------|
| **Python** | 官方扩展，必装 |
| **Pylance** | 智能补全 + 类型检查 |
| **Ruff** | 极快的 Lint + 格式化（替代 black + flake8 + isort） |
| **autoDocstring** | 自动生成函数文档字符串 |
| **Python Indent** | 比内置更聪明的缩进修正 |
| **Jupyter** | Notebook 支持（通常已自动随 Python 扩展启用） |
| **Even Better TOML** | 编辑 `pyproject.toml` 的语法高亮 |
| **GitLens** | Git 增强（任意编辑器都推荐） |
| **Error Lens** | 把错误直接显示在行尾，比悬停更直观 |

---

## 💡 实战小技巧

### 1. 一键重命名模块、变量、函数

把光标放在符号上 → 按 `F2` → 输入新名字 → 回车。整个项目所有引用同步更新（不会漏改）。

### 2. 跳转到定义 / 查看引用

- `F12`：跳到定义
- `Alt+F12`：在当前文件查看定义（不跳转）
- `Shift+F12`：查看所有引用
- `Ctrl+T`：全局符号搜索（按名字找函数、类）

### 3. 多文件重构：提取函数

选中代码 → 出现黄色灯泡 → **Extract to method / Extract variable**。VSCode 会自动分析依赖、生成函数签名。

### 4. 用代码片段（Snippet）减少重复

`Ctrl+Shift+P` → **Snippets: Configure User Snippets** → `python.json`，可以定义自己的模板，例如：

```json [python.json]
{
    "try except log": {
        "prefix": "tryexc",
        "body": [
            "try:",
            "    ${1:pass}",
            "except Exception as e:",
            "    logger.exception(e)"
        ],
        "description": "try except with logger"
    }
}
```

输入 `tryexc` + `Tab` 就能展开。

### 5. 在终端里一键运行当前文件

`Ctrl+Shift+P` → **Run Python File** → 终端里自动执行当前文件，并激活当前解释器。

### 6. 集成 Git 工具

VSCode 自带 Git UI（Source Control 侧边栏）：

- 看 diff、写 commit message、push
- 解决冲突时直接用编辑器三栏视图
- 与终端 `git` 命令完全兼容

---

## ⚙️ 项目级配置：`.vscode/` 文件夹

把团队约定放进 `.vscode/` 并提交到 Git，所有克隆仓库的协作者自动生效：

```
.vscode/
├── settings.json     # 编辑器行为（格式化、Lint、解释器）
├── extensions.json   # 推荐插件清单（VSCode 弹出提示安装）
├── launch.json       # 调试配置
└── tasks.json        # 自定义任务（如 lint / test / build）
```

### extensions.json 示例

```json [extensions.json]
{
    "recommendations": [
        "ms-python.python",
        "ms-python.vscode-pylance",
        "charliermarsh.ruff"
    ]
}
```

团队新成员打开仓库时，VSCode 会自动弹出推荐安装提示。

---

## 🆚 VSCode vs. PyCharm

| 维度 | VSCode | PyCharm |
|------|--------|---------|
| **启动速度** | ⚡ 极快 | 较慢（社区版） |
| **内存占用** | 低 | 中~高 |
| **Python 重构能力** | 基础（重命名、提取函数） | 极强（重命名参数签名同步、Pull Up/Push Down） |
| **数据库工具** | 靠插件 | 内置 DataGrip 体验 |
| **Web / 多语言** | ⚡ 一把梭 | 仅 Python 强，其他要装插件 |
| **价格** | 免费 | 社区版免费 / 专业版付费 |

> 🎯 **一句话总结**：日常 Python 脚本、数据分析、后端开发，VSCode 完全够用；做大型框架 / 复杂重构，PyCharm 还是更省心。

---

## 🎯 总结

把 VSCode 配成趁手的 Python IDE，核心就三步：

1. 装 **Python + Pylance** 扩展 → 拿到补全和类型检查
2. 用 **虚拟环境** 隔离项目依赖 → 告别版本冲突
3. 配 **`.vscode/settings.json`** 统一代码风格 → 团队协作无分歧

剩下的插件（格式化、Lint、测试、Notebook）按需添加即可。配好一次，所有项目都能复用 ✅。
