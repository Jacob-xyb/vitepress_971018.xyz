# Step 1: 服务器环境准备

在部署 AI 自动化服务器之前，需要先准备好 Python 环境和基础依赖。

## 检查系统要求

### 内存检查

```bash
# Windows
systeminfo | findstr "Physical Memory"

# Linux
free -h

# macOS
sysctl hw.memsize
```

确保至少有 8GB 可用内存。

### 硬盘空间检查

```bash
# Windows
wmic logicaldisk get size,freespace,caption

# Linux/macOS
df -h
```

确保至少有 5GB 空闲空间。

## 安装 Python

### Windows

#### 方法 1: 从官网下载（推荐）

1. 访问 [Python 官网](https://www.python.org/downloads/)
2. 下载 Python 3.10+ 版本
3. 运行安装程序

**重要设置：**
- ✅ 勾选 "Add Python to PATH"
- ✅ 勾选 "Install for all users"（可选）

#### 方法 2: 使用 Chocolatey

```bash
# 安装 Chocolatey（如果未安装）
# 以管理员身份运行 PowerShell

# 安装 Python
choco install python -y
```

#### 验证安装

```bash
python --version
pip --version
```

### Linux

#### Ubuntu/Debian

```bash
# 更新包列表
sudo apt update

# 安装 Python 3.10+
sudo apt install python3.10 python3.10-venv python3-pip -y

# 验证安装
python3 --version
pip3 --version
```

#### CentOS/RHEL

```bash
# 安装 Python 3
sudo yum install python3 python3-pip -y

# 验证安装
python3 --version
pip3 --version
```

### macOS

#### 使用 Homebrew（推荐）

```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Python
brew install python@3.10

# 验证安装
python3 --version
pip3 --version
```

## 安装 Python 依赖

### 创建项目目录

```bash
# 创建项目目录
mkdir ai-automation-server
cd ai-automation-server

# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate
```

### 安装必要的库

```bash
# 升级 pip
pip install --upgrade pip

# 安装依赖
pip install flask ollama pillow requests
```

### 验证安装

```python
# 创建测试脚本 test_env.py
import flask
import ollama
from PIL import Image
import requests

print("✅ Flask 版本:", flask.__version__)
print("✅ Pillow 已安装")
print("✅ Requests 已安装")
print("✅ Ollama 已安装")
print("\n环境准备完成！")
```

运行测试：

```bash
python test_env.py
```

## 配置防火墙（预先准备）

虽然现在还不需要开放端口，但可以先了解如何配置：

### Windows 防火墙

```powershell
# 以管理员身份运行 PowerShell
# 允许 5000 端口（稍后会用到）
netsh advfirewall firewall add rule name="AI Server" dir=in action=allow protocol=TCP localport=5000
```

### Linux (ufw)

```bash
# 允许 5000 端口
sudo ufw allow 5000/tcp

# 查看状态
sudo ufw status
```

### Linux (firewalld)

```bash
# 允许 5000 端口
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# 查看状态
sudo firewall-cmd --list-ports
```

## 获取服务器 IP 地址

记录服务器的局域网 IP 地址，客户端连接时需要用到：

### Windows

```bash
ipconfig
# 查找 IPv4 地址，例如：192.168.1.100
```

### Linux/macOS

```bash
# 方法 1
ifconfig

# 方法 2
ip addr show

# 方法 3（仅显示 IP）
hostname -I
```

记录下类似 `192.168.1.100` 的 IP 地址。

## 检查清单

完成本步骤后，确认以下内容：

- [ ] Python 3.10+ 已安装
- [ ] pip 可以正常使用
- [ ] 已创建项目目录
- [ ] 已安装 flask、ollama、pillow、requests
- [ ] 已记录服务器 IP 地址
- [ ] 了解如何配置防火墙

## 下一步

环境准备完成后，继续 [Step 2: 安装 AI 模型](./step2-install-model.md)
