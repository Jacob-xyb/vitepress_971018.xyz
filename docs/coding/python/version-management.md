# Python 版本管理与清理

在陌生电脑上管理 Python 环境时，首先需要了解系统中已安装的 Python 版本和相关工具，然后进行清理和重新安装。

## 查询已安装的 Python 版本

### Windows 系统

#### 1. 命令行查询

```bash
# 查询 Python 版本
python --version
python3 --version

# 查询 Python 安装路径
where python
where python3

# 查看所有 Python 可执行文件
where /R C:\ python.exe
```

#### 2. 通过控制面板查看

- 打开"控制面板" → "程序和功能"
- 搜索 "Python" 查看所有已安装的 Python 版本
- 记录版本号和安装路径

#### 3. 检查环境变量

```bash
# 查看 PATH 环境变量中的 Python 路径
echo %PATH%

# 或使用 PowerShell
$env:PATH -split ';' | Select-String python
```

#### 4. 查找常见安装位置

```bash
# 检查常见安装目录
dir C:\Python*
dir "C:\Program Files\Python*"
dir "%LOCALAPPDATA%\Programs\Python"
dir "%APPDATA%\Python"
```

### macOS/Linux 系统

#### 1. 命令行查询

```bash
# 查询 Python 版本
python --version
python3 --version

# 查询安装路径
which python
which python3
which -a python  # 显示所有 python 路径

# 查看详细信息
type python
type python3
```

#### 2. 查找所有 Python 可执行文件

```bash
# macOS
mdfind "kMDItemKind == 'Application'" | grep -i python

# Linux
find /usr -name "python*" 2>/dev/null
find /opt -name "python*" 2>/dev/null
find ~ -name "python*" 2>/dev/null
```

#### 3. 使用包管理器查询

```bash
# macOS (Homebrew)
brew list | grep python

# Ubuntu/Debian
dpkg -l | grep python

# CentOS/RHEL
rpm -qa | grep python
```

## 查询 Python 相关工具

### pip 包管理器

```bash
# 查询 pip 版本
pip --version
pip3 --version

# 查看 pip 安装路径
where pip      # Windows
which pip      # macOS/Linux

# 查看已安装的包
pip list
pip freeze
```

### 虚拟环境工具

```bash
# 检查 virtualenv
virtualenv --version
which virtualenv

# 检查 conda
conda --version
conda env list

# 检查 pipenv
pipenv --version

# 检查 poetry
poetry --version
```

### IDE 和编辑器中的 Python

- VS Code: 查看设置中的 Python 解释器路径
- PyCharm: 查看项目设置中的 Python 解释器
- Jupyter: `jupyter --paths`

## 完全卸载 Python

::: warning 注意
卸载 Python 不会自动删除已创建的虚拟环境。虚拟环境是独立的目录，需要手动清理。
:::

### 清理虚拟环境

在卸载 Python 之前，建议先清理虚拟环境：

#### 查找虚拟环境

```bash
# Windows - 查找常见位置的虚拟环境
dir /s /b venv
dir /s /b .venv
dir /s /b env

# macOS/Linux
find ~ -type d -name "venv" 2>/dev/null
find ~ -type d -name ".venv" 2>/dev/null
find ~ -type d -name "env" 2>/dev/null
find /opt -type d -name "*env" 2>/dev/null
```

#### 查找 conda 环境

```bash
# 列出所有 conda 环境
conda env list
conda info --envs

# 删除指定环境
conda env remove -n env_name

# 清理所有未使用的包和缓存
conda clean --all
```

#### 手动删除虚拟环境

```bash
# Windows
rmdir /s /q path\to\venv

# macOS/Linux
rm -rf path/to/venv
```

#### 批量清理项目虚拟环境

```bash
# Windows PowerShell - 删除当前目录下所有 venv 文件夹
Get-ChildItem -Path . -Recurse -Directory -Filter "venv" | Remove-Item -Recurse -Force
Get-ChildItem -Path . -Recurse -Directory -Filter ".venv" | Remove-Item -Recurse -Force

# macOS/Linux - 删除当前目录下所有虚拟环境
find . -type d -name "venv" -exec rm -rf {} +
find . -type d -name ".venv" -exec rm -rf {} +
```

#### 推荐的清理策略

由于虚拟环境可能分散在各个项目目录中，没有完美的一键清理方案。建议采用以下策略：

**方案 1: 按项目清理（推荐）**

如果你的项目都在固定目录下（如 `~/Projects`、`D:\Code`），可以集中清理：

```bash
# Windows PowerShell
Get-ChildItem -Path "D:\Code" -Recurse -Directory | 
  Where-Object { $_.Name -match '^(venv|\.venv|env)$' } | 
  Remove-Item -Recurse -Force

# macOS/Linux
find ~/Projects -type d \( -name "venv" -o -name ".venv" -o -name "env" \) -exec rm -rf {} +
```

**方案 2: 通过 pyvenv.cfg 定位（最准确）**

虚拟环境都包含 `pyvenv.cfg` 文件，通过它可以准确定位：

```bash
# Windows PowerShell - 查找并列出所有虚拟环境
Get-ChildItem -Path C:\ -Recurse -Filter "pyvenv.cfg" -ErrorAction SilentlyContinue | 
  ForEach-Object { $_.Directory.FullName }

# 确认后批量删除（谨慎操作）
Get-ChildItem -Path C:\ -Recurse -Filter "pyvenv.cfg" -ErrorAction SilentlyContinue | 
  ForEach-Object { Remove-Item $_.Directory.FullName -Recurse -Force }

# macOS/Linux - 查找所有虚拟环境
find / -name "pyvenv.cfg" 2>/dev/null | sed 's|/pyvenv.cfg||'

# 确认后删除
find / -name "pyvenv.cfg" 2>/dev/null | sed 's|/pyvenv.cfg||' | xargs rm -rf
```

**方案 3: 使用磁盘清理工具**

- Windows: 使用 [TreeSize](https://www.jam-software.com/treesize_free) 或 [WinDirStat](https://windirstat.net/) 可视化查找大文件夹
- macOS: 使用 [DaisyDisk](https://daisydiskapp.com/) 或 `du -sh */` 命令
- Linux: 使用 `ncdu` 工具

```bash
# 安装 ncdu
sudo apt install ncdu  # Ubuntu/Debian
brew install ncdu      # macOS

# 扫描目录
ncdu ~
```

::: danger 警告
全盘搜索 `pyvenv.cfg` 可能需要很长时间，且可能需要管理员权限。建议：
1. 先在项目目录范围内搜索
2. 手动确认每个虚拟环境后再删除
3. 避免误删系统关键目录
:::

::: tip 最佳实践
为了方便管理，建议：
1. 统一虚拟环境命名（如都用 `.venv`）
2. 将所有项目放在固定目录下
3. 使用 `virtualenvwrapper` 或 `conda` 集中管理虚拟环境
4. 定期清理不用的项目和环境
:::

::: tip 提示
虚拟环境通常位于：
- 项目目录下的 `venv/`、`.venv/`、`env/` 文件夹
- `~/.virtualenvs/`（virtualenvwrapper）
- `~/anaconda3/envs/` 或 `~/miniconda3/envs/`（conda）
- `~/.local/share/virtualenvs/`（pipenv）
:::

### Windows 系统

#### 方法 1: 使用控制面板

1. 打开"控制面板" → "程序和功能"
2. 找到所有 Python 相关程序
3. 逐个卸载（包括 Python、pip、相关工具）

#### 方法 2: 使用 Python 安装程序

1. 重新运行 Python 安装程序
2. 选择"Uninstall"选项
3. 勾选"Remove all components"

#### 方法 3: 手动清理

```bash
# 删除 Python 安装目录
rmdir /s /q C:\Python39
rmdir /s /q "C:\Program Files\Python39"
rmdir /s /q "%LOCALAPPDATA%\Programs\Python"

# 删除用户数据
rmdir /s /q "%APPDATA%\Python"
rmdir /s /q "%LOCALAPPDATA%\pip"
```

#### 清理环境变量

1. 右键"此电脑" → "属性" → "高级系统设置"
2. 点击"环境变量"
3. 在 PATH 中删除所有 Python 相关路径
4. 删除 PYTHONPATH、PYTHONHOME 等变量

#### 清理注册表（谨慎操作）

```bash
# 打开注册表编辑器
regedit

# 搜索并删除以下项（备份后操作）
HKEY_LOCAL_MACHINE\SOFTWARE\Python
HKEY_CURRENT_USER\SOFTWARE\Python
```

### macOS 系统

#### 使用 Homebrew 安装的 Python

```bash
# 卸载 Python
brew uninstall python@3.x

# 清理残留
brew cleanup
```

#### 手动安装的 Python

```bash
# 删除 Python 框架
sudo rm -rf /Library/Frameworks/Python.framework

# 删除符号链接
sudo rm -rf /usr/local/bin/python*
sudo rm -rf /usr/local/bin/pip*

# 删除应用程序
sudo rm -rf "/Applications/Python 3.x"

# 清理用户配置
rm -rf ~/.python*
rm -rf ~/Library/Python
```

### Linux 系统

#### 使用包管理器卸载

```bash
# Ubuntu/Debian
sudo apt remove python3.x
sudo apt autoremove
sudo apt purge python3.x

# CentOS/RHEL
sudo yum remove python3.x
```

#### 手动编译安装的 Python

```bash
# 删除安装目录
sudo rm -rf /usr/local/lib/python3.x
sudo rm -rf /usr/local/bin/python3.x
sudo rm -rf /usr/local/bin/pip3.x

# 清理用户配置
rm -rf ~/.python*
rm -rf ~/.local/lib/python3.x
```

## 安装指定版本的 Python

### Windows 系统

#### 1. 从官网下载

1. 访问 [Python 官网](https://www.python.org/downloads/)
2. 下载指定版本的安装程序
3. 运行安装程序

**重要设置：**
- ✅ 勾选 "Add Python to PATH"
- ✅ 勾选 "Install for all users"（可选）
- 选择 "Customize installation"
- ✅ 勾选 "pip"、"tcl/tk"、"Python test suite"
- 设置安装路径（建议：`C:\Python3x`）

#### 2. 验证安装

```bash
python --version
pip --version

# 测试 Python
python -c "print('Hello, Python!')"
```

### macOS 系统

#### 方法 1: 使用 Homebrew（推荐）

```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装指定版本
brew install python@3.11

# 设置为默认版本
brew link python@3.11
```

#### 方法 2: 从官网下载

1. 访问 [Python 官网](https://www.python.org/downloads/macos/)
2. 下载 macOS 安装包
3. 运行 `.pkg` 文件安装

### Linux 系统

#### Ubuntu/Debian

```bash
# 添加 deadsnakes PPA（获取更多版本）
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update

# 安装指定版本
sudo apt install python3.11
sudo apt install python3.11-venv python3.11-dev

# 设置默认版本
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

#### CentOS/RHEL

```bash
# 安装依赖
sudo yum install gcc openssl-devel bzip2-devel libffi-devel

# 下载源码编译
cd /tmp
wget https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tgz
tar xzf Python-3.11.0.tgz
cd Python-3.11.0

# 编译安装
./configure --enable-optimizations
make altinstall  # 使用 altinstall 避免覆盖系统 Python
```

## 验证安装

### 基本验证

```bash
# 检查版本
python --version
pip --version

# 检查安装路径
which python  # macOS/Linux
where python  # Windows

# 测试 Python 解释器
python -c "import sys; print(sys.version)"
```

### 测试 pip

```bash
# 升级 pip
python -m pip install --upgrade pip

# 安装测试包
pip install requests

# 验证安装
python -c "import requests; print(requests.__version__)"
```

### 创建虚拟环境测试

```bash
# 创建虚拟环境
python -m venv test_env

# 激活虚拟环境
# Windows
test_env\Scripts\activate
# macOS/Linux
source test_env/bin/activate

# 验证环境
which python
python --version

# 退出虚拟环境
deactivate
```

## 最佳实践

1. **使用虚拟环境**：避免全局安装包，使用 `venv` 或 `conda` 管理项目环境
2. **版本管理工具**：使用 `pyenv` 管理多个 Python 版本
3. **定期更新**：保持 Python 和 pip 为最新稳定版本
4. **记录依赖**：使用 `requirements.txt` 或 `Pipfile` 记录项目依赖
5. **避免系统 Python**：在 macOS/Linux 上不要修改系统自带的 Python

## 常见问题

### 虚拟环境相关

**Q: 卸载 Python 后虚拟环境还能用吗？**

A: 不能。虚拟环境依赖于创建它的 Python 版本，卸载后虚拟环境会失效。但虚拟环境目录不会自动删除，需要手动清理。

**Q: 如何找到所有虚拟环境？**

A: 虚拟环境通常包含以下特征文件/目录：
- `pyvenv.cfg` 文件
- `Scripts/activate`（Windows）或 `bin/activate`（macOS/Linux）

可以通过搜索这些文件来定位：

```bash
# Windows
dir /s /b pyvenv.cfg

# macOS/Linux
find ~ -name "pyvenv.cfg" 2>/dev/null
```

**Q: 删除虚拟环境会影响项目吗？**

A: 不会影响项目代码，但会丢失该环境中安装的包。建议在删除前：
1. 导出依赖列表：`pip freeze > requirements.txt`
2. 重新创建环境后恢复：`pip install -r requirements.txt`

### 多版本共存

```bash
# 使用 py launcher (Windows)
py -3.11 --version
py -3.10 --version

# 使用 pyenv (macOS/Linux)
pyenv install 3.11.0
pyenv global 3.11.0
pyenv versions
```

### PATH 冲突

```bash
# 查看 Python 搜索顺序
# Windows
where python
# macOS/Linux
which -a python
```

### pip 权限问题

```bash
# 使用用户安装（推荐）
pip install --user package_name

# 或使用虚拟环境
python -m venv myenv
source myenv/bin/activate  # macOS/Linux
myenv\Scripts\activate     # Windows
```

## 参考资源

- [Python 官方下载](https://www.python.org/downloads/)
- [pyenv 项目](https://github.com/pyenv/pyenv)
- [Python 虚拟环境文档](https://docs.python.org/zh-cn/3/library/venv.html)
