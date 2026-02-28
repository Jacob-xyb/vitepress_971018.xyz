# Step 2: 安装 AI 模型

安装 Ollama 和 LLaVA 视觉语言模型。

## 安装 Ollama

Ollama 是一个本地运行大语言模型的工具，支持多种开源模型。

### Windows

1. 访问 [Ollama 官网](https://ollama.com/download)
2. 下载 Windows 安装包
3. 运行安装程序
4. 安装完成后，Ollama 会自动启动

#### 验证安装

```bash
ollama --version
```

### Linux

```bash
# 一键安装脚本
curl -fsSL https://ollama.com/install.sh | sh

# 验证安装
ollama --version

# 启动 Ollama 服务
ollama serve
```

::: tip Linux 后台运行
如果想让 Ollama 在后台运行：
```bash
# 使用 systemd
sudo systemctl start ollama
sudo systemctl enable ollama

# 或使用 nohup
nohup ollama serve > ollama.log 2>&1 &
```
:::

### macOS

```bash
# 方法 1: 下载安装包
# 访问 https://ollama.com/download 下载 macOS 版本

# 方法 2: 使用 Homebrew
brew install ollama

# 验证安装
ollama --version
```

## 下载 AI 模型

根据服务器内存选择合适的模型。

### 模型选择指南

| 模型 | 内存占用 | 准确度 | 速度 | 适用场景 |
|------|---------|--------|------|----------|
| moondream | ~2GB | ⭐⭐⭐ | 快 | 8GB 内存，简单任务 |
| llava:7b | ~4GB | ⭐⭐⭐⭐ | 中等 | 8GB+ 内存，通用场景（推荐） |
| llava:13b | ~8GB | ⭐⭐⭐⭐⭐ | 慢 | 16GB+ 内存，高精度需求 |
| llava:34b | ~20GB | ⭐⭐⭐⭐⭐ | 很慢 | 32GB+ 内存，专业场景 |

### 标准配置（16GB+ 内存）

```bash
# 下载 LLaVA 13B 模型（推荐）
ollama pull llava:13b

# 或使用默认 7B 版本
ollama pull llava
```

### 低配置（8GB 内存）

```bash
# 推荐：LLaVA 7B
ollama pull llava:7b

# 或最轻量：Moondream
ollama pull moondream
```

### 下载过程

下载过程可能需要 10-30 分钟，取决于网络速度：

```bash
pulling manifest
pulling 8934d96d3f08... 100% ▕████████████████▏ 4.7 GB
pulling 8c17c2ebb0ea... 100% ▕████████████████▏ 7.0 KB
pulling f02dd72bb242... 100% ▕████████████████▏ 12 KB
pulling 6f6b8d5c1c3e... 100% ▕████████████████▏ 485 B
verifying sha256 digest
writing manifest
success
```

## 验证模型安装

### 查看已安装的模型

```bash
ollama list
```

输出示例：
```
NAME            ID              SIZE    MODIFIED
llava:7b        8934d96d3f08    4.7 GB  2 minutes ago
```

### 测试模型

```bash
# 测试文本对话
ollama run llava:7b "Hello, how are you?"

# 测试视觉识别（需要图片）
ollama run llava:7b "What's in this image?" --image test.png
```

## 模型管理

### 删除模型

如果下载错了或想更换模型：

```bash
# 删除模型
ollama rm llava:13b

# 查看剩余模型
ollama list
```

### 更新模型

```bash
# 更新到最新版本
ollama pull llava:7b
```

### 查看模型详情

```bash
# 查看模型信息
ollama show llava:7b
```

## 性能优化

### GPU 加速（可选）

如果服务器有 NVIDIA GPU：

1. **安装 NVIDIA 驱动**
   ```bash
   # 检查 GPU
   nvidia-smi
   ```

2. **Ollama 自动使用 GPU**
   - Ollama 会自动检测并使用 GPU
   - 无需额外配置

3. **验证 GPU 使用**
   ```bash
   # 运行模型时查看 GPU 使用率
   nvidia-smi -l 1
   ```

### 内存优化

如果内存紧张：

```bash
# 使用量化版本（更小但略降准确度）
ollama pull llava:7b-q4  # 4-bit 量化
ollama pull llava:7b-q8  # 8-bit 量化
```

## 故障排查

### 下载失败

```bash
# 检查网络连接
ping ollama.com

# 使用代理（如果需要）
export HTTP_PROXY=http://proxy:port
export HTTPS_PROXY=http://proxy:port
ollama pull llava:7b
```

### 内存不足

```bash
# 监控内存使用
# Linux
free -h
htop

# Windows
taskmgr

# 如果内存不足，使用更小的模型
ollama pull moondream
```

### Ollama 服务未启动

```bash
# 手动启动 Ollama
ollama serve

# 或在后台启动
nohup ollama serve > ollama.log 2>&1 &
```

## 检查清单

完成本步骤后，确认以下内容：

- [ ] Ollama 已安装并可以运行
- [ ] 已下载合适的 AI 模型（llava:7b 或其他）
- [ ] 可以使用 `ollama list` 查看模型
- [ ] 已测试模型可以正常运行
- [ ] （可选）GPU 加速已启用

## 下一步

模型安装完成后，继续 [Step 3: 部署服务器端](./step3-deploy-server.md)
