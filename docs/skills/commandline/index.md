---
outline: deep
---

# 命令行工具

命令行（Command Line）是与计算机交互的重要方式，熟练使用命令行可以大幅提升工作效率。

::: tip
本文档中的命令主要适用于 Unix/Linux/macOS，在 Windows 上可通过 Git Bash、WSL 或 PowerShell 执行。
:::

## 常用操作

### 文件和目录

```bash
# 列出目录内容
ls -la

# 进入目录
cd /path/to/dir

# 创建目录
mkdir -p path/to/dir

# 删除文件
rm file.txt

# 删除目录
rm -rf directory/

# 复制文件
cp source.txt destination.txt

# 移动/重命名文件
mv oldname.txt newname.txt
```

### 文件查看

```bash
# 查看文件内容
cat file.txt

# 分页查看
less file.txt

# 查看文件头部
head -n 20 file.txt

# 查看文件尾部
tail -n 20 file.txt

# 实时查看日志
tail -f logfile.log
```

### 搜索

```bash
# 搜索文件
find . -name "*.txt"

# 搜索内容
grep "keyword" file.txt

# 搜索内容（递归）
grep -r "keyword" ./
```

### 进程管理

```bash
# 查看进程
ps aux

# 杀死进程
kill PID

# 实时查看进程
top

# 后台运行
command &
```

## 实用技巧

### 管道和重定向

```bash
# 管道：将一个命令的输出作为另一个命令的输入
cat file.txt | grep "keyword"

# 重定向：输出到文件
echo "hello" > file.txt

# 追加到文件
echo "hello" >> file.txt

# 错误重定向
command 2> error.log
```

### 环境变量

```bash
# 查看环境变量
env

# 设置临时环境变量
export VAR=value

# 查看 PATH
echo $PATH
```

## 相关文档

- [统计项目规模](./统计项目规模.md) - 统计项目中代码行数的方法
