# Qt 安装 QScintilla

## 详细步骤

Qt的在线安装工具确实不像Visual Studio那样，可以一键勾选组件来添加QScintilla。这是因为QScintilla是一个第三方的开源库，不是Qt官方自带的模块。因此，需要通过编译源码的方式，手动将其集成到你现有的Qt环境中。

整个过程主要分为三步：下载源码、编译并安装库文件、配置Qt项目以使用它。

### 📥 第一步：下载QScintilla源码

首先，从QScintilla的官方网站下载与你的Qt 5.15.2兼容的源码包。通常选择最新的稳定版本即可。

*   **官方下载地址**：[Riverbank Computing | QScintilla Download](https://riverbankcomputing.com/software/qscintilla/download)
*   **选择文件**：在Windows系统下，请下载 `QScintilla_src-` 开头的 `.zip` 文件；Linux和macOS用户则下载 `.tar.gz` 文件。

下载完成后，将源码解压到一个你熟悉的目录，例如 `C:\QScintilla_src`。

### 🛠️ 第二步：编译并安装

编译过程分为两个主要部分：核心库和Qt Designer插件。下面以**Windows + MSVC编译器**为例进行说明，这是与Qt 5.15.2组合最常见的情况。如果你使用的是MinGW或Linux/macOS，原理相同，具体路径和命令请参考中的对应章节。

#### **1. 编译核心库**

##### Qt Creator 编译

*   **打开项目**：打开Qt Creator，选择“打开文件或项目”，导航到解压后的源码目录，进入 `src` 文件夹，选择 `qscintilla.pro` 文件打开。
*   **配置项目**：当Qt Creator提示配置项目时，务必选择你正在使用的Kit，通常是 `Desktop Qt 5.15.2 MSVC2019 64bit`。
*   **编译**：点击左下角的“构建”按钮（绿色三角形旁边的锤子图标），选择“Release”模式进行构建。

##### VS 命令行编译

1.  **打开正确的命令行工具**
    打开 **“Visual Studio 2019/2022 的开发者命令提示符”**（x64 Native Tools Command Prompt for VS 2019/2022）。**关键**是确保这个命令提示符里的 `cl.exe` 编译器和你 Qt 安装包使用的 MSVC 版本（比如 `msvc2019_64`）是匹配的。

2.  **进入源码目录并设置 Qt 环境**
    在命令行中，使用 `cd` 命令进入你解压后的 QScintilla 源码目录，具体是进入里面的 `src` 文件夹（检查里面有里面的 qscintilla.pro 文件）：
    ```bash
    cd D:\your_path\QScintilla_src\src
    ```
    为了让系统能找到 `qmake` 工具，需要将你的 Qt 安装目录下的 `bin` 文件夹临时添加到系统路径中。请将下面的 `D:\Qt\5.15.2\msvc2019_64\bin` 替换成你电脑上的实际路径：
    ```bash
    set path=D:\Qt\5.15.2\msvc2019_64\bin;%path%
    ```

3.  **生成 Makefile 并开始编译**
    依次执行以下两条命令：
    ```bash
    qmake qscintilla.pro
    nmake
    ```
    *   `qmake` 命令会根据你的环境自动生成一个 `Makefile` 文件。
    *   然后 `nmake` 命令（Visual Studio 的 `make` 工具）就会读取这个 `Makefile` 并开始真正的编译工作。这个过程会持续几分钟。

4.  **编译完成**
    如果没有报错，编译成功后，你会在当前目录或其下的 `release` 文件夹里找到新生成的核心库文件 `qscintilla2_qt5.dll` 和 `qscintilla2_qt5.lib`。


##### install 复制文件

1. namke 编译成功后可以使用 `nmake install` 自动复制所需文件到指定目录

2. **手动复制文件**
    你需要手动将生成的文件复制到你的 Qt 安装目录下，以便所有项目都能使用它：
    *   将 `qscintilla2_qt5.dll` 复制到 `D:\Qt\5.15.2\msvc2019_64\bin`
    *   将 `qscintilla2_qt5.lib` 复制到 `D:\Qt\5.15.2\msvc2019_64\lib`
    *   将源码目录 `src` 下的 `Qsci` 文件夹**整个**复制到 `D:\Qt\5.15.2\msvc2019_64\include`

#### **2. 编译Qt Designer插件（可选）**

为了让QScintilla控件能像普通Qt控件一样，在Qt Designer的界面设计器里直接拖拽使用，你需要编译并安装插件。

*   **打开插件项目**：在Qt Creator中，打开源码目录下的 `designer` 文件夹，选择 `designer.pro` 文件。
*   **修改项目文件（重要）**：在打开的 `designer.pro` 文件中，添加一行代码，告诉编译器去哪里找刚刚编译好的QScintilla库：
    ```pro
    LIBS += -LD:\Qt\5.15.2\msvc2019_64\lib -lqscintilla2_qt5
    ```
*   **编译**：同样选择 `Release` 模式进行构建。
*   **复制插件**：编译成功后，在 `designer` 文件夹下的 `release` 目录中，会生成 `qscintillaplugin.dll` 文件。将其复制到Qt的插件目录中：
    *   复制到 `D:\Qt\5.15.2\msvc2019_64\plugins\designer`
*   **验证**：重启Qt Designer（可以在Qt Creator中双击一个 `.ui` 文件来启动），你将在控件列表的最下方看到由QScintilla提供的控件。

### 💻 第三步：在项目中使用QScintilla

::: warning 注意
 QT += qscintilla2 会报错，因为 qscintilla2 不是 Qt 的官方模块，不能通过 QT 变量自动引入。QScintilla 是一个第三方库，需要手动配置头文件路径和链接库。
:::

#### 自动识别

- .prf 文件工作原理

📖 原理：.prf 文件是如何工作的？
.prf (Feature) 文件是Qt qmake的扩展机制。当你在项目的 .pro 文件中写下 CONFIG += qscintilla2 时，qmake 会自动去特定目录下寻找名为 qscintilla2.prf 的文件并加载它。这个文件里预先写好了QScintilla需要的所有配置（如 INCLUDEPATH、LIBS 等）。

这个文件应该在执行 make install 时，被自动复制到你的Qt安装目录下的 mkspecs/features 文件夹中。由于你之前没有执行安装，这个文件不存在，所以qmake才会报错。

---

如果使用了 `nmake install` 命令，QScintilla的头文件、库文件、Designer插件等都已经自动安装到你的Qt安装目录下，你只需要在你的项目文件（`.pro`）中添加以下代码：
```qmake
CONFIG += qscintilla2
```

如果没执行 、`nmake install` 命令，你需要手动配置 `.prf` 文件。

::: warning 注意
.pri 是官方库，.prf 是第三方库，两者的区别在于 .pri 是 Qt 自带的库，.prf 是第三方库，需要手动配置。
:::

- 源码 `.prf` 文件路径： `QScintilla_src-2.14.1/src/features/qscintilla2.prf`
- 需要复制到的路径： `Qt\5.15.2\msvc2019_64\mkspecs\features\qscintilla2.prf`

这样，Qt Creator会自动识别QScintilla并添加相应的依赖项。

#### 手动配置
在你自己的Qt项目中，要成功使用QScintilla，必须在项目文件（`.pro`）中添加包含路径和库的链接。

在你的 `.pro` 文件中添加以下代码（同样，请将路径替换为你自己的Qt安装目录）：

```qmake
# 添加头文件路径
INCLUDEPATH += D:\Qt\5.15.2\msvc2019_64\include\Qsci

# 链接QScintilla库
# 如果编译的是Debug版本，使用 -lqscintilla2_qt5d
# 如果编译的是Release版本，使用 -lqscintilla2_qt5
CONFIG(debug, debug|release) {
    LIBS += -LD:\Qt\5.15.2\msvc2019_64\lib -lqscintilla2_qt5d
} else {
    LIBS += -LD:\Qt\5.15.2\msvc2019_64\lib -lqscintilla2_qt5
}
```

如果之前你已经将 QScintilla 的头文件、库文件复制到了 Qt 安装目录的对应位置（如 include\Qsci、lib\qscintilla2_qt5.lib、bin\qscintilla2_qt5.dll），那么上述路径可以简写为：

```qmake
INCLUDEPATH += $$[QT_INSTALL_HEADERS]/Qsci
LIBS += -L$$[QT_INSTALL_LIBS] -lqscintilla2_qt5
```

--- 

完成这些配置后，你就可以在你的代码中包含 `#include <Qsci/qsciscintilla.h>` 来使用这个强大的代码编辑器控件了。如果后续需要在Qt Creator里调试QScintilla的源码，可以参考中的方法，把对应的 `.pdb` 文件也一起复制过来。

## 检验

要确认QScintilla是否已成功安装到你的Qt环境中，可以通过以下三种方法进行验证。从最简单的文件检查到实际的编译测试，你可以根据自己的情况选择。

### 1️⃣ 检查关键文件是否存在

根据你的Qt安装路径（假设为 `D:\Qt\5.15.2\msvc2019_64`），请确认以下文件是否存在：

| 文件类型 | 预期路径 | 说明 |
|---------|---------|------|
| **头文件** | `D:\Qt\5.15.2\msvc2019_64\include\Qsci` 目录，内有 `qsciscintilla.h` 等 | 必须存在，否则编译时找不到头文件 |
| **库文件**（Windows） | `D:\Qt\5.15.2\msvc2019_64\lib\qscintilla2_qt5.lib`<br>`D:\Qt\5.15.2\msvc2019_64\bin\qscintilla2_qt5.dll` | Release版本 |
| **库文件**（Linux） | `/usr/lib/libqscintilla2_qt5.so` 或 Qt目录下的类似位置 | 根据安装方式不同可能在其他路径 |
| **Designer插件**（可选） | `D:\Qt\5.15.2\msvc2019_64\plugins\designer\qscintillaplugin.dll` | 如果编译了插件，该文件存在则Qt Designer中会出现控件 |

如果这些文件都存在，基本可以认为QScintilla已正确安装。

### 2️⃣ 在Qt Designer中检查

- 打开Qt Designer（可以从Qt Creator中双击一个 `.ui` 文件启动）。
- 在左侧控件栏的最底部，查看是否有 **“QScintilla”** 分类。
- 如果有，说明Designer插件已安装成功，可以直接拖拽使用。
- 如果没有，但你通过“提升部件”方式使用，这不影响实际运行，只是设计时不能直接拖拽。

### 3️⃣ 编写一个简单的测试程序

创建一个新的Qt项目，在 `.pro` 文件中添加必要的包含路径和库链接（参考之前的回答），然后尝试编译运行以下代码：

```cpp
#include <QApplication>
#include <Qsci/qsciscintilla.h>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    QsciScintilla editor;
    editor.setText("Hello QScintilla!");
    editor.show();
    return app.exec();
}
```

如果能够成功编译并运行，弹出一个带有文本的编辑器窗口，则说明QScintilla已经完整可用。

---

**常见问题**：如果编译时出现“找不到头文件”或“未定义的引用”错误，通常是因为 `.pro` 文件中的 `INCLUDEPATH` 和 `LIBS` 配置不正确，或者库文件未复制到正确的Qt目录下。请对照第1步的文件检查，确保路径一致。

## 部署

windeployqt 只处理 Qt 官方模块，QScintilla 是第三方库，需要手动复制