# AI 驱动的自动化方案

基于 AI 视觉识别的 UI 自动化解决方案，通过自然语言控制和智能识别实现复杂的自动化任务。

## 方案概述

本方案实现了一个完全免费的 AI 驱动的 UI 自动化系统，采用服务端-客户端架构：

- **服务器端**：运行 AI 模型（Ollama + LLaVA），只需部署一次
- **客户端**：轻量级软件，通过局域网调用 AI 服务
- **完全免费**：不需要外网，不需要 API 付费

## 架构设计

```
[服务器] 运行 Ollama + LLaVA (一次部署)
    ↓ 局域网 HTTP API
[客户端1] 轻量级软件 (Python + 自动化脚本)
[客户端2] 轻量级软件
[客户端3] 轻量级软件
```

## 核心优势

- ✅ AI 理解自然语言指令
- ✅ 视觉识别屏幕元素（按钮、文本等）
- ✅ 自动化复杂任务（循环、条件判断）
- ✅ 局域网部署，一次配置多处使用
- ✅ 完全免费开源
- ✅ 数据隐私安全（不上传云端）

## 硬件要求

### 推荐配置（最佳体验）
- 内存：16GB+
- 硬盘：10GB 空闲空间
- CPU：多核处理器
- 显卡：NVIDIA GPU（可选，显著加速）

### 最低配置（8GB 内存可用）
- 内存：8GB（使用小模型）
- 硬盘：5GB 空闲空间
- CPU：4 核心+
- 显卡：无要求

::: tip 8GB 内存优化方案
如果只有 8GB 内存，可以使用以下小模型：
- `llava:7b` - 约 4GB 内存占用（推荐）
- `moondream` - 约 2GB 内存占用（最轻量）
:::

## 部署步骤

按照以下步骤完成部署：

1. [服务器环境准备](./step1-server-setup.md) - 安装 Python 和基础环境
2. [安装 AI 模型](./step2-install-model.md) - 安装 Ollama 和 LLaVA 模型
3. [部署服务器端](./step3-deploy-server.md) - 创建并启动 AI 服务器
4. [配置网络访问](./step4-network-config.md) - 配置防火墙和网络
5. [部署客户端](./step5-deploy-client.md) - 安装客户端并连接服务器
6. [使用示例](./step6-examples.md) - 实际应用场景示例
7. [故障排查](./step7-troubleshooting.md) - 常见问题解决方案

## 适用场景

- **RPA（机器人流程自动化）**：批量处理重复性任务
- **自动化测试**：UI 功能测试
- **数据录入**：批量导入文件或数据
- **批量操作**：遍历文件夹执行操作

## 技术栈

- **AI 模型**：Ollama + LLaVA（视觉语言模型）
- **服务器**：Python + Flask
- **客户端**：Python + PyAutoGUI
- **通信**：HTTP REST API

## 成本分析

### 完全免费
- ✅ Ollama: 开源免费
- ✅ LLaVA 模型: 开源免费
- ✅ Python 库: 全部开源
- ✅ 无 API 调用费用
- ✅ 可商用

### 唯一成本
- 服务器硬件（一次性投入）
- 电费（运行成本）

## 参考资源

- [Ollama 官网](https://ollama.com/)
- [LLaVA 模型](https://ollama.com/library/llava)
- [PyAutoGUI 文档](https://pyautogui.readthedocs.io/)
- [Flask 文档](https://flask.palletsprojects.com/)
