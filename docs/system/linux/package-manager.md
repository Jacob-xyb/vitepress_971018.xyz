# Linux 包管理器

包管理器是 Linux 系统的"应用商店 + 依赖管家"。它帮你解决三件事：**装软件、卸软件、管理依赖**。本文整理主流 Linux 发行版的包管理器命令，方便随时查阅。

## 📦 什么是包管理器

Linux 上的软件通常被打包成 **包（package）**，每个包包含：

- 程序二进制文件
- 配置文件
- 元数据（版本、依赖、作者等）
- 安装/卸载脚本

包管理器就是处理这些包的工具，避免你手动去官网下载、解压、配 `PATH`。

## 🌐 主流发行版与包管理器

不同发行版使用的包管理器不同，命令也完全不一样：

| 发行版 | 包管理器 | 后端格式 | 特点 |
|--------|---------|---------|------|
| **Ubuntu / Debian / Mint / Kali** | `apt` | `.deb` | 最广泛，社区文档最多 |
| **CentOS / RHEL（老）** | `yum` | `.rpm` | 企业级服务器常见 |
| **Fedora / RHEL 8+ / CentOS Stream** | `dnf` | `.rpm` | yum 的现代化替代品 |
| **Arch Linux / Manjaro** | `pacman` | `.pkg.tar.zst` | 滚动更新，哲学极简 |
| **openSUSE** | `zypper` | `.rpm` | 配置灵活，企业友好 |
| **Alpine** | `apk` | `.apk` | 体积小，Docker 镜像常用 |
| **Gentoo** | `portage` | 源码编译 | 高度可定制，编译时间长 |

> 💡 **Debian 系（`.deb`）和 RedHat 系（`.rpm`）是两大阵营**，其余多是从这两家衍生或自成一派。

## 🧠 通用工作流

不管哪个发行版，包管理都遵循**两步**：

```
1. 同步软件源索引（刷新"商品目录"）
2. 安装 / 升级 / 卸载软件（按目录"下单"）
```

下面分别说明各发行版的常用命令。

## 🟠 Debian / Ubuntu（apt 系列）

Ubuntu 用户最常用的就是 `apt`：

::: code-group

```bash [更新与升级]
sudo apt update              # 更新软件源索引
sudo apt upgrade             # 升级已安装的包
sudo apt full-upgrade        # 升级时可处理依赖关系变更（更激进）
```

```bash [安装与卸载]
sudo apt install git         # 安装软件
sudo apt remove git          # 卸载软件（保留配置）
sudo apt purge git           # 卸载 + 删配置
sudo apt autoremove          # 自动清理无用依赖
```

```bash [查询与搜索]
apt search keyword           # 搜索包
apt show git                 # 查看包的详细信息
apt list --installed         # 列出已安装的包
dpkg -l | grep git           # 按名称过滤已安装的包
```

```bash [清理缓存]
sudo apt clean               # 清理 /var/cache/apt/archives/ 下的安装包
```

:::

::: tip 装软件的标准三步
```bash
sudo apt update              # 1. 更新目录
sudo apt upgrade             # 2. 升级旧软件（可选）
sudo apt install <pkg>       # 3. 装新软件
```
:::

## 🔴 RHEL / CentOS / Fedora（dnf / yum 系列）

新版本已统一用 `dnf`，`yum` 仍然兼容：

::: code-group

```bash [dnf（推荐）]
sudo dnf check-update        # 检查可更新的包
sudo dnf upgrade             # 升级所有包
sudo dnf install git         # 安装
sudo dnf remove git          # 卸载
dnf search keyword           # 搜索
```

```bash [yum（旧版）]
sudo yum update
sudo yum install git
sudo yum remove git
yum search keyword
```

:::

## 🟦 Arch Linux（pacman）

Arch 哲学是"保持简洁"，命令风格也最紧凑：

```bash
sudo pacman -Syu             # 同步源 + 升级系统（最常用，组合操作）
sudo pacman -S git           # 安装
sudo pacman -R git           # 卸载
sudo pacman -Rs git          # 卸载并清理无用依赖
sudo pacman -Rns git         # 卸载 + 清理配置 + 清理依赖
pacman -Ss keyword           # 搜索
pacman -Qs git               # 搜索本地已安装的包
```

> 💡 `pacman` 一定要记牢 `-Syu` 这个组合，**Arch 是滚动更新**，建议每周至少跑一次。

## 🟢 Alpine（apk）

体积小，启动快，常见于 Docker 镜像：

```bash
sudo apk update              # 更新索引
sudo apk add git             # 安装
sudo apk del git             # 卸载
apk search keyword           # 搜索
apk info git                 # 查看包信息
sudo apk upgrade             # 升级所有包
```

## ⚖️ 命令速查对照表

| 操作 | Debian/Ubuntu | RHEL/Fedora | Arch | Alpine |
|------|--------------|-------------|------|--------|
| 更新索引 | `apt update` | `dnf check-update` | `pacman -Sy` | `apk update` |
| 升级所有包 | `apt upgrade` | `dnf upgrade` | `pacman -Syu` | `apk upgrade` |
| 安装 | `apt install xxx` | `dnf install xxx` | `pacman -S xxx` | `apk add xxx` |
| 卸载 | `apt remove xxx` | `dnf remove xxx` | `pacman -R xxx` | `apk del xxx` |
| 搜索 | `apt search xxx` | `dnf search xxx` | `pacman -Ss xxx` | `apk search xxx` |
| 查看已装 | `apt list --installed` | `dnf list installed` | `pacman -Qs xxx` | `apk info` |

## 🔄 换发行版？只换命令，不换思路

不管你用哪个发行版，**核心逻辑都是**：

1. **更新索引** → 知道有哪些软件
2. **搜索包名** → 找到想要的软件
3. **安装** → 下载并配置
4. **升级 / 卸载** → 维护

## 💡 实用建议

- **优先用系统官方源**，第三方源（PPA / 私人源）要确认来源可信
- **国内用户换源**能显著加速：Ubuntu / Debian 可换阿里云、清华、中科大源
- **生产环境慎用 `upgrade`**，建议先在测试环境验证
- **容器内（Docker）一般用最小包管理器**（如 Alpine 的 `apk`），避免冗余
- **遇到不熟悉的命令**：`man <command>` 或 `<command> --help` 永远是好朋友

## 📚 延伸阅读

- [Debian 官方包管理手册](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html)
- [Arch Wiki - pacman](https://wiki.archlinux.org/title/Pacman)（社区公认最优秀的文档）
- [Fedora Docs - DNF](https://docs.fedoraproject.org/en-US/quick-docs/dnf/)
- [Alpine - apk](https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper)
