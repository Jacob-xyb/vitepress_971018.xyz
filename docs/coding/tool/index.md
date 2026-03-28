# 工具

编程中使用的各种工具笔记。

## Gettext

Gettext 是 GNU 项目提供的国际化 (i18n) 和本地化 (l10n) 框架，广泛用于多语言支持。

### 简介

Gettext 通过 `.po` / `.mo` 文件管理翻译，程序运行时根据 locale 自动加载对应语言。

### 通用语法

#### C/C++

```c
#include <libintl.h>
#include <locale.h>

// 设置本地化
setlocale(LC_ALL, "");
bindtextdomain("myapp", "/usr/share/locale");
textdomain("myapp");

// 翻译调用
printf(gettext("Hello, world!\n"));
// 简化写法
printf(_("Hello, world!\n"));
```

#### Python

```python
import gettext

# 安装翻译
t = gettext.translation('myapp', localedir='/usr/share/locale', languages=['zh_CN'])
_ = t.gettext

# 使用
print(_("Hello, world!"))
```

#### 关键函数

| 函数 | 用途 |
|------|------|
| `gettext()` / `_()` | 获取翻译字符串 |
| `ngettext()` | 单复数翻译 |
| `dgettext()` | 指定域的翻译 |
| `dcgettext()` | 指定域和分类的翻译 |

### 工作流程

```bash
# 1. 提取可翻译字符串
xgettext -d myapp -o myapp.po main.c

# 2. 编辑 .po 文件，添加翻译
# msgid "Hello, world!"
# msgstr "你好，世界！"

# 3. 编译 .po -> .mo
msgfmt -o myapp.mo myapp.po

# 4. 安装到 locale 目录
cp myapp.mo /usr/share/locale/zh_CN/LC_MESSAGES/myapp.mo
```

### 相关文件

- **.po** - 可编辑的翻译文件 (Portable Object)
- **.mo** - 编译后的二进制文件 (Machine Object)
- **.pot** - 模板文件 (Portable Object Template)
