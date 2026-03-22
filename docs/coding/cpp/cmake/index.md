# CMake 简介

## 什么是 CMake

CMake 是一个跨平台的**开源构建系统生成器**（Build System Generator），用于管理 C/C++ 项目的编译和构建过程。

它通过读取 `CMakeLists.txt` 配置文件，来生成本地平台所需的构建文件（如 Unix Makefiles、Ninja、Visual Studio 项目文件等）。

## 为什么使用 CMake

- **跨平台** 📦：支持 Windows、Linux、macOS 等多种平台
- **简洁高效**：相比传统 Makefile，语法更加简洁易读
- **功能强大**：支持复杂项目的构建配置、依赖管理、测试集成
- **广泛使用**：已成为 C++ 项目的事实标准构建工具

## 基本工作流程

CMake 的典型工作流程如下：

```bash
# 1. 创建构建目录
mkdir build && cd build

# 2. 运行 CMake 生成构建文件
cmake ..

# 3. 编译项目
cmake --build .
```

## 最小示例

一个最基本的 `CMakeLists.txt` 文件：

```cmake [CMakeLists.txt]
cmake_minimum_required(VERSION 3.16)
project(MyProject)

add_executable(hello main.cpp)
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `cmake_minimum_required` | 设置最低 CMake 版本要求 |
| `project` | 定义项目名称和版本 |
| `add_executable` | 添加可执行文件目标 |
| `add_library` | 添加库文件目标 |
| `target_link_libraries` | 链接库文件 |
| `find_package` | 查找依赖包 |
| `include_directories` | 添加包含目录 |

## 相关资源

- [CMake 官方文档](https://cmake.org/documentation/)
- [CMake Tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
