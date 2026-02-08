# 文件读写

文件读写是编程中最基础也是最常用的操作之一。本文介绍不同编程语言中的文件读写方法。

## 基本读取

::: code-group

```python [Python]
# 读取整个文件
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    print(content)

# 按行读取
with open('file.txt', 'r', encoding='utf-8') as f:
    for line in f:
        print(line.strip())
```

```cpp [C++]
#include <fstream>
#include <string>
#include <iostream>

// 读取整个文件
std::ifstream inFile("file.txt");
std::string line;
while (std::getline(inFile, line)) {
    std::cout << line << std::endl;
}
inFile.close();
```

:::

## 基本写入

::: code-group

```python [Python]
# 写入文件（覆盖）
with open('file.txt', 'w', encoding='utf-8') as f:
    f.write('Hello World\n')
    f.write('Second line\n')

# 追加写入
with open('file.txt', 'a', encoding='utf-8') as f:
    f.write('Appended line\n')
```

```cpp [C++]
#include <fstream>

// 写入文件（覆盖）
std::ofstream outFile("file.txt");
outFile << "Hello World" << std::endl;
outFile << "Second line" << std::endl;
outFile.close();

// 追加写入
std::ofstream appendFile("file.txt", std::ios::app);
appendFile << "Appended line" << std::endl;
appendFile.close();
```

:::

## 其他语言示例

## 其他语言示例

### Python 文件模式

| 模式 | 说明 |
|------|------|
| `'r'` | 只读模式（默认） |
| `'w'` | 写入模式（覆盖） |
| `'a'` | 追加模式 |
| `'r+'` | 读写模式 |
| `'b'` | 二进制模式（如 `'rb'`, `'wb'`） |

### Python JSON 文件

```python
import json

# 读取 JSON
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 写入 JSON
data = {'name': 'Alice', 'age': 25}
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

### JavaScript/Node.js 文件读写

| 模式 | 说明 |
|------|------|
| `'r'` | 只读模式（默认） |
| `'w'` | 写入模式（覆盖） |
| `'a'` | 追加模式 |
| `'r+'` | 读写模式 |
| `'b'` | 二进制模式（如 `'rb'`, `'wb'`） |

### JSON 文件

```python
import json

# 读取 JSON
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 写入 JSON
data = {'name': 'Alice', 'age': 25}
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

## JavaScript/Node.js 文件读写

### 同步读写

```javascript
const fs = require('fs');

// 读取文件
const content = fs.readFileSync('file.txt', 'utf-8');
console.log(content);

// 写入文件
fs.writeFileSync('file.txt', 'Hello World\n', 'utf-8');

// 追加写入
fs.appendFileSync('file.txt', 'Appended line\n', 'utf-8');
```

### 异步读写

```javascript
const fs = require('fs').promises;

// 读取文件
async function readFile() {
  try {
    const content = await fs.readFile('file.txt', 'utf-8');
    console.log(content);
  } catch (error) {
    console.error('读取失败:', error);
  }
}

// 写入文件
async function writeFile() {
  try {
    await fs.writeFile('file.txt', 'Hello World\n', 'utf-8');
    console.log('写入成功');
  } catch (error) {
    console.error('写入失败:', error);
  }
}
```

### JSON 文件

```javascript
const fs = require('fs').promises;

// 读取 JSON
async function readJSON() {
  const content = await fs.readFile('data.json', 'utf-8');
  const data = JSON.parse(content);
  return data;
}

// 写入 JSON
async function writeJSON(data) {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile('data.json', content, 'utf-8');
}
```

## Java 文件读写

### 使用 Files 类（推荐）

```java
import java.nio.file.*;
import java.util.List;

// 读取整个文件
String content = Files.readString(Path.of("file.txt"));

// 读取所有行
List<String> lines = Files.readAllLines(Path.of("file.txt"));

// 写入文件
Files.writeString(Path.of("file.txt"), "Hello World\n");

// 写入多行
List<String> lines = List.of("Line 1", "Line 2", "Line 3");
Files.write(Path.of("file.txt"), lines);
```

### 使用 BufferedReader/Writer

```java
import java.io.*;

// 读取文件
try (BufferedReader reader = new BufferedReader(
        new FileReader("file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// 写入文件
try (BufferedWriter writer = new BufferedWriter(
        new FileWriter("file.txt"))) {
    writer.write("Hello World\n");
    writer.write("Second line\n");
}
```

## C++ 文件读写

### 基本读写

```cpp
#include <fstream>
#include <string>
#include <iostream>

// 读取文件
std::ifstream inFile("file.txt");
std::string line;
while (std::getline(inFile, line)) {
    std::cout << line << std::endl;
}
inFile.close();

// 写入文件
std::ofstream outFile("file.txt");
outFile << "Hello World" << std::endl;
outFile << "Second line" << std::endl;
outFile.close();

// 追加写入
std::ofstream appendFile("file.txt", std::ios::app);
appendFile << "Appended line" << std::endl;
appendFile.close();
```

### 读取整个文件

```cpp
#include <fstream>
#include <sstream>
#include <string>

std::ifstream file("file.txt");
std::stringstream buffer;
buffer << file.rdbuf();
std::string content = buffer.str();
```

## 最佳实践

### 1. 使用 with 语句（Python）

```python
# ✅ 推荐：自动关闭文件
with open('file.txt', 'r') as f:
    content = f.read()

# ❌ 不推荐：需要手动关闭
f = open('file.txt', 'r')
content = f.read()
f.close()
```

### 2. 指定编码

```python
# ✅ 推荐：明确指定编码
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# ❌ 不推荐：使用默认编码（可能导致乱码）
with open('file.txt', 'r') as f:
    content = f.read()
```

### 3. 异常处理

```python
try:
    with open('file.txt', 'r', encoding='utf-8') as f:
        content = f.read()
except FileNotFoundError:
    print('文件不存在')
except PermissionError:
    print('没有权限')
except Exception as e:
    print(f'发生错误: {e}')
```

### 4. 检查文件是否存在

```python
import os

# 检查文件是否存在
if os.path.exists('file.txt'):
    with open('file.txt', 'r') as f:
        content = f.read()
else:
    print('文件不存在')

# 检查是否为文件
if os.path.isfile('file.txt'):
    print('是文件')

# 检查是否为目录
if os.path.isdir('folder'):
    print('是目录')
```

### 5. 路径处理

```python
from pathlib import Path

# 使用 Path 对象
file_path = Path('data') / 'file.txt'

# 读取文件
content = file_path.read_text(encoding='utf-8')

# 写入文件
file_path.write_text('Hello World', encoding='utf-8')

# 检查文件是否存在
if file_path.exists():
    print('文件存在')
```

## 常见问题

### Q: 如何避免中文乱码？

**A:** 始终指定 UTF-8 编码：

```python
# Python
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Node.js
fs.readFileSync('file.txt', 'utf-8')

# Java
Files.readString(Path.of("file.txt"), StandardCharsets.UTF_8)
```

### Q: 如何读取大文件？

**A:** 按行读取，避免一次性加载到内存：

```python
# Python - 逐行处理
with open('large_file.txt', 'r', encoding='utf-8') as f:
    for line in f:
        process(line.strip())

# Node.js - 使用流
const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('large_file.txt');
const rl = readline.createInterface({ input: stream });

rl.on('line', (line) => {
    process(line);
});
```

### Q: 如何确保文件被正确关闭？

**A:** 使用上下文管理器或 try-finally：

```python
# Python - with 语句（推荐）
with open('file.txt', 'r') as f:
    content = f.read()

# Python - try-finally
f = open('file.txt', 'r')
try:
    content = f.read()
finally:
    f.close()

# Java - try-with-resources
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
}
```

## 相关资源

- [Python 官方文档 - 文件读写](https://docs.python.org/zh-cn/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Node.js 官方文档 - File System](https://nodejs.org/api/fs.html)
- [Java 官方文档 - Files](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/file/Files.html)
