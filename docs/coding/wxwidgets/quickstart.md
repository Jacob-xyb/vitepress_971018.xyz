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
