# C++ 虚函数重写与函数隐藏

::: tip 核心概念
理解虚函数重写和函数隐藏的区别，是掌握 C++ 多态机制的关键。
:::

## 1. 函数隐藏 (Function Hiding)
```cpp
class Base {
public:
    void LoadSRCalibInfo();
};

class Device : public Base {
public:
    void LoadSRCalibInfo();  // 隐藏了基类的同名函数
};
```

### 特点

- 基类函数**不是虚函数**
- 派生类定义同名函数，形成**函数隐藏**
- 调用哪个函数取决于对象的**静态类型**（编译时确定）

### 行为示例
```cpp
Device dev;
dev.LoadSRCalibInfo();  // ✅ 调用 Device::LoadSRCalibInfo()

Base* ptr = &dev;
ptr->LoadSRCalibInfo();  // ⚠️ 调用 Base::LoadSRCalibInfo()（静态绑定）
```

::: warning 注意
通过基类指针调用时，会调用基类版本，**不具备多态性**。
:::

## 2. 虚函数重写 (Virtual Function Override)
```cpp
class Base {
public:
    virtual void LoadSRCalibInfo();
};

class Device : public Base {
public:
    void LoadSRCalibInfo() override;  // 重写基类虚函数
};
```

### 特点

- 基类函数使用 `virtual` 关键字声明
- 派生类使用 `override` 关键字明确重写（C++11 推荐）
- 调用哪个函数取决于对象的**实际类型**（运行时确定）
- 实现**运行时多态**

### 行为示例
```cpp
Device dev;
dev.LoadSRCalibInfo();  // ✅ 调用 Device::LoadSRCalibInfo()

Base* ptr = &dev;
ptr->LoadSRCalibInfo();  // ✅ 调用 Device::LoadSRCalibInfo()（动态绑定）
```

::: tip 多态的力量
通过基类指针调用时，会根据实际对象类型调用派生类版本，**实现多态**。
:::

## 核心区别对比

| 对比维度 | 函数隐藏 | 虚函数重写 |
|---------|---------|-----------|
| **基类函数声明** | 普通函数（无 `virtual`） | `virtual` 修饰 |
| **派生类声明** | 同名函数 | 同名函数 + `override`（推荐） |
| **绑定时机** | 编译时（静态绑定） | 运行时（动态绑定） |
| **多态性** | ❌ 不支持 | ✅ 支持 |
| **指针/引用调用** | 根据指针/引用类型 | 根据实际对象类型 |
| **使用场景** | 替换基类功能（少见） | 实现多态行为（常用） |
| **C++ 标准** | 所有版本 | 所有版本（`override` 自 C++11） |

## 最佳实践

### 1. 优先使用虚函数重写实现多态
当需要多态行为时，始终使用虚函数：

```cpp
class Base {
public:
    virtual ~Base() = default;  // 虚析构函数（重要！）
    virtual void LoadSRCalibInfo() { 
        // 默认实现
    }
};

class Device : public Base {
public:
    void LoadSRCalibInfo() override { 
        // 设备特定实现
    }
};
```

### 2. 始终使用 `override` 关键字

::: tip 为什么要用 override？
- ✅ **编译器检查**：确保真的重写了基类虚函数
- ✅ **提高可读性**：明确表达重写意图
- ✅ **避免错误**：防止因函数签名不匹配导致的意外隐藏
:::

```cpp
class Device : public Base {
public:
    // ✅ 推荐：使用 override
    void LoadSRCalibInfo() override;
    
    // ❌ 不推荐：省略 override
    void LoadSRCalibInfo();
};
```

### 3. 避免意外的函数隐藏

如果确实需要隐藏基类函数（极少见），请明确表达意图：

```cpp
class Device : public Base {
public:
    // 方式 1：显式删除基类函数
    void LoadSRCalibInfo() = delete;
    
    // 方式 2：使用不同的函数签名
    void LoadSRCalibInfo(int deviceId);
    
    // 方式 3：使用 using 声明保留基类版本
    using Base::LoadSRCalibInfo;
    void LoadSRCalibInfo(int deviceId);  // 重载
};
```

## 总结

::: info 记住这些要点
1. **需要多态？** → 使用虚函数重写
2. **基类有 `virtual`？** → 派生类加 `override`
3. **不需要多态？** → 考虑是否真的需要继承
4. **有继承层次？** → 记得虚析构函数
:::

在现代 C++ 开发中，**虚函数重写是实现多态的标准方式**，而函数隐藏通常是应该避免的设计。