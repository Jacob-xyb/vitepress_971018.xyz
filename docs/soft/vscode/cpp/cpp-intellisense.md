# C/C++: Reset IntelliSense Database

## 作用

IntelliSense Database 是 VS Code C/C++ 扩展用于代码智能补全、导航和诊断的索引数据库。当 C++ 代码出现以下问题时，尝试重置它：

- 代码明明没有错误，但显示红色波浪线
- 补全列表不出现或显示错误的符号
- 跳转到定义失败
- 重构功能异常

## 操作步骤

1. 打开命令面板：`Ctrl + Shift + P`（或 `Cmd + Shift + P`）
2. 输入 `C/C++: Reset IntelliSense Database`
3. 按回车执行

重置完成后，扩展会自动重新构建数据库。

## 手动清理（可选）

如果命令不起效，可以手动删除数据库目录：

```bash
# Windows
rd /s /q %USERPROFILE%\.vscode\extensions\ms-vscode.cpptools\~

# Linux/macOS
rm -rf ~/.vscode/extensions/ms-vscode.cpptools-*/
```

删除后重启 VS Code，扩展会自动重新初始化。

## 原理

IntelliSense 使用数据库存储：

- 符号表（类、函数、变量）
- 头文件解析结果
- 交叉引用信息

数据库损坏会导致这些功能异常。重置本质是清空旧数据，让扩展重新解析项目。

## 核心配置

### includePath

用于 **IntelliSense 引擎**，影响代码补全和错误检测：

- 代码补全提示
- 红色错误波浪线（未解析的符号）
- 悬停提示信息

### browse.path

用于 **符号索引**，影响符号导航功能：

- 跳转到定义 (Go to Definition)
- 查找所有引用 (Find All References)
- 查找符号 (Find Symbol)

::: tip
这两个配置是独立的，可以单独配置。如果 `includePath` 正确但跳转失败，通常需要检查 `browse.path`。
:::

## 配置示例

在 `.vscode/c_cpp_properties.json` 中配置：

```json
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "${workspaceFolder}/**",
                "${default}",
                "C:/wxWidgets-3.2.2.1/include",
                "C:/wxWidgets-3.2.2.1/include/msvc"
            ],
            "browse": {
                "path": [
                    "${workspaceFolder}",
                    "C:/wxWidgets-3.2.2.2/include",
                    "C:/wxWidgets-3.2.2.2/lib"
                ],
                "limitSymbolsToIncludedHeaders": false
            }
        }
    ]
}
```

### 常用变量

| 变量 | 说明 |
|------|------|
| `${workspaceFolder}` | 当前工作区根目录 |
| `${default}` | 扩展默认的系统头文件路径 |
| `${workspaceFolder}/**` | 递归匹配工作区下所有文件 |

### 配置建议

1. **includePath** - 添加项目依赖的第三方库路径，如 wxWidgets、Boost 等
2. **browse.path** - 如果跳转失败，可以将 includePath 中的路径也添加到这里
3. **limitSymbolsToIncludedHeaders** - 设为 `false` 可索引所有匹配到的文件

## 相关配置

```json
{
    "C_Cpp.intelliSenseEngine": "default",
    "C_Cpp.database直径": 5000,
    "C_Cpp.addWorkspaceRootToWorkspacePath": true
}
```
