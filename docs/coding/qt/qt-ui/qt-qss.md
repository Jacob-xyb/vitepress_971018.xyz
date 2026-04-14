# Qt QSS 样式表

Qt 样式表（QSS）是一种强大的样式设置机制，类似于 CSS，用于自定义 Qt 应用程序的外观。

## 特点

- 类似 CSS 的语法，易于学习和使用
- 支持选择器、属性、值的三元组结构
- 可应用于单个控件或整个应用程序
- 支持伪状态和子控件定义

## 基本语法

```qss
选择器 {
    属性: 值;
}
```

### 示例

```qss
QPushButton {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
}

QPushButton:hover {
    background-color: #2980b9;
}

QPushButton:pressed {
    background-color: #1a5276;
}
```

## 常用选择器

### 类型选择器

```qss
QPushButton { }
QLabel { }
QLineEdit { }
```

### ID 选择器

```qss
#myButton { }
```

### 类选择器

```qss
.QPushButton { }
```

### 伪状态选择器

```qss
QPushButton:hover { }
QPushButton:pressed { }
QPushButton:disabled { }
QCheckBox:checked { }
QLineEdit:focus { }
```

## 常用属性

### 背景

```qss
QWidget {
    background-color: #f0f0f0;
    background-image: url(:/images/background.png);
}
```

### 边框

```qss
QFrame {
    border: 1px solid #cccccc;
    border-radius: 4px;
}
```

### 字体

```qss
QLabel {
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-weight: bold;
}
```

### 内边距和外边距

```qss
QPushButton {
    padding: 8px 16px;
    margin: 4px;
}
```

### 前景色和背景色

```qss
QWidget {
    color: #333333;
    background-color: #ffffff;
}
```

## 应用方式

### 1. 应用到单个控件

```cpp
myWidget->setStyleSheet("background-color: red;");
```

### 2. 应用到整个应用程序

```cpp
qApp->setStyleSheet("QPushButton { background-color: blue; }");
```

### 3. 通过文件加载

```cpp
QFile file(":/styles.qss");
if (file.open(QFile::ReadOnly)) {
    QString styleSheet = QLatin1String(file.readAll());
    qApp->setStyleSheet(styleSheet);
}
```

## 常见控件样式

### QPushButton

```qss
QPushButton {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
}

QPushButton:hover {
    background-color: #45a049;
}

QPushButton:pressed {
    background-color: #397a3e;
}
```

### QLineEdit

```qss
QLineEdit {
    border: 1px solid #cccccc;
    border-radius: 3px;
    padding: 5px;
    background-color: white;
}

QLineEdit:focus {
    border: 1px solid #3498db;
}
```

### QComboBox

```qss
QComboBox {
    border: 1px solid #cccccc;
    border-radius: 3px;
    padding: 5px;
    background-color: white;
}

QComboBox::drop-down {
    border: none;
}

QComboBox::down-arrow {
    image: url(:/images/down_arrow.png);
}
```

## 注意事项

- QSS 不支持所有 CSS 属性，如盒模型的部分特性
- 某些控件可能需要设置 `setAttribute(Qt::WA_StyledBackground, true)` 才能生效
- 优先使用 QStringLiteral 或 tr() 处理中文
- 复杂样式会影响性能，应尽量简化
