---
inclusion: always
---

# Git Commit Message 生成规则

**重要：生成 Git commit message 时必须使用中文！**

## 强制要求

- 所有 commit message 的描述部分必须使用中文
- 类型前缀使用英文（feat/fix/docs 等）
- 格式：`类型: 中文描述`
- 不要每次在执行结束后自主的帮我提交git

## 提交类型

- `feat`: 新功能
- `fix`: 修复问题  
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建/工具相关

## 正确示例

✅ `feat: 添加主题图标组件`
✅ `fix: 修复深色模式下图标显示问题`
✅ `docs: 更新 VitePress 配置文档`
✅ `refactor: 优化图标颜色处理逻辑`

## 错误示例

❌ `feat: add theme icon component`
❌ `fix: fix icon display issue in dark mode`

## 描述规范

- 长度：10-50 字
- 使用动词开头：添加、修复、更新、优化、删除
- 说明做了什么改动
- 简洁明了，一句话概括
