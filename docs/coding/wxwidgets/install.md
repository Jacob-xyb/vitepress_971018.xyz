# wxWidgets 安装

## Windows

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
