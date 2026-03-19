---
outline: deep
---

# 人工智能模型

> 记录常用大语言模型（LLM）的使用指南、API 配置和实践技巧。

## 概述

大语言模型（Large Language Model，LLM）是一种基于深度学习的自然语言处理模型，能够理解和生成人类语言。常见的 LLM 包括 GPT、Claude、MiniMax 等。

## 主流模型对比

| 模型 | 提供商 | 特点 | 适用场景 |
|------|--------|------|----------|
| MiniMax | MiniMax | 支持 200K 超长上下文 | 长文本处理、代码生成 |
| Claude | Anthropic | 安全性强、长上下文 | 对话、写作、分析 |
| GPT-4 | OpenAI | 通用性强、生态完善 | 各种任务 |

## 通用配置

大部分 LLM API 都支持类似的配置参数：

```json
{
  "model": "model-name",
  "messages": [
    { "role": "system", "content": "系统提示" },
    { "role": "user", "content": "用户输入" }
  ],
  "temperature": 0.7,
  "max_tokens": 4096
}
```

### 参数说明

- **temperature**：控制输出的随机性，值越小越确定性
- **max_tokens**：最大生成 token 数
- **top_p**：核采样参数
- **stream**：是否使用流式输出

## 常见应用场景

### 1. 智能对话

通过 API 与模型进行多轮对话，实现客服、助手等功能。

### 2. 代码生成

利用模型的代码理解能力，生成、审查和优化代码。

### 3. 文本处理

包括翻译、摘要、续写、润色等多种文本任务。

## 相关文档

- [MiniMax 使用指南](./minimax.md) - MiniMax API 配置与调用详解
