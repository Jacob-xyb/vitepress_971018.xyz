# 分支

## 分支基础操作和简介

Git 分支（Branch）是 Git 最强大的特性之一，它允许你在不影响主线的情况下并行开发不同的功能。

### 什么是分支

分支本质上是指向某个提交的可移动指针。Git 的默认分支名为 `master`（较新版本也常使用 `main`），每次提交时分支指针会自动向前移动。

**核心概念**：

- 📌 分支是指向提交的指针，而非目录
- 🔀 创建分支几乎无开销（仅创建指针）
- ⚡ 切换分支非常快速
- 🧹 合并与删除都很方便

### 查看分支

```bash
# 查看本地分支
git branch

# 查看所有分支（包括远程）
git branch -a

# 查看远程分支
git branch -r

# 查看分支详细信息（最后一次提交）
git branch -v
```

### 创建分支

```bash
# 基于当前提交创建新分支
git branch <branch-name>

# 基于指定提交创建分支
git branch <branch-name> <commit-id>

# 基于远程分支创建本地分支
git branch <branch-name> origin/<branch-name>

# 创建并切换到新分支
git checkout -b <branch-name>

# 新版 Git 推荐用法
git switch -c <branch-name>
```

### 切换分支

```bash
# 切换到已有分支
git checkout <branch-name>

# 新版 Git 推荐用法
git switch <branch-name>

# 切换到上一个分支
git checkout -
```

### 重命名分支

```bash
# 重命名当前分支
git branch -m <new-name>

# 重命名指定分支
git branch -m <old-name> <new-name>
```

### 删除分支

```bash
# 删除已合并的分支（安全）
git branch -d <branch-name>

# 强制删除分支（即使未合并）
git branch -D <branch-name>

# 删除远程分支
git push origin --delete <branch-name>
```

### 合并分支

```bash
# 切换到目标分支
git checkout main

# 合并指定分支到当前分支
git merge <branch-name>

# 不使用快进模式合并（保留分支历史）
git merge --no-ff <branch-name>
```

### 推送分支

```bash
# 推送本地分支到远程
git push origin <branch-name>

# 推送并建立追踪关系
git push -u origin <branch-name>
```