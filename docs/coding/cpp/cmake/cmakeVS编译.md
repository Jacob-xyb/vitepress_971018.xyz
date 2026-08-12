# cmake VS 编译

> 上一篇 [编译流程-大道至简](/coding/cpp/编译/) 已经把"一行 `g++` 命令背后跑了什么"讲透了——但日常项目稍微大一点，命令行就开始崩溃：路径一堆、改一处全量重编、跨平台写一堆 if……
> 本文沿着那条主链，把"命令行"和"CMake"两条路径做一次**逐层对比**。

---

## 第一章 一行命令背后发生了什么

### 1.1 g++ 是个"调度员"，不是编译器 🧑‍✈️

很多新手以为 `g++` 就是编译器。其实 `g++` 自己**不会编译**——它是一个**调度脚本**，按输入文件后缀自动决定要依次调哪些真正的工具：

```bash
g++ main.cpp -o main
```

这一行背后，`g++` 默默串起了 4 个阶段：

| 阶段 | 真实工具 | 做什么 | 产物 |
|------|---------|--------|------|
| ① 预处理 | `cpp` / `cc1plus -E` | `#include` 文本插入、宏展开 | `.i` |
| ② 编译 | `cc1plus` | 词法 → 语法 → 语义 → 优化 → 生成汇编 | `.s` |
| ③ 汇编 | `as` | 汇编指令 → 机器指令 | `.o` |
| ④ 链接 | `collect2` → `ld` | 符号解析 + 地址重定位 | 可执行文件 |

::: tip 想看真实调用链？加 `-v`
```bash
g++ main.cpp -o main -v
```
会列出 `g++` 内部依次调用 `cc1plus ...`、`as ...`、`collect2 ...` 的完整命令——一目了然。
:::

### 1.2 中间文件都去哪了？🗑️

跑完 `g++ main.cpp -o main`，你会发现**目录里只剩 `main`，没有任何 `.i` / `.s` / `.o`**。

::: warning 关键差异：中间产物的去留
- **`g++`**：默认**自动清理** `.i` / `.s` / `.o` —— 它认为你要的是可执行文件，"半成品"全删
- **CMake**：默认**保留** `build/CMakeFiles/` 下的所有中间文件——下次构建要做依赖追踪

这是 `g++` 和 `cmake` 在"产物管理"上**最直观的差异**。`g++` 跑完就清爽；`cmake` 跑完你会看到 `build/` 里冒出一坨 `CMakeFiles/`、`*.cmake`、`Makefile` 等等——理解了上面这条，就不会再对着那堆东西发懵。
:::

想保留中间产物？三种方式：

```bash
# 方式一：保留所有中间产物（推荐调试时）
g++ main.cpp -o main -save-temps
# 跑完你会看到：main, main.i, main.s, main.o

# 方式二：只停在某个阶段
g++ -E main.cpp -o main.i   # 只生成预处理文件
g++ -S main.cpp -o main.s   # 只生成汇编
g++ -c main.cpp -o main.o   # 只生成目标文件

# 方式三：用 -v 看清每一步调了啥（不改产物）
g++ main.cpp -o main -v
```

| 想看的产物 | 该用什么 |
|----------|---------|
| 预处理后 (`main.i`) | `-save-temps` 或 `-E` |
| 汇编 (`main.s`) | `-save-temps` 或 `-S` |
| 目标文件 (`main.o`) | `-save-temps` 或 `-c` |
| `g++` 内部调了啥 | `-v` |

### 1.3 手动分步执行完全等价的操作 ✋

`g++` 自动跑的 4 阶段，**完全可以手动拆开跑**——而且产物完全一样：

```bash
# ① 预处理：main.cpp → main.i
g++ -E main.cpp -o main.i

# ② 编译：main.i → main.s
g++ -S main.i -o main.s

# ③ 汇编：main.s → main.o
g++ -c main.s -o main.o

# ④ 链接：main.o → main（可执行文件）
g++ main.o -o main
```

跑完这 4 行，得到的 `main` 和 `g++ main.cpp -o main` 跑出来的 `main` **完全等价**。

> **多文件也一样**——手动版只是把过程拆开看，本质不变：

```bash
# 自动版（一行）
g++ main.cpp utils.cpp -o myapp

# 手动版（每一步都看得清）
g++ -E main.cpp -o main.i
g++ -E utils.cpp -o utils.i
g++ -S main.i -o main.s
g++ -S utils.i -o utils.s
g++ -c main.s -o main.o
g++ -c utils.s -o utils.o
g++ main.o utils.o -o myapp
```

::: tip 为什么要关心手动版？
自动版是黑盒，错了只能"看天"。手动版每一步都有独立产物——卡在哪一步，加个 `cat` / `nm` / `objdump` 立刻能定位。**这是调试编译/链接错误的最强武器**。
:::

### 1.4 命令行的优势 vs 局限 ⚖️

**优势 ✅**

- 所见即所得——敲啥跑啥，没有"中间层"
- 学习编译原理的最佳入口
- 调试极其方便——卡在哪一阶段？加 `-E` / `-S` / `-c` 立刻能定位

**局限 ❌**（也就是 CMake 要解决的痛）

| 场景 | 命令行的痛 |
|------|----------|
| 文件多了 | 命令越来越长，光编译命令就头大 |
| 改一个文件 | 整条命令重跑——**全量重编**，哪怕只改一行 |
| 跨平台 | Windows / Linux / macOS 路径、库路径都得自己拼 |
| 第三方库 | OpenCV、Boost…… 每个都得手写 `-I` `-L` `-l`，极易拼错 |
| 复杂依赖 | A 依赖 B，B 依赖 C——顺序、循环，全靠脑子记 |

下一章我们看 CMake 是怎么把这一串命令"自动化、可声明化、可移植化"的。

---

## 第二章 CMake 是怎么把这一切自动化的

### 2.1 CMake 是个"翻译官"，不是编译器 🧑‍💼

先纠正一个常见误解：**CMake 自己不会编译，也基本不调用编译器**。

CMake 真正做的工作只有一步——把一份声明式的 `CMakeLists.txt` **翻译成本地构建系统**：

```text
CMakeLists.txt        ← 你写的（声明"我要什么"）
       │
       ▼
   cmake ..            ← CMake 翻译
       │
       ▼
Makefile              ← Linux / macOS 上是 GNU Makefile
build.ninja           ← 或者 Ninja 文件
*.vcxproj / *.sln     ← Windows 上是 Visual Studio 工程
       │
       ▼
make / ninja / msbuild  ← 真正的构建工具在干活（调 cc1plus / as / ld）
       │
       ▼
可执行文件
```

::: tip 类比：CMake ≈ "翻译官"
- **命令行的写法**：`g++ main.cpp utils.cpp -o myapp -Ixxx -Lyyy -lzzz ...`（**过程式**，一步步告诉电脑怎么做）
- **CMake 的写法**：`CMakeLists.txt` 里只声明"我要 main 和 utils 两个源文件"（**声明式**，只告诉电脑我要什么）

过程式 = 厨师按菜谱一步步炒；声明式 = 你只点菜，厨房自己决定流程。CMake 就是那个"厨房的中央调度"——它先看懂你要啥，再生成对应厨具能理解的菜谱。
:::

### 2.2 最小示例：命令行 vs CMake 📝

同一个 `main.cpp + utils.cpp` 项目，对比两种写法：

**命令行的写法**（过程式）：

```bash
g++ -std=c++17 -Iinclude -c main.cpp -o main.o
g++ -std=c++17 -Iinclude -c utils.cpp -o utils.o
g++ -std=c++17 main.o utils.o -o myapp -Llib -lpthread
```

**CMake 的写法**（声明式）：

```cmake [CMakeLists.txt]
cmake_minimum_required(VERSION 3.16)
project(MyProject)

add_executable(myapp main.cpp utils.cpp)
target_include_directories(myapp PRIVATE include)
target_link_libraries(myapp PRIVATE pthread)
```

然后执行：

```bash
mkdir build && cd build
cmake ..            # CMake 翻译：生成 Makefile
cmake --build .     # 等价于 make（也可直接 make）
```

::: tip 收益对比
- **文件多了**：命令行命令越来越长；CMake 只在 `add_executable` 后追加 `.cpp` 文件名
- **改一处**：命令行整条重跑（全量重编）；CMake 增量构建（见 2.4）
- **跨平台**：命令行要为每个平台写不同命令；CMake 同一份 `CMakeLists.txt` 通吃
:::

### 2.3 build/ 目录里那堆东西是什么？🔍

还记得 [1.2 的 warning](cmakeVS编译.md#L38) 吗——CMake 跑完会冒出一坨中间产物。来拆解一下：

```text
build/
├── CMakeFiles/              # CMake 的"工作台"
│   ├── myapp.dir/           # 你声明的每个 target 一个子目录
│   │   ├── main.cpp.o       # 编译产物
│   │   ├── utils.cpp.o
│   │   ├── build.make       # CMakeFiles 生成的子 Makefile
│   │   ├── depend.make      # 依赖关系（！）
│   │   └── flags.make       # 编译参数缓存
│   ├── 3.27.6/              # CMake 版本目录（不同版本兼容）
│   │   └── CMakeSystem.cmake
│   └── TargetDirectories.txt
├── cmake_install.cmake      # 安装规则（`make install` 时用）
├── Makefile                 # 顶层 Makefile（入口）
└── CMakeCache.txt           # CMake 的配置缓存
```

**关键角色**：`CMakeFiles/myapp.dir/depend.make` —— 这就是 CMake 能做"增量构建"的秘密武器，它记录了"哪个 `.o` 依赖哪些 `.h`"。

::: warning 与命令行的对比
- **命令行**：`g++` 跑完直接删 `.o`，下次重编时**完全不知道上次编过啥**
- **CMake**：把 `.o`、依赖关系、编译参数**全留在 `build/`**，下次只重编"必要的部分"

这就是 CMake "产物管理"的核心——`build/` 不是垃圾，是**构建状态的完整快照**。
:::

### 2.4 杀手锏：增量构建 🚀

这是 CMake 相比命令行**最实用**的优势。

**命令行场景**：

```bash
$ g++ main.cpp utils.cpp -o myapp
# 改了 utils.cpp 之后：
$ g++ main.cpp utils.cpp -o myapp    # ← main.cpp 也被重新编译了！明明没改它
```

`g++` 不记历史，每次都把命令里**列出的所有文件**重新过一遍。改一处、编全部——小项目无所谓，大项目几分钟起步。

**CMake 场景**：

```bash
$ cmake --build .
[ 50%] Building CXX object CMakeFiles/myapp.dir/main.cpp.o
[100%] Linking CXX executable myapp

# 改了 utils.cpp 之后：
$ cmake --build .
[ 50%] Building CXX object CMakeFiles/myapp.dir/utils.cpp.o    # ← 只编这一个！
[100%] Linking CXX executable myapp
```

依赖追踪流程：

```text
你改了 utils.cpp
        │
        ▼
CMake 检查 utils.cpp 的 mtime（修改时间）
        │
        ▼
对比 depend.make 里记录的"utils.cpp 依赖的 .h"
        │
        ▼
发现 utils.cpp.o 比它的依赖旧
        │
        ▼
只重编 utils.cpp.o → 重链 myapp
（main.cpp.o 没改，跳过）
```

> **原理一句话**：`build/CMakeFiles/.../depend.make` 记录了"谁依赖谁"；每次构建 CMake 比对 mtime，**只编真正过期的部分**。

### 2.5 跨平台：一处声明，处处编译 🌍

CMake 最大的杀手锏——**同一份 `CMakeLists.txt`，在三大平台都能编译**：

```cmake [CMakeLists.txt]
cmake_minimum_required(VERSION 3.16)
project(MyProject)

add_executable(myapp main.cpp)
target_compile_features(myapp PRIVATE cxx_std_17)
```

**Linux 上**（生成 Makefile，用 gcc）：

```bash
cmake -S . -B build
cmake --build build
```

**Windows 上**（生成 Visual Studio 工程，用 MSVC）：

```bash
cmake -S . -B build -G "Visual Studio 17 2022"
cmake --build build --config Release
```

**macOS 上**（生成 Ninja 文件，用 clang）：

```bash
cmake -S . -B build -G Ninja
cmake --build build
```

**命令行要做到同样的事**？得写一堆 `#ifdef _WIN32` / `#ifdef __linux__`，分别拼 `-I` `-L` `-l` 路径……惨不忍睹。

::: tip CMake 的本质：**与编译器解耦**
CMake 不直接调 `g++` / `cl.exe` / `clang`。它先**生成目标平台原生构建系统能识别的文件**（Makefile / Ninja / .vcxproj），再让原生构建系统去调真正的编译器。

这意味着：
- 你不需要在 CMake 里写"`g++ -O2`"，只需要写"`-O2`"（CMake 会翻译成对应平台的等价物）
- 升级编译器版本不需要改 CMakeLists.txt
- 加新平台不需要重写构建逻辑
:::

---

第三章将带你**亲手写一个完整的 CMakeLists.txt**——从单文件到多文件，再到带第三方库的项目，看 CMake 是怎么把这些能力在 `CMakeLists.txt` 里"声明"出来的。