# Python

Python 是一门简洁、易读、功能强大的通用编程语言。

## 特点

- 语法简洁优雅，易于学习
- 丰富的标准库和第三方库
- 跨平台支持
- 广泛应用于数据分析、Web开发、自动化等领域

## 基础知识

### 数据类型

Python 的基本数据类型包括：

- 数字类型：`int`、`float`、`complex`
- 字符串：`str`
- 布尔值：`bool`
- 列表：`list`
- 元组：`tuple`
- 字典：`dict`
- 集合：`set`

### 变量与赋值

```python
# 变量赋值
name = "Python"
version = 3.12
is_awesome = True

# 多重赋值
x, y, z = 1, 2, 3
```

### 控制流

```python
# 条件语句
if condition:
    # 执行代码
elif another_condition:
    # 执行代码
else:
    # 执行代码

# 循环
for item in iterable:
    # 执行代码

while condition:
    # 执行代码
```

### 函数

```python
def greet(name):
    """问候函数"""
    return f"Hello, {name}!"

# 调用函数
message = greet("World")
```

### 类与对象

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我是 {self.name}，{self.age} 岁"

# 创建对象
person = Person("张三", 25)
print(person.introduce())
```

## 常用库

- `os`、`sys`：系统操作
- `datetime`：日期时间处理
- `json`：JSON 数据处理
- `re`：正则表达式
- `requests`：HTTP 请求
- `numpy`：数值计算
- `pandas`：数据分析

## 学习资源

- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [Python 教程](https://docs.python.org/zh-cn/3/tutorial/)
