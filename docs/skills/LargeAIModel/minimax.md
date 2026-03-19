---
outline: deep
---

# MiniMax 使用指南

## 概述

MiniMax 是一款国产大语言模型，支持高达 **200K** 的超长上下文窗口，在代码生成、长文本处理等场景表现出色。通过 MiniMax 开放平台 API，可以方便地将模型能力集成到各种应用和工具中。

## 平台入口

- **开放平台**：[https://platform.minimaxi.com/](https://platform.minimaxi.com/)
- **API 文档**：登录后在控制台查看详细文档

## 收费详情

简单来说，MiniMax平台近期将原来的“Coding Plan”进行了重大升级，并更名为“Token Plan”。两者最核心的区别在于**计费单位**和**可使用的模型范围**。

你可以把 **Coding Plan** 想象成一张“**编程专用饭票**”，只能用于特定的编程场景，按“份”计费。而 **Token Plan** 则是一张“**平台全能饭卡**”，可以在整个平台的所有模态模型（文本、语音、图像、音乐等）上使用，按“次”扣费。

为了让你看得更清楚，我把它们的区别整理成了一个表格：

| 对比维度 | Coding Plan (旧套餐) | Token Plan (新套餐) |  
| :--- | :--- | :--- |  
| **核心计费单位** | **Prompt** | **请求次数 (Request)** |  
| **计费逻辑** | 用户的一次操作（如请求代码补全），后台即使拆分为多次模型调用，也**打包为1个Prompt计费**。 | 每一次模型API调用，都**计为1次请求**。模型调用越频繁，额度消耗越快。 |  
| **支持模型** | 主要支持 **文本模型** (如 MiniMax M2.5, M2.1)。 | 支持 **全模态模型**，包括文本、语音合成、图像生成、音乐生成等。 |  
| **额度消耗示例** | - | - **文本模型**：每次调用消耗 **1次** 请求。<br>- **语音合成-HD**：每1000字符消耗 **600次** 请求。<br>- **视频生成**：单个视频可能消耗 **1500-4500次** 请求。 |  
| **高速模型计费** | 极速版订阅可使用效果相同、速度更快的 `M2.5-highspeed` 模型。 | 使用 `M2.5-highspeed` 模型，次数消耗是**双倍**的。 |  
| **本质与目的** | 专为**高频编程**场景设计的**订阅服务**，旨在提供高性价比、可预测的编程辅助费用。 | 将原Coding Plan的订阅额度，升级为可在**全平台通用**的“通用代币”，拓展了使用场景，但消耗速度因模型而异。 |  

### 这次更新意味着什么？

这次从“Coding Plan”到“Token Plan”的转变，可以看作是平台策略的一次重要调整。它不再只是一个“编程助手订阅”，而变成了一个“**平台资源包**”。好处是你的订阅费能用的服务变多了，但代价是，如果你主要用它来做AI编程，实际的**额度消耗速度可能会比之前快**。特别是如果你尝试使用语音、视频等多媒体功能，套餐额度可能会在很短时间内消耗完。


## API 接入

### 基本信息

| 配置项 | 值 |
|--------|-----|
| API 地址（国内） | `https://api.minimaxi.com/anthropic` |
| API 地址（国际） | `https://api.minimax.io/anthropic` |
| 支持模型 | MiniMax-M2、MiniMax-M2.5 等 |
| 最大上下文 | 200K tokens |

### 请求格式

MiniMax API 兼容 Anthropic 格式，使用 `messages` 结构：

```bash
curl -X POST https://api.minimaxi.com/anthropic/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-M2.5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "你好，介绍一下你自己"}
    ]
  }'
```

### Python 调用示例

```python
import anthropic

client = anthropic.Anthropic(
    api_key="YOUR_API_KEY",
    base_url="https://api.minimaxi.com/anthropic"
)

message = client.messages.create(
    model="MiniMax-M2.5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "用 Python 写一个快速排序"}
    ]
)

print(message.content)
```

## Claude Code 集成

Claude Code 是 Anthropic 官方推出的命令行工具，支持配置第三方 API 提供商。通过以下配置，可以让 Claude Code 使用 MiniMax 模型。

### 环境变量配置

```bash
# 设置 API 基础地址（根据网络环境选择）
export ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic"  # 国内
# export ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic"  # 国际

# 设置 API 密钥
export ANTHROPIC_AUTH_TOKEN="YOUR_API_KEY"

# 指定模型
export ANTHROPIC_MODEL="MiniMax-M2.5"

# 增加超时时间（可选）
export API_TIMEOUT_MS="3000000"
```

### VS Code 扩展配置

在 `.vscode/settings.json` 中添加：

```json
"claudeCode.environmentVariables": [
    {
        "name": "ANTHROPIC_BASE_URL",
        "value": "https://api.minimaxi.com/anthropic"
    },
    {
        "name": "ANTHROPIC_AUTH_TOKEN",
        "value": "YOUR_API_KEY"
    },
    {
        "name": "API_TIMEOUT_MS",
        "value": "3000000"
    },
    {
        "name": "ANTHROPIC_MODEL",
        "value": "MiniMax-M2.5"
    },
    {
        "name": "ANTHROPIC_DEFAULT_SONNET_MODEL",
        "value": "MiniMax-M2.5"
    }
]
```

### 使用 CCswitch 工具（推荐新手）

[CCswitch](https://github.com/farion1231/ccswitch) 是一个图形化配置工具，可以一键完成 Claude Code 的 MiniMax 配置：

1. 下载并安装 CCswitch
2. 选择预设的 **MiniMax** 供应商
3. 填入 API Key 并选择模型
4. 点击启用即可

## 模型参数

### 常用参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| temperature | float | 1.0 | 控制随机性，0 更确定，1 更随机 |
| top_p | float | 1.0 | 核采样参数 |
| top_k | int | - | top-k 采样 |
| max_tokens | int | 4096 | 最大生成 token 数 |
| stop_sequences | list | - | 停止序列 |

### temperature 选择建议

| 场景 | 建议值 |
|------|--------|
| 代码生成 | 0.2 ~ 0.5 |
| 创意写作 | 0.7 ~ 1.0 |
| 问答总结 | 0.1 ~ 0.3 |
| 对话聊天 | 0.7 ~ 0.9 |

## 常见问题

### Q: API 请求超时会怎么办？

A: 可以增加超时时间配置，如 `API_TIMEOUT_MS=3000000`（3分钟）。对于长文本生成任务，建议合理设置 `max_tokens` 避免单次请求过长。

### Q: 如何选择国内还是国际 API 地址？

A: 根据你的网络环境选择：国内用户使用 `.com` 域名，国际用户使用 `.io` 域名。

### Q: 支持流式输出吗？

A: 是的，设置 `stream: true` 即可启用流式输出。

## 相关资源

- [MiniMax 开放平台](https://platform.minimaxi.com/)
- [CCswitch 工具](https://github.com/farion1231/ccswitch)
- [Claude Code 扩展](../soft/vscode/vscode-vibecoding.md)
