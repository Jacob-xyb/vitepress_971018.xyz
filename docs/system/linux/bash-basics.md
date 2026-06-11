# Linux Bash 基础操作

Bash（Bourne Again SHell）是 Linux 系统中最常用的 Shell，几乎所有发行版默认都使用它。本文整理日常使用频率最高的命令与技巧，作为快速上手手册。

## 🐚 进入终端

- 桌面环境：使用快捷键 `Ctrl + Alt + T`（多数发行版通用）
- 服务器：通过 SSH 远程连接 `ssh user@host`
- 切换 Shell：`chsh -s /bin/bash` 将默认 Shell 改为 Bash

查看当前 Shell：

```bash
echo $SHELL
```

## 📁 文件与目录

### 路径与目录跳转

```bash
pwd              # 显示当前所在目录
cd /etc          # 切换到绝对路径
cd ../parent     # 切换到上层目录
cd ~             # 回到家目录
cd -             # 回到上一次所在的目录
```

::: tip 路径符号速记
- `.` 当前目录
- `..` 上层目录
- `~` 当前用户的家目录
- `/` 根目录
:::

### 列出文件

```bash
ls               # 列出当前目录文件
ls -l            # 长格式：权限、所有者、大小、修改时间
ls -a            # 显示隐藏文件（以 . 开头）
ls -lh           # 文件大小以人类可读的方式显示（KB/MB/GB）
ls -lt           # 按修改时间排序
ls -lS           # 按文件大小排序
```

### 创建与删除

::: code-group

```bash [创建]
touch file.txt           # 创建空文件
mkdir mydir              # 创建目录
mkdir -p a/b/c           # 递归创建多级目录
```

```bash [复制与移动]
cp src.txt dst.txt       # 复制文件
cp -r srcdir dstdir      # 递归复制目录
mv old.txt new.txt       # 重命名/移动
```

```bash [删除]
rm file.txt              # 删除文件
rm -r mydir              # 递归删除目录
rm -rf mydir             # 强制递归删除（⚠️ 高危）
rmdir emptydir           # 仅删除空目录
```

:::

::: warning 高危操作警告
`rm -rf /` 或 `rm -rf /*` 会清空整个系统，**永远不要执行**。建议为 `rm` 添加别名：

```bash
alias rm='rm -i'   # 删除前确认
```
:::

## 📖 查看文件内容

```bash
cat file.txt             # 一次性输出全部内容
less file.txt            # 分页查看（q 退出，/ 搜索）
more file.txt            # 老式分页器
head -n 20 file.txt      # 查看前 20 行
tail -n 20 file.txt      # 查看后 20 行
tail -f log.txt          # 实时跟踪文件末尾（看日志利器）
wc -l file.txt           # 统计行数
```

## 🔍 搜索

### 查找文件

```bash
find . -name "*.log"                    # 当前目录递归查找 .log 文件
find /var -type f -size +100M           # 查找大于 100MB 的文件
find . -mtime -7                        # 最近 7 天修改过的文件
find . -name "*.tmp" -delete            # 找到并删除
```

### 内容搜索

```bash
grep "error" app.log                    # 搜索包含 error 的行
grep -i "error" app.log                 # 忽略大小写
grep -r "TODO" ./src                    # 递归搜索目录
grep -n "func" main.go                  # 显示行号
grep -v "DEBUG" app.log                 # 反向匹配，排除包含 DEBUG 的行
```

::: tip 推荐工具
现代化的 [ripgrep (rg)](https://github.com/BurntSushi/ripgrep) 比 `grep` 更快更智能，强烈推荐安装。
:::

## 🔗 管道与重定向

Bash 的精髓在于 **小工具组合**：

```bash
command > file.txt        # 标准输出覆盖写入文件
command >> file.txt       # 标准输出追加写入
command 2> err.log        # 标准错误重定向
command > all.log 2>&1    # 将 stderr 合并到 stdout
command < input.txt       # 从文件读取标准输入

cmd1 | cmd2               # 管道：cmd1 的输出作为 cmd2 的输入
```

实用组合示例：

```bash
ps aux | grep nginx                 # 查找 nginx 相关进程
cat access.log | sort | uniq -c     # 去重并统计行频次
ls -lS | head -n 10                 # 查看当前目录最大的 10 个文件
history | grep ssh                  # 查找用过哪些 ssh 命令
```

## 🔑 权限管理

Linux 权限以 `rwx` 表示，分别对应 **读、写、执行**，并按 **所有者 / 用户组 / 其他人** 三类划分。

```bash
ls -l file.txt
# -rw-r--r-- 1 user group 1024 Jun 11 10:00 file.txt
#  ↑↑↑↑↑↑↑↑↑
#  类型 owner group other
```

### chmod 修改权限

```bash
chmod +x script.sh          # 给所有人添加执行权限
chmod 755 script.sh         # 数字写法：rwxr-xr-x
chmod u+w,g-w file.txt      # 符号写法：用户加写，组去写
chmod -R 644 ./docs         # 递归修改
```

::: tip 数字权限速记
- `4` = r（读）
- `2` = w（写）
- `1` = x（执行）
- 三位数字依次代表 **owner / group / other**，例如 `755 = 7(rwx) 5(r-x) 5(r-x)`
:::

### chown 修改所有者

```bash
sudo chown user:group file.txt      # 修改所有者与组
sudo chown -R user:group ./project  # 递归
```

## 📦 软件包管理

不同发行版命令不同：

::: code-group

```bash [Debian/Ubuntu]
sudo apt update              # 更新软件源
sudo apt upgrade             # 升级所有包
sudo apt install git         # 安装软件
sudo apt remove git          # 卸载软件
apt search keyword           # 搜索包
```

```bash [RHEL/CentOS/Fedora]
sudo dnf check-update
sudo dnf upgrade
sudo dnf install git
sudo dnf remove git
dnf search keyword
```

```bash [Arch Linux]
sudo pacman -Syu             # 同步并升级
sudo pacman -S git           # 安装
sudo pacman -R git           # 卸载
pacman -Ss keyword           # 搜索
```

:::

## 🧠 进程管理

```bash
ps aux                       # 查看所有进程
ps -ef | grep python         # 查找 python 进程
top                          # 实时查看系统资源（q 退出）
htop                         # 更友好的 top（需要安装）
kill 1234                    # 终止 PID 为 1234 的进程
kill -9 1234                 # 强制终止（SIGKILL）
killall nginx                # 按名称终止
```

后台运行与作业控制：

```bash
command &                    # 后台运行
jobs                         # 查看当前 Shell 的后台作业
fg %1                        # 把作业 1 调回前台
bg %1                        # 让作业 1 在后台继续
nohup command &              # 退出终端仍然继续运行
```

## 🌐 网络相关

```bash
ping baidu.com               # 测试连通性
curl -I https://example.com  # 查看 HTTP 响应头
curl -O https://x.com/a.zip  # 下载文件
wget https://x.com/a.zip     # 下载（更适合大文件）
ip addr                      # 查看网络接口（替代 ifconfig）
ss -tulnp                    # 查看监听端口（替代 netstat）
```

## 🔧 环境变量

```bash
echo $PATH                   # 查看 PATH
export MY_VAR=hello          # 设置临时变量
export PATH=$PATH:/opt/bin   # 追加到 PATH
env                          # 查看所有环境变量
```

持久化：将 `export` 写入：

- `~/.bashrc`：交互式非登录 Shell（最常用）
- `~/.bash_profile` 或 `~/.profile`：登录 Shell

修改后执行 `source ~/.bashrc` 使其立即生效。

## ⚡ 提效快捷键

| 快捷键 | 作用 |
| --- | --- |
| `Tab` | 自动补全命令、文件名 |
| `Ctrl + C` | 终止当前命令 |
| `Ctrl + Z` | 挂起当前命令 |
| `Ctrl + D` | 退出当前 Shell / EOF |
| `Ctrl + L` | 清屏（等同 `clear`） |
| `Ctrl + R` | 反向搜索历史命令 |
| `Ctrl + A` / `Ctrl + E` | 移到行首 / 行尾 |
| `Ctrl + U` / `Ctrl + K` | 删除光标前 / 后内容 |
| `Ctrl + W` | 删除光标前一个单词 |
| `!!` | 重复执行上一条命令 |
| `!$` | 引用上一条命令的最后一个参数 |

## 📜 简易脚本入门

新建一个 `hello.sh`：

```bash
#!/bin/bash
# 这是注释

name="World"
echo "Hello, $name!"

# 条件判断
if [ -f "/etc/hostname" ]; then
    echo "hostname 文件存在"
fi

# 循环
for i in 1 2 3; do
    echo "第 $i 次"
done
```

赋予执行权限并运行：

```bash
chmod +x hello.sh
./hello.sh
```

::: tip 调试脚本
使用 `bash -x hello.sh` 可逐行打印执行过程，定位脚本问题非常方便。
:::

## 📚 延伸学习

- 官方手册：在终端输入 `man bash`
- 在线指南：[Bash Guide for Beginners](https://tldp.org/LDP/Bash-Beginners-Guide/html/)
- 速查工具：[tldr](https://tldr.sh/) —— 比 `man` 简洁的命令示例库
- 进阶脚本：[ShellCheck](https://www.shellcheck.net/) —— Shell 脚本静态检查
