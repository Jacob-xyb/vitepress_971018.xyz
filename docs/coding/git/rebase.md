# Git Rebase 变基 🔄

在 Git 分支管理中，除了直接合并（merge），**变基（rebase）** 是另一种常用的分支整合方式。本文将详细介绍 rebase 的原理、使用场景和最佳实践。

## 🆚 合并（Merge）vs 变基（Rebase）

### 📦 直接合并的特点

**优点：**
- 操作简单直观
- 保留完整的历史记录
- 不会改变已有提交的 SHA 值

**缺点：**
- 会产生额外的合并提交
- 历史记录可能变得复杂，出现分叉

```bash
# 合并操作示例
git checkout tmp1
git merge dev
```

### 🔀 变基的本质

**变基（Rebase）** 的核心思想是：将当前分支的提交"重新播放"在目标分支的最新状态之上，从而创建一个线性的提交历史。

```bash
# 方式 1：先切换到目标分支再变基
git checkout tmp1
git rebase dev

# 方式 2：直接指定分支（无需切换）
git rebase dev tmp1
```

::: tip VS Code 图形界面操作
1. 在源代码管理面板中，点击左下角的分支名称或使用 Git Graph 插件
2. 右键点击要变基的分支（如 `tmp1`）
3. 选择 "将分支变基为..." (Rebase Branch onto...)
4. 在弹出的列表中选择目标分支（如 `dev`）
5. 等待变基完成，如有冲突需手动解决
:::

### ⚙️ 变基的工作原理

1. 找到 `tmp1` 和 `dev` 的共同祖先提交
2. 将 `tmp1` 在共同祖先之后的所有提交临时保存
3. 将 `tmp1` 分支指针移动到 `dev` 的最新提交
4. 将保存的提交依次应用到 `dev` 之上（生成新的提交对象）

## 📊 提交历史对比

### 🌳 合并（Merge）后的历史

```
A---B---C---D---E  dev
         \
          F---G---H  tmp1
                     \
                      M（合并提交）
```

合并会产生一个新的合并提交 M，历史呈现分叉结构。

### 📏 变基（Rebase）后的历史

```
A---B---C---D---E  dev
                 \
                  F'---G'---H'  tmp1
```

变基后历史呈线性结构，`F'`、`G'`、`H'` 是新生成的提交对象（内容与原提交相同，但 SHA 值不同）。

## 🎯 使用场景选择

### ✅ 适合使用变基的场景

- 个人功能分支，尚未推送到远程或与他人共享
- 希望保持线性、整洁的提交历史
- 长期功能开发，需要频繁同步主分支的更新
- 准备将功能分支合并到主分支前的整理工作

### ⚠️ 适合使用合并的场景

- 公共分支，多人协作开发
- 需要保留完整的分支合并历史记录
- 分支已经推送到远程仓库且被他人使用
- 重要的里程碑合并（如发布分支合并到主分支）

## 🛠️ 实用工作流程

### 🔧 基本变基操作

```bash
# 切换到功能分支
git checkout feature-branch

# 获取远程最新信息
git fetch origin

# 变基到远程主分支的最新状态
git rebase origin/main
```

### 🎨 交互式变基

交互式变基提供更强大的历史编辑能力：

```bash
# 启动交互式变基
git rebase -i dev

# 可以进行的操作：
# pick   - 保留该提交
# reword - 修改提交信息
# edit   - 修改提交内容
# squash - 合并到前一个提交
# drop   - 删除该提交
```

::: tip VS Code 交互式变基
VS Code 本身不直接支持交互式变基的图形界面，但可以：
1. 使用 **Git Graph** 插件：右键提交 → "Rebase Interactive"
2. 使用 **GitLens** 插件：提供更丰富的交互式变基功能
3. 或在集成终端中直接运行 `git rebase -i` 命令
:::

### ⚡ 变基 + 快进合并

保持主分支历史整洁的推荐流程：

```bash
# 1. 在功能分支上变基
git checkout feature-branch
git rebase main

# 2. 切换到主分支
git checkout main

# 3. 快进合并（不产生合并提交）
git merge feature-branch
```

## ⚠️ 重要注意事项

### 🏆 变基的黄金法则

::: danger 警告
**永远不要对已经推送到公共仓库且被他人使用的分支进行变基操作！**
:::

变基会重写提交历史，改变提交的 SHA 值。如果其他人基于原有提交继续工作，会导致严重的历史冲突。

### 🚀 已推送分支的变基处理

当你对已经推送到远程的分支进行变基后，本地和远程的历史会产生分歧，普通的 `git push` 会被拒绝。

#### 👤 场景 1：个人功能分支（只有你在使用）

这是最常见且安全的场景，可以使用强制推送：

```bash
# 1. 本地变基
git checkout feature-branch
git rebase main

# 2. 强制推送（推荐使用 --force-with-lease）
git push --force-with-lease origin feature-branch

# 或使用 --force（不推荐，除非确定没有其他人的提交）
git push --force origin feature-branch
```

::: tip --force-with-lease 的优势
`--force-with-lease` 比 `--force` 更安全：
- 它会检查远程分支是否有你不知道的新提交
- 如果有其他人推送了新提交，操作会被拒绝
- 避免意外覆盖他人的工作
:::

#### 👥 场景 2：多人协作分支（团队共享）

如果分支被多人使用，**不应该使用变基**，而应该使用合并：

```bash
# 推荐做法：使用合并而非变基
git checkout feature-branch
git merge main

# 正常推送
git push origin feature-branch
```

#### 🔄 场景 3：已变基但发现有协作者

如果你已经变基并强制推送，其他协作者需要重新同步：

```bash
# 协作者的处理步骤：
# 1. 保存本地未提交的更改
git stash

# 2. 获取最新的远程分支
git fetch origin

# 3. 重置本地分支到远程状态（会丢弃本地提交）
git reset --hard origin/feature-branch

# 4. 恢复之前保存的更改
git stash pop
```

::: warning 团队沟通
如果必须对共享分支进行变基，务必：
1. 提前通知所有协作者
2. 确保所有人都已推送他们的更改
3. 变基后立即通知团队更新本地分支
:::

### 📋 标准工作流程建议

#### 🧑‍💻 个人开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature main

# 2. 开发过程中定期同步主分支（使用变基）
git fetch origin
git rebase origin/main

# 3. 推送到远程（首次推送）
git push -u origin feature/new-feature

# 4. 后续变基后推送（使用 --force-with-lease）
git push --force-with-lease origin feature/new-feature

# 5. 功能完成后，合并到主分支（通常通过 PR/MR）
```

#### 👨‍👩‍👧‍👦 团队协作流程

```bash
# 1. 创建共享功能分支
git checkout -b feature/team-feature main

# 2. 多人协作时使用合并而非变基
git fetch origin
git merge origin/main

# 3. 正常推送
git push origin feature/team-feature

# 4. 合并到主分支前，可以在本地整理提交（不推送）
git rebase -i main  # 仅在本地整理
# 然后通过 PR/MR 合并
```

## 🔥 冲突处理

变基过程中可能遇到冲突，处理流程如下：

### 💻 命令行处理

```bash
# 1. 开始变基
git rebase main

# 2. 如果出现冲突，Git 会暂停并提示
# 手动解决冲突后：
git add <resolved-files>

# 3. 继续变基
git rebase --continue

# 4. 如果想放弃变基
git rebase --abort
```

### 🖥️ VS Code 处理冲突

当变基过程中出现冲突时，VS Code 会：

1. **自动检测冲突**：在源代码管理面板中显示冲突文件（标记为 `!`）
2. **打开冲突文件**：点击冲突文件，编辑器会高亮显示冲突区域
3. **解决冲突**：
   - 点击 "接受当前更改" / "接受传入更改" / "接受双方更改"
   - 或手动编辑代码解决冲突
4. **标记为已解决**：保存文件后，点击文件旁的 `+` 号暂存更改
5. **继续变基**：
   - 点击源代码管理面板顶部的 `✓` 图标
   - 或在命令面板中选择 "Git: Continue Rebase"
6. **放弃变基**（如需要）：
   - 在命令面板中选择 "Git: Abort Rebase"

## 📚 最佳实践总结

### 🌲 选择决策树

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 个人功能分支 | 变基 | 保持历史整洁 |
| 公共协作分支 | 合并 | 避免历史冲突 |
| 发布分支合并 | 合并 | 保留里程碑记录 |
| 日常同步主分支 | 变基 | 减少无意义的合并提交 |

### 🔁 日常开发工作流

```bash
# 个人功能分支的标准流程：

# 1. 获取最新代码
git fetch origin

# 2. 变基到最新主分支
git rebase origin/main

# 3. 解决冲突（如有）
# ... 手动解决冲突 ...
git add .
git rebase --continue

# 4. 推送到远程
# 首次推送：
git push -u origin feature-branch

# 变基后推送（分支已存在于远程）：
git push --force-with-lease origin feature-branch
```

::: warning 推送前检查
在使用 `--force-with-lease` 前，确认：
- 这是你的个人功能分支
- 没有其他人在这个分支上工作
- 你已经获取了最新的远程更改（`git fetch`）
:::

### 💡 核心原则

- **个人分支** → 使用变基，保持历史线性
- **公共分支** → 使用合并，保留完整历史
- **已推送的提交** → 谨慎变基，优先考虑合并
- **团队规范** → 遵循团队约定的工作流程

::: tip 记住
变基让历史更干净，合并让历史更完整。根据实际情况和团队规范选择合适的方案。
:::