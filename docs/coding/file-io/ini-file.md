# INI 文件读写

INI 文件是一种简单的配置文件格式，常用于存储程序配置。本文介绍如何在 C++ 中读写 INI 文件。

## INI 文件格式

```ini
# 这是注释
[Section1]
key1=value1
key2=value2

[Section2]
name=Alice
age=25
enabled=true
```

**格式说明**：
- 使用 `[SectionName]` 定义节（Section）
- 使用 `key=value` 定义键值对
- 使用 `;` 或 `#` 开头表示注释
- 不区分大小写（取决于实现）

## C++ 实现方式

### 方法一：使用 Windows API（仅 Windows）

Windows 提供了原生的 INI 文件操作 API。

#### 读取 INI 文件

```cpp
#include <windows.h>
#include <string>
#include <iostream>

int main() {
    const char* iniFile = "config.ini";
    char buffer[256];
    
    // 读取字符串
    GetPrivateProfileStringA(
        "Section1",      // 节名
        "key1",          // 键名
        "default",       // 默认值（键不存在时返回）
        buffer,          // 缓冲区
        sizeof(buffer),  // 缓冲区大小
        iniFile          // INI 文件路径
    );
    std::cout << "key1 = " << buffer << std::endl;
    
    // 读取整数
    int value = GetPrivateProfileIntA(
        "Section2",      // 节名
        "age",           // 键名
        0,               // 默认值
        iniFile          // INI 文件路径
    );
    std::cout << "age = " << value << std::endl;
    
    return 0;
}
```

#### 写入 INI 文件

```cpp
#include <windows.h>
#include <string>

int main() {
    const char* iniFile = "config.ini";
    
    // 写入字符串
    WritePrivateProfileStringA(
        "Section1",      // 节名
        "key1",          // 键名
        "new_value",     // 值
        iniFile          // INI 文件路径
    );
    
    // 写入整数（需要先转换为字符串）
    std::string ageStr = std::to_string(30);
    WritePrivateProfileStringA(
        "Section2",
        "age",
        ageStr.c_str(),
        iniFile
    );
    
    // 删除键
    WritePrivateProfileStringA(
        "Section1",
        "key1",
        NULL,            // 传入 NULL 删除键
        iniFile
    );
    
    // 删除节
    WritePrivateProfileStringA(
        "Section1",
        NULL,            // 传入 NULL 删除整个节
        NULL,
        iniFile
    );
    
    return 0;
}
```

#### 获取所有节名和键名

```cpp
#include <windows.h>
#include <string>
#include <vector>
#include <iostream>

// 获取所有节名
std::vector<std::string> GetAllSections(const char* iniFile) {
    char buffer[4096];
    DWORD size = GetPrivateProfileSectionNamesA(
        buffer,
        sizeof(buffer),
        iniFile
    );
    
    std::vector<std::string> sections;
    char* p = buffer;
    while (*p) {
        sections.push_back(p);
        p += strlen(p) + 1;
    }
    return sections;
}

// 获取指定节的所有键名
std::vector<std::string> GetAllKeys(const char* section, const char* iniFile) {
    char buffer[4096];
    DWORD size = GetPrivateProfileStringA(
        section,
        NULL,            // 传入 NULL 获取所有键名
        "",
        buffer,
        sizeof(buffer),
        iniFile
    );
    
    std::vector<std::string> keys;
    char* p = buffer;
    while (*p) {
        keys.push_back(p);
        p += strlen(p) + 1;
    }
    return keys;
}

int main() {
    const char* iniFile = "config.ini";
    
    // 获取所有节
    auto sections = GetAllSections(iniFile);
    std::cout << "所有节：" << std::endl;
    for (const auto& section : sections) {
        std::cout << "  [" << section << "]" << std::endl;
        
        // 获取该节的所有键
        auto keys = GetAllKeys(section.c_str(), iniFile);
        for (const auto& key : keys) {
            char value[256];
            GetPrivateProfileStringA(
                section.c_str(),
                key.c_str(),
                "",
                value,
                sizeof(value),
                iniFile
            );
            std::cout << "    " << key << " = " << value << std::endl;
        }
    }
    
    return 0;
}
```

### 方法二：使用第三方库 inih

[inih](https://github.com/benhoyt/inih) 是一个轻量级的跨平台 INI 解析库。

#### 安装

```bash
# 下载 ini.h 和 ini.c 文件
# 或使用包管理器
vcpkg install inih
```

#### 读取 INI 文件

```cpp
#include "ini.h"
#include <iostream>
#include <string>
#include <map>

// 配置结构体
struct Config {
    std::string name;
    int age;
    bool enabled;
};

// 解析回调函数
static int handler(void* user, const char* section, const char* name,
                   const char* value) {
    Config* config = (Config*)user;
    
    if (strcmp(section, "Section2") == 0) {
        if (strcmp(name, "name") == 0) {
            config->name = value;
        } else if (strcmp(name, "age") == 0) {
            config->age = atoi(value);
        } else if (strcmp(name, "enabled") == 0) {
            config->enabled = (strcmp(value, "true") == 0);
        }
    }
    
    return 1;  // 返回 1 表示成功
}

int main() {
    Config config;
    
    // 解析 INI 文件
    if (ini_parse("config.ini", handler, &config) < 0) {
        std::cerr << "无法加载配置文件" << std::endl;
        return 1;
    }
    
    std::cout << "name = " << config.name << std::endl;
    std::cout << "age = " << config.age << std::endl;
    std::cout << "enabled = " << (config.enabled ? "true" : "false") << std::endl;
    
    return 0;
}
```

### 方法三：手动实现简单的 INI 解析器

适用于简单场景，不依赖第三方库。

```cpp
#include <fstream>
#include <string>
#include <map>
#include <iostream>
#include <sstream>

class IniParser {
private:
    // 存储结构：section -> (key -> value)
    std::map<std::string, std::map<std::string, std::string>> data;
    
    // 去除字符串首尾空格
    std::string trim(const std::string& str) {
        size_t first = str.find_first_not_of(" \t\r\n");
        if (first == std::string::npos) return "";
        size_t last = str.find_last_not_of(" \t\r\n");
        return str.substr(first, last - first + 1);
    }
    
public:
    // 加载 INI 文件
    bool load(const std::string& filename) {
        std::ifstream file(filename);
        if (!file.is_open()) {
            return false;
        }
        
        std::string line;
        std::string currentSection;
        
        while (std::getline(file, line)) {
            line = trim(line);
            
            // 跳过空行和注释
            if (line.empty() || line[0] == ';' || line[0] == '#') {
                continue;
            }
            
            // 解析节
            if (line[0] == '[' && line[line.length() - 1] == ']') {
                currentSection = line.substr(1, line.length() - 2);
                currentSection = trim(currentSection);
                continue;
            }
            
            // 解析键值对
            size_t pos = line.find('=');
            if (pos != std::string::npos) {
                std::string key = trim(line.substr(0, pos));
                std::string value = trim(line.substr(pos + 1));
                data[currentSection][key] = value;
            }
        }
        
        file.close();
        return true;
    }
    
    // 获取字符串值
    std::string getString(const std::string& section, const std::string& key,
                         const std::string& defaultValue = "") {
        if (data.count(section) && data[section].count(key)) {
            return data[section][key];
        }
        return defaultValue;
    }
    
    // 获取整数值
    int getInt(const std::string& section, const std::string& key,
               int defaultValue = 0) {
        std::string value = getString(section, key);
        if (value.empty()) {
            return defaultValue;
        }
        return std::stoi(value);
    }
    
    // 获取布尔值
    bool getBool(const std::string& section, const std::string& key,
                 bool defaultValue = false) {
        std::string value = getString(section, key);
        if (value.empty()) {
            return defaultValue;
        }
        return (value == "true" || value == "1" || value == "yes");
    }
    
    // 设置值
    void set(const std::string& section, const std::string& key,
             const std::string& value) {
        data[section][key] = value;
    }
    
    // 保存到文件
    bool save(const std::string& filename) {
        std::ofstream file(filename);
        if (!file.is_open()) {
            return false;
        }
        
        for (const auto& section : data) {
            file << "[" << section.first << "]" << std::endl;
            for (const auto& kv : section.second) {
                file << kv.first << "=" << kv.second << std::endl;
            }
            file << std::endl;
        }
        
        file.close();
        return true;
    }
    
    // 打印所有内容
    void print() {
        for (const auto& section : data) {
            std::cout << "[" << section.first << "]" << std::endl;
            for (const auto& kv : section.second) {
                std::cout << "  " << kv.first << " = " << kv.second << std::endl;
            }
        }
    }
};

// 使用示例
int main() {
    IniParser ini;
    
    // 加载 INI 文件
    if (!ini.load("config.ini")) {
        std::cerr << "无法加载配置文件" << std::endl;
        return 1;
    }
    
    // 读取值
    std::string name = ini.getString("Section2", "name", "Unknown");
    int age = ini.getInt("Section2", "age", 0);
    bool enabled = ini.getBool("Section2", "enabled", false);
    
    std::cout << "name = " << name << std::endl;
    std::cout << "age = " << age << std::endl;
    std::cout << "enabled = " << (enabled ? "true" : "false") << std::endl;
    
    // 修改值
    ini.set("Section2", "age", "30");
    ini.set("Section3", "newkey", "newvalue");
    
    // 保存到文件
    ini.save("config_new.ini");
    
    // 打印所有内容
    std::cout << "\n所有配置：" << std::endl;
    ini.print();
    
    return 0;
}
```

## 完整示例

创建一个配置管理类：

```cpp
#include <fstream>
#include <string>
#include <map>
#include <iostream>

class ConfigManager {
private:
    std::map<std::string, std::map<std::string, std::string>> data;
    std::string filename;
    
    std::string trim(const std::string& str) {
        size_t first = str.find_first_not_of(" \t\r\n");
        if (first == std::string::npos) return "";
        size_t last = str.find_last_not_of(" \t\r\n");
        return str.substr(first, last - first + 1);
    }
    
public:
    ConfigManager(const std::string& file) : filename(file) {
        load();
    }
    
    bool load() {
        std::ifstream file(filename);
        if (!file.is_open()) return false;
        
        std::string line, section;
        while (std::getline(file, line)) {
            line = trim(line);
            if (line.empty() || line[0] == ';' || line[0] == '#') continue;
            
            if (line[0] == '[' && line.back() == ']') {
                section = trim(line.substr(1, line.length() - 2));
            } else {
                size_t pos = line.find('=');
                if (pos != std::string::npos) {
                    data[section][trim(line.substr(0, pos))] = 
                        trim(line.substr(pos + 1));
                }
            }
        }
        return true;
    }
    
    bool save() {
        std::ofstream file(filename);
        if (!file.is_open()) return false;
        
        for (const auto& [section, keys] : data) {
            file << "[" << section << "]\n";
            for (const auto& [key, value] : keys) {
                file << key << "=" << value << "\n";
            }
            file << "\n";
        }
        return true;
    }
    
    template<typename T>
    T get(const std::string& section, const std::string& key, T defaultValue) {
        if (data.count(section) && data[section].count(key)) {
            std::istringstream iss(data[section][key]);
            T value;
            iss >> value;
            return value;
        }
        return defaultValue;
    }
    
    template<typename T>
    void set(const std::string& section, const std::string& key, T value) {
        std::ostringstream oss;
        oss << value;
        data[section][key] = oss.str();
    }
};

// 使用示例
int main() {
    ConfigManager config("app.ini");
    
    // 读取配置
    std::string appName = config.get<std::string>("App", "name", "MyApp");
    int port = config.get<int>("Server", "port", 8080);
    bool debug = config.get<bool>("Debug", "enabled", false);
    
    std::cout << "App Name: " << appName << std::endl;
    std::cout << "Port: " << port << std::endl;
    std::cout << "Debug: " << (debug ? "enabled" : "disabled") << std::endl;
    
    // 修改配置
    config.set("Server", "port", 9000);
    config.set("Debug", "enabled", true);
    
    // 保存配置
    config.save();
    
    return 0;
}
```

## 最佳实践

### 1. 错误处理

```cpp
if (!ini.load("config.ini")) {
    std::cerr << "配置文件加载失败，使用默认配置" << std::endl;
    // 使用默认值
}
```

### 2. 类型安全

```cpp
// 使用模板函数确保类型安全
template<typename T>
T getConfig(const std::string& section, const std::string& key, T defaultValue);
```

### 3. 配置验证

```cpp
int port = ini.getInt("Server", "port", 8080);
if (port < 1 || port > 65535) {
    std::cerr << "端口号无效，使用默认值 8080" << std::endl;
    port = 8080;
}
```

### 4. 注释保留

如果需要保留注释，需要在解析时记录注释行，并在保存时写回。

## 常见问题

### Q: Windows API 方法的优缺点？

**优点**：
- Windows 原生支持，无需第三方库
- API 简单易用
- 性能好

**缺点**：
- 仅支持 Windows 平台
- 功能相对简单
- 不支持 UTF-8（需要使用 W 版本的 API）

### Q: 如何处理中文？

**A:** 使用 UTF-8 编码：

```cpp
// Windows API 使用宽字符版本
GetPrivateProfileStringW(L"Section", L"key", L"", buffer, size, L"config.ini");

// 手动实现时确保文件以 UTF-8 编码保存
std::ifstream file(filename, std::ios::binary);
```

### Q: 如何处理多行值？

**A:** INI 格式不直接支持多行值，可以使用转义字符：

```ini
[Section]
description=Line1\nLine2\nLine3
```

然后在代码中替换 `\n`：

```cpp
std::string value = ini.getString("Section", "description");
// 替换 \n 为真正的换行符
size_t pos = 0;
while ((pos = value.find("\\n", pos)) != std::string::npos) {
    value.replace(pos, 2, "\n");
    pos += 1;
}
```

## 相关资源

- [Windows INI File API](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getprivateprofilestring)
- [inih - Simple INI Parser](https://github.com/benhoyt/inih)
- [INI File Format - Wikipedia](https://en.wikipedia.org/wiki/INI_file)
