# Gettext 在 wxWidgets 中的应用

## 初始化

wxWidgets 程序中使用 Gettext 需要在应用启动时初始化：

```cpp
// MyApp.cpp
#include <wx/intl.h>
#include <locale.h>

bool MyApp::OnInit()
{
    // 设置本地化
    setlocale(LC_ALL, "");  // 使用系统默认 locale
    wxLocale::AddCatalogLookupPathPrefix("/usr/share/locale");
    wxLocale locale;
    locale.Init(wxLANGUAGE_DEFAULT);  // 或指定如 wxLANGUAGE_CHINESE_SIMPLIFIED

    // 加载应用自身的 .mo 文件
    locale.AddCatalog("myapp");

    // ...
}
```

## 翻译字符串

### 基础用法

wxWidgets 提供了 `_()` 宏作为 `wxGetTranslation()` 的简写：

```cpp
#include <wx/intl.h>

// 方式1：使用 _() 宏
wxMessageBox(_("Hello, world!"));

// 方式2：显式调用
wxMessageBox(wxGetTranslation("Hello, world!"));

// 方式3：使用 wxTRANSLATE (延迟翻译，用于常量)
wxMessageBox(wxTRANSLATE("This will be translated at runtime"));
```

### UI 资源翻译

```cpp
// 菜单项
menuFile->Append(wxID_OPEN, _("&Open"));
menuFile->Append(wxID_SAVE, _("&Save"));

// 按钮
button = new wxButton(parent, wxID_ANY, _("Click me"));

// 静态文本
staticText = new wxStaticText(parent, wxID_ANY, _("Welcome"));
```

## 单复数处理

使用 `wxPLURAL()` 处理单复数：

```cpp
#include <wx/intl.h>

int count = fileList.GetCount();
wxString msg = wxString::Format(
    wxPLURAL("Found %d file", "Found %d files", count),
    count
);
wxMessageBox(msg);
```

## 中文翻译示例

### .po 文件编写

```po
# Chinese (Simplified) translations
msgid ""
msgstr ""
"Project-Id-Version: myapp 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Language: zh_CN\n"

msgid "Hello, world!"
msgstr "你好，世界！"

msgid "Open"
msgstr "打开"

msgid "Save"
msgstr "保存"

msgid "Found %d file"
msgid_plural "Found %d files"
msgstr[0] "找到 %d 个文件"
msgstr[1] "找到 %d 个文件"
```

## CMake 集成

配合 wxWidgets 的 CMake 工程使用 Gettext：

```cmake
# CMakeLists.txt
find_package(Gettext REQUIRED)

# 提取翻译字符串
find_program(XGETTEXT xgettext)

set(POT_FILE "${CMAKE_SOURCE_DIR}/po/myapp.pot")
set(PO_FILES zh_CN)

# 自动提取 .cpp 中的可翻译字符串
add_custom_target(update-pot
    COMMAND ${XGETTEXT} -d myapp -o ${POT_FILE}
            ${CMAKE_SOURCE_DIR}/src/*.cpp
    COMMENT "Updating POT file"
)

# 编译 .po -> .mo
foreach(po_file ${PO_FILES})
    set(mo_file "${CMAKE_BINARY_DIR}/po/${po_file}/LC_MESSAGES/myapp.mo")
    add_custom_command(
        OUTPUT ${mo_file}
        COMMAND ${MSGFMT} -o ${mo_file} ${CMAKE_SOURCE_DIR}/po/${po_file}.po
        DEPENDS ${CMAKE_SOURCE_DIR}/po/${po_file}.po
    )
endforeach()
```

## 最佳实践

1. **始终使用 `_()` 或 `wxGetTranslation()`** 包裹用户可见字符串
2. **UI 初始化时设置 locale**，确保翻译在显示前生效
3. **使用 UTF-8 编码**的 .po 文件，避免乱码
4. **使用 wxTRANSLATE()** 处理编译时无法确定的字符串（如配置文件内容）

## 常见问题

### 翻译不生效

- 检查 .mo 文件是否放在正确目录 `/usr/share/locale/<lang>/LC_MESSAGES/`
- 确认 `locale.AddCatalog("myapp")` 成功调用
- 使用 `wxLocale::GetCanonicalName()` 确认语言名称正确

### 特殊字符和格式

```cpp
// 格式化字符串中的 % 需要转义为 %%
wxString msg = wxString::Format(_("Progress: %d%%"), percent);

// 多行文本使用 \n
wxMessageBox(_("Line 1\nLine 2"));
```
