# wxWidgets 入门

## 第一个窗口

```cpp
#include <wx/wx.h>

class MyApp : public wxApp {
public:
    virtual bool OnInit() override;
};

class MyFrame : public wxFrame {
public:
    MyFrame(const wxString& title);

private:
    void OnHello(wxCommandEvent& event);
    void OnExit(wxCommandEvent& event);
    void OnAbout(wxCommandEvent& event);
};

wxBEGIN_EVENT_TABLE(MyFrame, wxFrame)
    EVT_MENU(wxID_EXIT, MyFrame::OnExit)
    EVT_MENU(wxID_ABOUT, MyFrame::OnAbout)
wxEND_EVENT_TABLE()

wxIMPLEMENT_APP(MyApp);

bool MyApp::OnInit() {
    MyFrame* frame = new MyFrame("第一个 wxWidgets 程序");
    frame->Show(true);
    return true;
}

MyFrame::MyFrame(const wxString& title)
    : wxFrame(nullptr, wxID_ANY, title) {

    // 创建菜单栏
    wxMenu* menuFile = new wxMenu;
    menuFile->Append(wxID_EXIT);

    wxMenu* menuHelp = new wxMenu;
    menuHelp->Append(wxID_ABOUT);

    wxMenuBar* menuBar = new wxMenuBar;
    menuBar->Append(menuFile, "&文件");
    menuBar->Append(menuHelp, "&帮助");

    SetMenuBar(menuBar);
    CreateStatusBar();
    SetStatusText("欢迎使用 wxWidgets！");
}

void MyFrame::OnExit(wxCommandEvent& event) {
    Close(true);
}

void MyFrame::OnAbout(wxCommandEvent& event) {
    wxMessageBox("wxWidgets 入门示例",
                  "关于", wxOK | wxICON_INFORMATION);
}
```

## 编译运行

### 使用 GCC

```bash
g++ -std=c++17 main.cpp -o app \
    $(wx-config --cxxflags --libs)
```

### 使用 CMake

```cmake
cmake_minimum_required(VERSION 3.16)
project(MyApp)

find_package(wxWidgets REQUIRED COMPONENTS core base)

add_executable(MyApp main.cpp)
target_link_libraries(MyApp PRIVATE ${wxWidgets_LIBRARIES})
target_include_directories(MyApp PRIVATE ${wxWidgets_INCLUDE_DIRS})
```

## 代码详解

### 核心概念

| 概念 | 说明 |
|------|------|
| **wxApp** | 应用程序类，整个程序只有一个实例，负责初始化和退出 |
| **wxFrame** | 窗口框架，包含标题栏、菜单栏、状态栏的主窗口 |
| **wxWindow** | 所有 UI 控件的基类 |
| **Event Table** | 事件表，声明哪些成员函数处理哪些事件 |
| **wxWidgets 宏** | 以 `wx` 开头，如 `wxBEGIN_EVENT_TABLE`、`wxIMPLEMENT_APP` |

### 分段解析

#### 1. 引入头文件

```cpp
#include <wx/wx.h>
```

wxWidgets 的主头文件，包含了所有常用类和函数。

#### 2. 定义应用程序类

```cpp
class MyApp : public wxApp {
public:
    virtual bool OnInit() override;
};
```

- `wxApp` 是所有 wxWidgets 应用程序的基类
- `OnInit()` 是应用程序的入口点，类似 `main()` 函数
- 返回 `true` 表示初始化成功，程序继续运行

#### 3. 定义主窗口类

```cpp
class MyFrame : public wxFrame {
public:
    MyFrame(const wxString& title);

private:
    void OnHello(wxCommandEvent& event);
    void OnExit(wxCommandEvent& event);
    void OnAbout(wxCommandEvent& event);
};
```

- `wxFrame` 是主窗口类，包含标题栏、菜单栏等
- 事件处理函数必须符合特定签名：`返回 void，接受一个事件引用参数`

#### 4. 事件表

```cpp
wxBEGIN_EVENT_TABLE(MyFrame, wxFrame)
    EVT_MENU(wxID_EXIT, MyFrame::OnExit)
    EVT_MENU(wxID_ABOUT, MyFrame::OnAbout)
wxEND_EVENT_TABLE()
```

事件表是 wxWidgets 独特的机制，用于将事件与处理函数关联：

- `EVT_MENU(控件ID, 处理类::处理函数)` - 当用户点击菜单时调用
- `wxID_EXIT` 和 `wxID_ABOUT` 是 wxWidgets 预定义的标准 ID

#### 5. 应用程序入口宏

```cpp
wxIMPLEMENT_APP(MyApp);
```

告诉 wxWidgets 创建应用程序实例并启动程序，必须在所有 wxApp 相关代码之后使用。

#### 6. OnInit() - 应用程序初始化

```cpp
bool MyApp::OnInit() {
    MyFrame* frame = new MyFrame("第一个 wxWidgets 程序");
    frame->Show(true);
    return true;
}
```

- 创建主窗口实例，参数：父窗口(`nullptr` 表示无父窗口)、窗口 ID、标题
- `Show(true)` 显示窗口，默认为隐藏状态
- 返回 `true` 表示初始化成功，程序进入主循环

#### 7. MyFrame 构造函数 - 创建 UI

```cpp
MyFrame::MyFrame(const wxString& title)
    : wxFrame(nullptr, wxID_ANY, title) {
    // ...
}
```

使用初始化列表调用基类构造函数，参数：父窗口、窗口 ID、标题、位置(默认)、大小(默认)。

**菜单创建流程：**

```cpp
wxMenu* menuFile = new wxMenu;      // 创建"文件"下拉菜单
menuFile->Append(wxID_EXIT);        // 添加"退出"菜单项

wxMenu* menuHelp = new wxMenu;      // 创建"帮助"下拉菜单
menuHelp->Append(wxID_ABOUT);       // 添加"关于"菜单项

wxMenuBar* menuBar = new wxMenuBar; // 创建菜单栏
menuBar->Append(menuFile, "&文件"); // 将菜单添加到菜单栏
menuBar->Append(menuHelp, "&帮助");

SetMenuBar(menuBar);                 // 将菜单栏设置到窗口上
```

- `&` 表示助记符，按 `Alt+对应字母` 可快速访问菜单
- `CreateStatusBar()` 创建底部状态栏
- `SetStatusText()` 设置状态栏显示的文本

#### 8. 事件处理函数

```cpp
void MyFrame::OnExit(wxCommandEvent& event) {
    Close(true);
}

void MyFrame::OnAbout(wxCommandEvent& event) {
    wxMessageBox("wxWidgets 入门示例",
                  "关于", wxOK | wxICON_INFORMATION);
}
```

- `Close(true)` 关闭窗口，参数 `true` 表示强制关闭
- `wxMessageBox()` 显示消息对话框，参数：消息内容、窗口标题、按钮样式|图标样式

## 代码结构总结

```
┌─────────────────────────────────────────────────────────┐
│                      MyApp                               │
│  (wxApp 子类，整个程序只有一个)                           │
│                                                         │
│  OnInit() ──────────────────────────────────────────┐  │
│    │ 创建 MyFrame 并显示                              │  │
│    ▼                                                 │  │
│  程序进入主循环                                       │  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      MyFrame                            │
│  (wxFrame 子类，主窗口)                                  │
│                                                         │
│  ├─ MenuBar (菜单栏)                                    │
│  │   ├─ File 菜单 → Exit (退出)                       │
│  │   └─ Help 菜单 → About (关于)                      │
│  │                                                    │
│  └─ StatusBar (状态栏)                                 │
│                                                         │
│  事件表将菜单项与 OnExit/OnAbout 函数关联                │
└─────────────────────────────────────────────────────────┘
```

## 下一步

- 学习如何在窗口中添加按钮、文本框等控件 → [wxWidgets 安装](./install.md)
- 了解 Gettext 多语言支持 → [Gettext 在 wxWidgets 中的应用](../tool/gettext-wxwidgets.md)
