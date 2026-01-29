---
outline: deep
---

# MarkDown Awesome

## 好用的MarkDown工具


- [Typora](https://typoraio.cn/) - 强大的MarkDown编辑器

	一款 Markdown 编辑器和阅读器<br>
	89元 / 3台设备 / 免费升级  
	风格极简 / 多种主题 / 支持 macOS，Windows 及 Linux  
	实时预览 / 图片与文字 / 代码块 / 数学公式 / 图表  
	目录大纲 / 文件管理 / 导入与导出 ……

- [mahua](https://mahua.jser.me/) - 一个在线编辑markdown文档的编辑器


- [Markdown 教程](https://markdown.com.cn/) - Markdown 教程

## 基础语法注意事项

### 换行

**在一行的末尾添加两个或多个空格，然后按回车键,即可创建一个换行(`<br>`)。**

---

几乎每个 Markdown 应用程序都支持两个或多个空格进行换行，称为 结尾空格(trailing whitespace) 的方式，但这是有争议的，因为很难在编辑器中直接看到空格，并且很多人在每个句子后面都会有意或无意地添加两个空格。由于这个原因，你可能要使用除结尾空格以外的其它方式来换行。幸运的是，几乎每个 Markdown 应用程序都支持另一种换行方式：HTML 的 `<br>` 标签。


**为了兼容性，请在行尾添加“结尾空格”或 HTML 的 `<br>` 标签来实现换行。**

---

注意！不要这样写 `<br>SpaceSpace回车`, 这样的后果是会多次换行。

### 强调语法

- 粗体 Bold

	两个星号或者下划线

- 斜体 Italic

	一个星号或者下划线

---

Markdown 应用程序在如何处理单词或短语中间的下划线上并不一致。为兼容考虑，在单词或短语中间部分加粗的话，请使用星号（asterisks）。


| ✅  Do this	| ❌  Don't do this |
| --- | --- |
| `Love**is**bold` | `Love__is__bold`|

---

- ***斜体加粗是一个一起用的，也就是三个星号。***

- **`*`和字体间不要有空格 **, 否则就会失效。


### 引用语法

keyword: `>`

- 单行引用 `> hello world` : 

	> hello word

- 多行引用, 为段落之间的空白行添加一个 > 符号。

	```markdown
	> hello
	>
	> world
	```

	> hello
	>
	> world

- 引用嵌套, 在要嵌套的段落前添加一个 >> 符号。

	```markdown
	> hello
	>> world
	>>> !
	```

	> hello
	>> world
	>>> !

- 引用中的其他元素

	块引用可以包含其他 Markdown 格式的元素。并非所有元素都可以使用，需要实际体验。

	```markdown
	>  **This is a heading.**
	>
	> This *is* a paragraph with [link](https://example.com).
	>
	```

	>  **This is a heading.**
	>
	> This *is* a paragraph with [link](https://example.com).
	>

### 代码语法

- 如果想在代码中展示反引号，可以用两个反引号来包裹：``show `code` ``

### 链接语法

超链接Markdown语法代码：`[超链接显示名](超链接地址 "超链接title")`

- 可以给链接加一个titile: 也就是悬停时会复现的文字： [Markdown语法](https://markdown.com.cn "最好的markdown教程")。

- 使用尖括号可以很方便地把URL或者email地址变成可点击的链接： <https://markdown.com.cn>

- 链接最佳实践

	不同的 Markdown 应用程序处理URL中间的空格方式不一样。为了兼容性，请尽量使用 `%20`代替空格。

	| ✅  Do this |	❌  Don't do this |
	| --- | --- |
	| [link](https://www.example.com/my%20great%20page)	| [link](https://www.example.com/my great page) |

#### 引用类型链接

在 Markdown 中，引用类型链接（Reference-style Link）是一种将“链接文本”与“链接地址”分离的写法。与常见的行内链接（文本）不同，它通过一个“标识符”来关联两者。

简单来说，你在正文中只写链接的显示文字和一个引用标签，而把具体的 URL 地址统一放在文档的其他位置（通常是末尾）进行定义。

🎯 主要作用

引用类型链接主要有两个优势：

1.  提升源码可读性：当文档中包含大量冗长的 URL 时，行内链接会让文本显得杂乱。引用类型链接让正文更干净，专注于内容写作。
2.  方便统一管理：如果同一个链接在文章中多次出现，你只需要定义一次地址，多处引用。修改时也只需改动一个地方。

📝 一般用法

引用类型链接的语法分为两个部分：正文中的链接标记 和 文档任意位置的链接定义。

1. 链接标记（在正文中）

格式为：`[链接显示文字][标识符]`

*   `[链接显示文字]`：用户在渲染后看到的可点击文字。
*   `[标识符]`：一个自定义的标签，用于关联定义。它不区分大小写，可以包含字母、数字。
*   注意：两个方括号之间可以有一个空格，也可以没有。

2. 链接定义（通常在段落后或文档末尾）

格式为：`[标识符]: URL地址 "可选的标题"`

*   `[标识符]`: 与正文中的标识符对应，后面紧跟一个冒号。
*   `URL地址`：链接的真实地址。
*   `"可选的标题"`：鼠标悬停在链接上时显示的提示文字，可以省略。

💻 代码示例

下面是一个完整的例子，展示了引用类型链接的写法和效果。

引用类型链接示例

欢迎访问我的 [个人博客][blog]，那里记录了我的技术心得。
同时，也可以关注一下 [Jacob的Github][github] 网站。

[blog]: https://www.example.com "我的个人主页"
[github]: https://github.com/Jacob-xyb "记录自己来时路"

💡 两种特殊情况

1.  隐式链接
    如果链接文本本身已经足够描述链接目标，你可以省略自定义的标识符，`直接写成 [Google][]`。此时，Markdown 会自动寻找下方定义的 `[Google]: ... ` 来匹配。

2.  快捷方式链接
    在某些 Markdown 解析器（如 Pandoc）中，如果链接文本和定义的标识符完全一致，你甚至可以省略正文中的第二个方括号，直接写成 `[个人博客]`，只要下方有对应的 `[个人博客]: ...` 定义即可。