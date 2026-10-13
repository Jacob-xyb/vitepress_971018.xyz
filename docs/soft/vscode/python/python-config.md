# VSCode Python 解释器配置详解

按 `Python: Select Interpreter` 选完解释器之后遇到的各种问题，都在这里排查。

---

## 🔍 验证：解释器选上了没？

不管你接下来做什么操作，**先验证当前解释器状态**。

### 招数 1：看右下角状态栏

VSCode 右下角应该显示类似 `Python 3.11.5 (.venv)` 的字样。

> ⚠️ **关键前提**：状态栏的 Python 信息**只在打开 `.py` 文件时才显示**。
>
> 如果你当前打开的是 `.md`、`.txt`、`.json`、或者根本没打开任何文件，状态栏**不会出现** Python 信息——这是正常现象，不是 bug。
>
> 所以检查状态栏前，先 `Ctrl+Shift+E` 打开资源管理器，双击一个 `.py` 文件让编辑器显示 Python 代码，再看右下角。

- **显示了 `Python 3.X.X (.venv)` 类似的字样** → 当前就是这个解释器，没问题 ✅
- **显示 `Python 3.X.X` 但没路径** → 没选环境，会用默认 Python
- **打开 `.py` 后右下角完全没显示 Python 字样** → Python 扩展没装/没启用 ❌

### 招数 2：在终端里验证

打开 VSCode 的内置终端（`` Ctrl+` ``），执行：

::: code-group
```bash [macOS / Linux]
which python
python -c "import sys; print(sys.executable)"
```
```bash [Windows (PowerShell)]
where.exe python
python -c "import sys; print(sys.executable)"
```
:::

**期望输出**：

```
# macOS / Linux
/your/project/.venv/bin/python
/your/project/.venv/bin/python

# Windows
C:\your\project\.venv\Scripts\python.exe
C:\your\project\.venv\Scripts\python.exe
```

如果路径**不含 `.venv`** 或指向系统 Python，说明选择没生效。

### 招数 3：测一下 import 路径

新建一个临时文件 `test_env.py`：

```python
import sys
print("Python:", sys.executable)
print("Prefix:", sys.prefix)        # 虚拟环境会指向 .venv
print("Base Prefix:", sys.base_prefix)  # 系统的 Python
```

`.venv` 激活正确时，`sys.prefix` 和 `sys.base_prefix` **应该是不同的路径**。如果一样，说明走的是系统 Python。

---

## 💾 VSCode 是怎么记住你的选择的？

很多人用了一年 VSCode 都不知道 `Python: Select Interpreter` 把信息存到了哪里。答案比想象中复杂：

| 你打开的是 | 选择存到哪里 | 重启后 |
| :--- | :--- | :--- |
| **文件夹**（`File → Open Folder`） | VSCode 的"工作区存储"（隐藏目录，**不一定**写到 `.vscode/settings.json`） | ✅ 记住（但你可能看不到配置文件） |
| **单个文件**（`File → Open File`） | VSCode 内存 | ❌ 丢失，要重选 |

**判断方法**：看 VSCode **标题栏**——

- 显示 `你的项目名 - Visual Studio Code` → 打开了文件夹 ✅
- 显示 `文件路径 + 文件名 - Visual Studio Code` → 只打开了单个文件

### 打开了文件夹但没看到 .vscode/settings.json？

这**不代表 VSCode 没记住**。

VSCode Python 扩展通常把选择存在**工作区存储**（workspaceStorage）里——一个 SQLite 数据库文件，而不是写进 `.vscode/settings.json`。所以你看不到 `.vscode/` 目录是**正常现象**，不代表没生效。

#### 工作区存储的真实路径

::: code-group
```text [Windows]
%APPDATA%\Code\User\workspaceStorage\<工作区哈希>\state.vscdb
```
```text [macOS]
~/Library/Application Support/Code/User/workspaceStorage/<工作区哈希>/state.vscdb
```
```text [Linux]
~/.config/Code/User/workspaceStorage/<工作区哈希>/state.vscdb
```
:::

`<工作区哈希>` 是 VSCode 根据项目路径生成的一串字符，每个项目都不一样。

### 怎么验证到底记住没？

#### 方法 1：直接看数据库（最准确）

打开上面路径里的 `state.vscdb`（这是个 SQLite 文件，可以用任何 SQLite 工具打开），执行：

```sql
SELECT * FROM ItemTable WHERE key LIKE '%interpreter%';
```

里面会有类似这样的记录：

```json
{"version": 1, "value": "python.selectedInterpreterPath", "key": "MementoStore|ms-python.python|/.../.venv/bin/python"}
```

`value` 字段就是你上次选择的解释器路径。

#### 方法 2：鼠标悬停状态栏（最简单）

1. 打开任意 `.py` 文件
2. **把鼠标悬停在右下角的 `Python 3.X.X (...)` 上**（不要点击）
3. 弹出 tooltip 会显示**完整的解释器路径**，例如：
   ```
   Python 3.11.5 (.venv)
   /home/your/project/.venv/bin/python
   ```

这种方法**完全不需要重启**，随时可以查。

#### 方法 3：Command Palette

`Ctrl+Shift+P` → 输入 **Python: Show Interpreter**，部分版本会显示当前生效的解释器。

#### 方法 4：完全重启验证

如果上面方法都不想用，就用最初介绍的"重启验证法"：

1. 完全退出 VSCode（所有窗口都关掉）
2. 重新打开**同一个文件夹**
3. 打开一个 `.py` 文件
4. 看右下角状态栏：
   - **还显示你选的那个解释器**（比如 `Python 3.11 (.venv)`） → 记住了 ✅
   - **变了**或者没显示 → 没记住 ❌，要手动配置

### 如果想让选择写进 .vscode/settings.json（可见、可共享）

直接手动创建这个文件。在项目根目录下新建 `.vscode/settings.json`：

```json [.vscode/settings.json]
{
    "python.defaultInterpreterPath": ".venv/bin/python"
}
```

Windows 上改成：

```json [.vscode/settings.json]
{
    "python.defaultInterpreterPath": ".venv\\Scripts\\python.exe"
}
```

写完后重启 VSCode，VSCode 会使用这个配置。

> 💡 **写进 settings.json 的好处**：可以提交到 Git，团队成员 clone 仓库后不用各自选解释器。

#### ⚠️ 优先级：手动选择 vs settings.json

如果你**先用 `Python: Select Interpreter` 选了别的解释器**，又**在 `.vscode/settings.json` 里写了 `python.defaultInterpreterPath`**——**手动选择优先级更高**，settings.json 不会生效。

优先级从高到低：

| 优先级 | 来源 | 怎么生效 |
| :--- | :--- | :--- |
| 🥇 **最高** | 工作区存储里的手动选择（state.vscdb） | `Python: Select Interpreter` |
| 🥈 中 | `.vscode/settings.json` 里的 `python.defaultInterpreterPath` | 手写 settings.json |
| 🥉 低 | 用户级 settings.json 里的 `python.defaultInterpreterPath` | 手写用户配置 |
| ⬇️ 兜底 | 系统 PATH 里的 `python` | 系统默认 |

#### 怎么"取消"手动选择，让 settings.json 生效？

##### 方法 1：用专用命令（推荐）

`Ctrl+Shift+P` → 搜索并执行：

```
Python: Clear Workspace Interpreter Setting
```

执行完后，VSCode 会重新走 `python.defaultInterpreterPath` 配置。

> 💡 VSCode 1.96+ 的命令名可能略有不同，也可能叫 **Python: Reset Interpreter Storage**，试试搜 "clear" 或 "reset" 找。

##### 方法 2：手动删除 state.vscdb 里的记录

打开 `state.vscdb`（SQLite），执行：

```sql
DELETE FROM ItemTable WHERE key LIKE '%selectedInterpreterPath%';
```

保存后重启 VSCode。

##### 方法 3：直接删掉整个 state.vscdb

最暴力但有效——找到对应工作区哈希的 `state.vscdb`，整个删掉。VSCode 重启时会自动重建一个空的。

⚠️ **不推荐**：会丢失这个工作区的所有其他 VSCode 状态（GitLens 缓存、布局等）。

##### 方法 4：再用 Select Interpreter 选回 settings.json 里的那个

如果你知道 settings.json 里写的是哪个，直接 `Python: Select Interpreter` 选同一个就行。VSCode 不会重新查 settings.json，但它俩的"值"变成一样，效果上等价于用 settings.json。

---

## 🧐 常见原因排查

如果上面三招确认选择没生效，按这个表排查：

| 现象 | 大概率原因 | 怎么验证 |
| :--- | :--- | :--- |
| **Pylance 没装/没启用** | 没有 Pylance，VSCode 不会重新分析代码 | 看扩展面板里 Pylance 是否启用 |
| **选的是同一个解释器** | 状态本来就没变化 | 看状态栏显示的版本号是否相同 |
| **没打开工作区文件夹** | 单文件模式没有 `.vscode/` 配置 | 看标题栏是否显示文件夹名 |
| **Python 扩展出错** | 扩展本身有问题 | 看 **Output → Python** 面板 |
| **环境还没真正创建** | 选了一个 `.venv` 但目录不存在 | 看 `.venv/` 目录下有没有内容 |
| **多 Python 扩展冲突** | 装了多个 Python 扩展（比如 Python + Pylance + 别的） | 看扩展面板里 Python 类的扩展 |

---

## 🔧 手动配置（绕过 GUI）

如果上面都查不出问题，**最稳的办法是直接写 `settings.json`**：

1. 按 `Ctrl+Shift+P` → **Preferences: Open User Settings (JSON)**
2. 加入下面这段：

```json [settings.json]
{
    "python.defaultInterpreterPath": ".venv/bin/python"
}
```

Windows 上改成：

```json [settings.json]
{
    "python.defaultInterpreterPath": ".venv\\Scripts\\python.exe"
}
```

保存后**重启 VSCode**，VSCode 会默认用这个解释器。

> 💡 **项目级配置更好**：把上面的 JSON 写到 `.vscode/settings.json`（项目根目录），而不是用户级配置。这样每个项目可以有不同的解释器，团队协作时也方便。

```bash [项目级配置文件结构]
your-project/
├── .venv/
├── .vscode/
│   └── settings.json    ← 写在这里
├── main.py
└── requirements.txt
```

---

## 🐍 多 Python 版本共存

如果你的机器上有 Python 3.9 / 3.11 / 3.12 多个版本，VSCode 选择时容易混乱：

### 方案 A：用 `pyenv` / `pyenv-win` 管理（推荐）

```bash [安装 pyenv-win (Windows)]
# PowerShell (管理员)
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"
& "./install-pyenv-win.ps1"
```

安装完后：

```bash [常用命令]
# 列出已安装的 Python
pyenv versions

# 安装新版本
pyenv install 3.12.0

# 设置当前项目用的版本
pyenv local 3.12.0

# 查看所有可用版本
pyenv install --list
```

### 方案 B：手动指定完整路径

如果不想装 `pyenv`，直接告诉 VSCode 用哪个：

```json [settings.json]
{
    "python.defaultInterpreterPath": "C:\\Python311\\python.exe"
}
```

---

## ⚠️ 终极排查清单

如果以上都没解决，按顺序试：

1. **重启 VSCode 窗口**（`Ctrl+Shift+P` → `Developer: Reload Window`）
2. **完全退出再重启 VSCode**（所有窗口都关掉）
3. 看 **Help → Toggle Developer Tools → Console** 有没有报错
4. 禁用其他 Python 相关扩展，只留官方 `Python` 和 `Pylance`
5. 重新安装 Python 扩展

---

## 💻 终端默认 shell：建议改 PowerShell

### VSCode 默认是 cmd.exe，但 2026 年应该改

VSCode 在 Windows 上的默认终端是 `cmd.exe`——但这个默认已经过时了，建议改成 **PowerShell**：

| | cmd.exe | PowerShell |
| :--- | :--- | :--- |
| **状态** | 微软已停止功能更新 | PowerShell 7+ 仍在活跃维护 |
| **跨平台** | 仅 Windows | 也支持 Linux/macOS |
| **能力** | 弱（批处理） | 完整的脚本语言 |
| **VSCode 渲染** | 基础 | 更好（彩色、Unicode） |

### 怎么改

`Ctrl+Shift+P` → 搜 **Terminal: Select Default Profile** → 选 **PowerShell**。

之后 `` Ctrl+` `` 打开终端，默认就是 PowerShell。

### ⚠️ 可能踩的坑：执行策略（先验证有没有）

PowerShell 默认有个"执行策略"，某些 Windows 配置下会禁止运行 `.ps1` 脚本，导致激活 venv 失败。

**但不是所有人都会遇到**——Windows 11 通常默认是 `RemoteSigned`，直接就能跑。

#### 第一步：先验证当前策略

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

#### 第二步：只在需要时执行修复

只有返回 `Restricted` 才需要执行：

```powershell [只影响当前用户]
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

执行后再激活 venv 就正常了。

> 💡 如果你之前用 `cmd.exe`，激活命令是 `venv\Scripts\activate.bat`（直接能跑）。
> 切到 PowerShell 后要用 `venv\Scripts\Activate.ps1`，所以**如果执行策略是 `Restricted`，必须先解决**才能激活 venv。

### 🤔 为什么 VSCode 终端不会自动激活 venv？

很多人发现：明明在 VSCode 里选了 `.venv` 解释器，但 `` Ctrl+` `` 打开终端，提示符前面**没有 `(.venv)`**——VSCode 没有自动激活虚拟环境。

这是**默认行为**，但可以配置。

#### VSCode 的"解释器选择"只影响：

| 影响 | 不影响 |
| :--- | :--- |
| ✅ 状态栏显示 | ❌ 终端里的 `python` |
| ✅ 调试时用的 Python | ❌ 终端是否自动激活 venv |
| ✅ IntelliSense / Pylance 分析 | |
| ✅ 运行/调试按钮 | |

---

#### ⚠️ VSCode 的官方自动激活设置（经常不灵）

VSCode Python 扩展有个**官方设置**可以让终端自动激活 venv：

```json [.vscode/settings.json]
{
    "python.terminal.activateEnvironment": true
}
```

理论上打开新终端时，VSCode 会自动跑激活脚本。

**但是很多人（包括我）设了之后发现还是不生效**——这是个**长期存在的可靠性问题**。

> ⚠️ **⚠️ 关键：必须写在项目级 `.vscode/settings.json`，不能写用户级 ⚠️ ⚠️**
>
> 这个设置在用户级（`settings.json` 在用户目录下）经常不生效——VSCode 在用户级和项目级都用同名设置时，会优先用项目级，**但某些版本对用户级的 `python.terminal.*` 系列处理有 bug**。
>
> 写在用户级不生效 + 没任何错误提示 = 浪费几个小时排查——这个坑**确实该骂**。

##### 常见"不生效"原因

| 不生效的原因 | 怎么排查 |
| :--- | :--- |
| **设到了错误的位置** | 这个设置应该写在**项目级** `.vscode/settings.json`，不是用户级（见上面的 ⚠️） |
| **没完全重启 VSCode** | 设完必须 `Ctrl+Shift+P` → `Developer: Reload Window`，最好完全退出再开 |
| **Python 扩展版本太旧** | 更新扩展到最新版 |
| **终端已经被打开过** | 自动激活只对**新开**的终端生效；已有的终端不会重新激活，必须关掉重开 |
| **PowerShell 执行策略** | PowerShell 默认禁止 `.ps1`，激活脚本直接失败（前面"执行策略"小节有解法） |
| **选了解释器但没装 venv** | `.venv` 目录根本不存在 |

**排查流程**：

1. 确认设置在 `.vscode/settings.json`（项目级），不是用户级
2. 完全退出 VSCode 再开
3. 检查 `.venv/` 目录真的存在
4. 如果是 PowerShell，执行 `Get-ExecutionPolicy`，确认不是 `Restricted`
5. 关闭所有终端，**新建**一个终端（不重用旧的）
6. 还不行？→ 用下面的"方法 1/方法 2"

---

#### 方法 1：手动激活（最直接、最可靠）

放弃折腾自动激活，每次打开终端 `` Ctrl+` `` 后执行一次：

::: code-group
```powershell [Windows PowerShell]
.venv\Scripts\Activate.ps1
```
```bash [macOS / Linux]
source .venv/bin/activate
```
:::

激活后提示符前面会出现 `(.venv)` 字样。

**优点**：永远有效，不依赖任何配置。
**缺点**：每次开终端都要执行一次。

---

#### 方法 2：用 `direnv` 自动激活（推荐频繁切换项目的人）

`direnv` 是一个 shell 工具，根据当前所在目录自动加载/卸载环境变量。

- 进入项目目录 → 自动激活 venv
- 离开项目目录 → 自动退出 venv
- 切到别的目录 → 自动处理那个目录的环境

安装和使用：

```bash [安装 direnv]
# macOS
brew install direnv

# Ubuntu / Debian
sudo apt install direnv

# Windows
choco install direnv
```

然后在项目根目录创建 `.envrc`：

```bash [.envrc] [macOS / Linux]
source .venv/bin/activate
```

或 Windows：

```bash [.envrc]
. .venv/Scripts/activate.ps1
```

进入目录时会提示 `direnv: error .envrc is not allowed`，执行：

```bash
direnv allow .
```

以后再进这个目录就自动激活了。

---

## ⚙️ settings.json 里的两个相关配置

`.vscode/settings.json` 里有**两个常被混淆的配置**，明确一下：

```json [.vscode/settings.json]
{
    "python.venvPath": ".",
    "python.defaultInterpreterPath": ".venv/bin/python"
}
```

### `python.venvPath`：告诉 VSCode 去哪里找 venv

值应该是 **venv 所在的父目录**（常见是 `.`），让 VSCode 自动扫描到 `.venv/` 这样的目录。

如果你的 venv 在 `envs/` 下，那就写：

```json
{
    "python.venvPath": "envs"
}
```

设置后打开 Select Interpreter 下拉菜单，VSCode 就会列出所有扫到的 venv。

### `python.defaultInterpreterPath`：直接指定用哪个解释器

值是**解释器的完整路径**，不经过扫描，直接用。

| 平台 | 值 |
| :--- | :--- |
| macOS / Linux | `.venv/bin/python` |
| Windows | `.venv\\Scripts\\python.exe` |

设置后 VSCode 直接用这个，跳过下拉菜单。

### 两个同时设置会怎样？

VSCode **优先用 `defaultInterpreterPath`**，但 `venvPath` 仍然决定下拉菜单能列出哪些 venv。

### ⚠️ 这两个配置都不会自动激活终端

无论设了哪个，**终端还是不会自动激活 venv**。它们只影响 VSCode 的解释器选择，不影响终端的环境。

要激活终端 venv，只能走前面"方法 1（手动激活）"或"方法 2（direnv）"。

#### 方法 3：用 `direnv` / `autoenv` 等工具

属于进阶玩法，不展开了。
