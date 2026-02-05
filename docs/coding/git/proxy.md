# Git 代理配置

## 问题场景

在使用 Git 推送代码到 GitHub 时，可能会遇到以下错误：

```bash
# 连接超时
Failed to connect to github.com port 443 after 21093 ms: Timed out

# 连接被重置
OpenSSL SSL_read: Connection was reset, errno 10054
```

这通常是因为网络环境无法直接访问 GitHub，需要通过代理（VPN）来连接。

## 问题原因

即使开启了全局 VPN，Git 默认也不会使用系统代理，需要手动配置 Git 使用代理服务器。

## 解决方案

### 1. 确认代理端口

首先需要知道你的 VPN 客户端使用的本地代理端口：

- **Clash**: 通常是 `7890`
- **V2rayN**: 通常是 `10808`
- **其他 VPN**: 查看客户端的设置界面

### 2. 配置 Git 代理

#### 方式一：仅为 GitHub 配置（推荐）

这种方式只对 GitHub 使用代理，不影响其他 Git 仓库：

```bash
# HTTP 代理（适用于大部分 VPN）
git config --global http.https://github.com.proxy http://127.0.0.1:端口号
git config --global https.https://github.com.proxy http://127.0.0.1:端口号

# SOCKS5 代理（V2rayN 推荐使用）
git config --global http.https://github.com.proxy socks5://127.0.0.1:10808
git config --global https.https://github.com.proxy socks5://127.0.0.1:10808
```

#### 方式二：全局配置

对所有 Git 仓库使用代理：

```bash
# HTTP 代理
git config --global http.proxy http://127.0.0.1:端口号
git config --global https.proxy http://127.0.0.1:端口号

# SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:端口号
git config --global https.proxy socks5://127.0.0.1:端口号
```

### 3. 验证配置

查看当前代理配置：

```bash
# 查看 GitHub 专用代理
git config --global --get http.https://github.com.proxy

# 查看全局代理
git config --global --get http.proxy
```

### 4. 取消代理配置

当不需要代理时（比如关闭 VPN 后）：

```bash
# 取消 GitHub 专用代理
git config --global --unset http.https://github.com.proxy
git config --global --unset https.https://github.com.proxy

# 取消全局代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 常见问题

### 错误：Proxy CONNECT aborted

```bash
fatal: unable to access 'https://github.com/xxx.git/': Proxy CONNECT aborted
```

**原因**：使用了错误的代理协议。

**解决**：将 `http://` 改为 `socks5://`，特别是 V2rayN 用户。

### 关闭 VPN 后无法推送

**原因**：Git 仍然尝试连接已配置的代理地址，但代理服务已关闭。

**解决**：使用上面的"取消代理配置"命令。

## 快捷脚本 ⭐

为了方便切换，可以创建两个批处理文件：

### git-proxy-on.bat

```bat
@echo off
git config --global http.https://github.com.proxy socks5://127.0.0.1:10808
git config --global https.https://github.com.proxy socks5://127.0.0.1:10808
echo Git 代理已开启
pause
```

### git-proxy-off.bat

```bat
@echo off
git config --global --unset http.https://github.com.proxy
git config --global --unset https.https://github.com.proxy
echo Git 代理已关闭
pause
```

使用时只需双击对应的批处理文件即可快速切换。

## 协议选择建议

| VPN 类型 | 推荐协议 | 配置示例 |
|---------|---------|---------|
| V2rayN | SOCKS5 | `socks5://127.0.0.1:10808` |
| Clash | HTTP | `http://127.0.0.1:7890` |
| 其他 | 先试 HTTP，不行再试 SOCKS5 | - |

## 总结

1. Git 不会自动使用系统代理，需要手动配置
2. 推荐只为 GitHub 配置代理，不影响其他仓库
3. V2rayN 用户建议使用 SOCKS5 协议
4. 关闭 VPN 后记得取消代理配置
5. 可以使用批处理脚本快速切换代理状态
