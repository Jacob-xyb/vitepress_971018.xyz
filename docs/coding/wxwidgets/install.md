# wxWidgets 安装

## 为什么需要 MSYS2

wxWidgets 与 MinGW、CMake 是不同层级的工具：

- **MinGW**：Windows 上的 GCC 编译器，提供 C++ 编译能力
- **CMake**：跨平台构建系统，生成 Makefile 或项目文件
- **MSYS2**：完整的开发环境，包含 MinGW + pacman 包管理器 + 预编译库

手动编译 wxWidgets 需要配置大量编译选项，过程繁琐。使用 MSYS2 可以直接安装预编译好的库，开箱即用。

## Windows

### 使用 MSYS2 安装（推荐）

```bash
# 安装 wxWidgets
pacman -S mingw-w64-x86_64-wxwidgets

# 验证安装
wx-config --version
```

### 使用 vcpkg 安装

```bash
vcpkg install wxwidgets:x64-windows
```

### 手动编译

1. 从 [wxWidgets 官网](https://www.wxwidgets.org/) 下载源码
2. 解压后进入目录
3. 编译：

```bash
# 使用 GCC/MinGW 编译
cd build/msw
mingw32-make -j4
```
