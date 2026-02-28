# Step 7: 故障排查

常见问题的诊断和解决方案。

## 服务器端问题

### 1. 内存不足

**症状：**
- 服务器启动失败
- 模型加载卡住
- 系统响应缓慢
- 出现 OOM (Out of Memory) 错误

**解决方案：**

#### 使用更小的模型

```bash
# 卸载大模型
ollama rm llava:13b

# 使用轻量模型
ollama pull moondream  # 仅 2GB
ollama pull llava:7b   # 约 4GB

# 修改 server.py 中的 MODEL_NAME
MODEL_NAME = 'moondream'
```

#### 监控内存使用

```bash
# Linux
free -h
htop

# Windows
taskmgr  # 任务管理器

# 查看 Ollama 内存占用
ollama ps
```

#### 优化系统内存

```bash
# Linux: 清理缓存
sudo sync
sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'

# 关闭不必要的服务
sudo systemctl stop unnecessary-service
```

#### 使用量化模型

```bash
# 4-bit 量化版本（更小但略降准确度）
ollama pull llava:7b-q4
```

### 2. Ollama 服务未启动

**症状：**
- 服务器启动时报错
- 无法连接到 Ollama

**解决方案：**

```bash
# 检查 Ollama 是否运行
ollama list

# 手动启动 Ollama
ollama serve

# 或在后台启动
nohup ollama serve > ollama.log 2>&1 &

# Linux: 使用 systemd
sudo systemctl start ollama
sudo systemctl enable ollama
```

### 3. 端口被占用

**症状：**
- 服务器启动失败
- 提示 "Address already in use"

**解决方案：**

```bash
# 查找占用 5000 端口的进程
# Linux/macOS
lsof -i :5000
netstat -tuln | grep 5000

# Windows
netstat -ano | findstr 5000

# 杀死进程
# Linux/macOS
kill -9 <PID>

# Windows
taskkill /PID <PID> /F

# 或修改服务器端口
app.run(host='0.0.0.0', port=5001)  # 使用其他端口
```

### 4. 模型响应慢

**症状：**
- 请求超时
- 响应时间过长

**解决方案：**

#### 启用 GPU 加速

```bash
# 检查 GPU
nvidia-smi

# Ollama 会自动使用 GPU
# 验证 GPU 使用
nvidia-smi -l 1  # 实时监控
```

#### 使用更小的模型

```bash
# 7B 模型比 13B 快很多
ollama pull llava:7b
```

#### 调整超时时间

```python
# 客户端增加超时时间
response = requests.post(url, json=data, timeout=60)  # 60秒
```

### 5. 模型下载慢或失败

**症状：**
- 下载速度很慢（几 KB/s）
- 下载中断
- 连接超时

**解决方案：**

#### 使用代理加速

```bash
# 设置代理
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# Windows
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"

# 下载模型
ollama pull llava:7b
```

#### 使用 ModelScope（国内快）

```bash
# 安装 modelscope
pip install modelscope

# 从 ModelScope 下载模型
# 然后手动放到 Ollama 模型目录
```

#### 断点续传

```bash
# Ollama 支持断点续传
# 下载中断后直接重新运行
ollama pull llava:7b
```

#### 检查网络

```bash
# 测试连接
ping ollama.com
curl -I https://ollama.com

# 检查 DNS
nslookup ollama.com
```

详细的下载加速方法请参考 [Step 2: 安装 AI 模型](./step2-install-model.md#下载加速方法)。

## 客户端问题

### 1. 无法连接服务器

**症状：**
- "无法连接到服务器"错误
- 连接超时

**诊断步骤：**

#### 检查服务器是否运行

```bash
# 在服务器上
ps aux | grep server.py  # Linux/macOS
tasklist | findstr python  # Windows

# 检查端口监听
netstat -tuln | grep 5000  # Linux/macOS
netstat -ano | findstr 5000  # Windows
```

#### 检查网络连通性

```bash
# 从客户端 ping 服务器
ping 192.168.1.100

# 测试端口
# Windows
Test-NetConnection -ComputerName 192.168.1.100 -Port 5000

# Linux/macOS
telnet 192.168.1.100 5000
nc -zv 192.168.1.100 5000

# 测试 HTTP 访问
curl http://192.168.1.100:5000/health
```

#### 检查防火墙

```bash
# Windows: 临时关闭防火墙测试
netsh advfirewall set allprofiles state off

# Linux: 检查防火墙状态
sudo ufw status
sudo firewall-cmd --list-ports

# 确保 5000 端口开放
sudo ufw allow 5000/tcp
```

#### 检查 IP 地址

```bash
# 确认服务器 IP
ipconfig  # Windows
ifconfig  # Linux/macOS
ip addr show  # Linux

# 确保客户端配置的 IP 正确
```

### 2. API 认证失败

**症状：**
- 401 Unauthorized 错误
- 403 Forbidden 错误

**解决方案：**

```python
# 检查 API Key 是否正确
client = AIClient(
    server_ip='192.168.1.100',
    api_key='your-correct-api-key'  # 确保与服务器一致
)

# 或临时禁用服务器端认证测试
# 在 server.py 中注释掉 @app.before_request
```

### 3. PyAutoGUI 无法工作

**症状：**
- 鼠标/键盘操作无效
- 截图失败

**解决方案：**

#### Linux 安装依赖

```bash
sudo apt install python3-tk python3-dev
sudo apt install scrot  # 截图工具
sudo apt install python3-xlib
```

#### macOS 授权

1. 打开"系统偏好设置"
2. 选择"安全性与隐私"
3. 选择"辅助功能"选项卡
4. 添加 Terminal 或 Python 到允许列表

#### Windows 管理员权限

某些应用需要管理员权限才能控制：

```bash
# 以管理员身份运行 Python 脚本
```

#### 测试 PyAutoGUI

```python
import pyautogui

# 测试鼠标移动
pyautogui.moveTo(100, 100)

# 测试截图
screenshot = pyautogui.screenshot()
screenshot.save('test.png')

# 检查安全功能
pyautogui.FAILSAFE = True  # 鼠标移到左上角可中止
```

### 4. 截图失败

**症状：**
- 无法截取屏幕
- 截图为黑屏

**解决方案：**

```python
# 方法 1: 使用 PIL
from PIL import ImageGrab
screenshot = ImageGrab.grab()
screenshot.save('test.png')

# 方法 2: 使用 PyAutoGUI
import pyautogui
screenshot = pyautogui.screenshot()
screenshot.save('test.png')

# 方法 3: 使用 mss (更快)
from mss import mss
with mss() as sct:
    sct.shot(output='test.png')
```

## AI 识别问题

### 1. 识别不准确

**症状：**
- AI 找不到按钮
- 返回错误的坐标
- 理解错误

**解决方案：**

#### 优化提示词

```python
# 不好的提示
prompt = "找按钮"

# 好的提示
prompt = """
请在这个截图中找到左上角的蓝色"打开"按钮。
按钮上有文字"打开"，背景是蓝色。
返回格式：x坐标,y坐标
只返回数字，例如：500,300
"""
```

#### 提高截图质量

```python
# 确保界面清晰
client.wait(2)  # 等待界面稳定

# 避免重叠窗口
# 最大化目标窗口

# 使用高分辨率
```

#### 使用更大的模型

```bash
# 13B 参数版本更准确
ollama pull llava:13b

# 修改服务器配置
MODEL_NAME = 'llava:13b'
```

#### 混合使用 OCR

```python
import pytesseract
from PIL import Image

# 先用 OCR 识别文字
image = Image.open('screenshot.png')
text = pytesseract.image_to_string(image, lang='chi_sim')

# 再用 AI 确认位置
prompt = f"在包含'{text}'的截图中，找到'确定'按钮的位置"
```

### 2. 响应格式错误

**症状：**
- 无法解析 AI 返回的坐标
- 返回格式不符合预期

**解决方案：**

```python
def parse_coordinates(response):
    """解析坐标，增加容错"""
    try:
        # 尝试多种格式
        # 格式1: "500,300"
        if ',' in response:
            parts = response.strip().split(',')
            x = int(parts[0].strip())
            y = int(parts[1].strip())
            return x, y
        
        # 格式2: "x:500 y:300"
        if 'x:' in response.lower():
            import re
            match = re.search(r'x[:\s]*(\d+).*y[:\s]*(\d+)', response, re.IGNORECASE)
            if match:
                return int(match.group(1)), int(match.group(2))
        
        # 格式3: "(500, 300)"
        if '(' in response:
            import re
            match = re.search(r'\((\d+),\s*(\d+)\)', response)
            if match:
                return int(match.group(1)), int(match.group(2))
        
        return None, None
    except Exception as e:
        print(f"解析错误: {e}")
        return None, None
```

## 性能问题

### 1. 请求太慢

**解决方案：**

```python
# 1. 减少截图分辨率
from PIL import Image

def capture_screen_optimized():
    screenshot = ImageGrab.grab()
    # 缩小到 50%
    screenshot = screenshot.resize(
        (screenshot.width // 2, screenshot.height // 2),
        Image.LANCZOS
    )
    return screenshot

# 2. 只截取需要的区域
region = (0, 0, 800, 600)
screenshot = ImageGrab.grab(bbox=region)

# 3. 使用缓存
from functools import lru_cache

@lru_cache(maxsize=100)
def get_button_position(button_name):
    # 缓存按钮位置
    pass
```

### 2. 内存泄漏

**解决方案：**

```python
# 及时清理临时文件
import os

def cleanup_temp_files():
    for file in os.listdir('.'):
        if file.startswith('temp_') and file.endswith('.png'):
            os.remove(file)

# 定期调用
cleanup_temp_files()

# 使用上下文管理器
from contextlib import contextmanager

@contextmanager
def temp_screenshot():
    filename = 'temp_screenshot.png'
    try:
        yield filename
    finally:
        if os.path.exists(filename):
            os.remove(filename)
```

## 调试技巧

### 1. 启用详细日志

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### 2. 保存截图用于调试

```python
def debug_screenshot(name='debug'):
    screenshot = ImageGrab.grab()
    filename = f'{name}_{int(time.time())}.png'
    screenshot.save(filename)
    print(f"调试截图已保存: {filename}")
```

### 3. 测试单个功能

```python
# 单独测试连接
client.check_connection()

# 单独测试截图
image = client.capture_screen()

# 单独测试 AI
response = client.ask_ai('测试问题')
```

## 获取帮助

如果以上方法都无法解决问题：

1. **查看日志**
   - 服务器日志：`server.log`
   - 客户端日志：`automation.log`
   - Ollama 日志：`ollama.log`

2. **检查版本**
   ```bash
   python --version
   pip list
   ollama --version
   ```

3. **搜索错误信息**
   - 复制完整的错误信息
   - 在 Google 或 Stack Overflow 搜索

4. **社区支持**
   - [Ollama GitHub Issues](https://github.com/ollama/ollama/issues)
   - [PyAutoGUI 文档](https://pyautogui.readthedocs.io/)

## 检查清单

遇到问题时，按此清单逐项检查：

- [ ] 服务器是否正常运行
- [ ] 网络是否连通
- [ ] 防火墙是否正确配置
- [ ] IP 地址是否正确
- [ ] API Key 是否正确（如果启用）
- [ ] Python 依赖是否完整
- [ ] 内存是否充足
- [ ] 模型是否正确加载
- [ ] 日志中是否有错误信息

## 总结

完成所有步骤后，你应该拥有一个完整的 AI 驱动自动化系统。如果遇到问题，按照本文档逐步排查，大多数问题都能解决。

## 返回导航

- [返回 AI 驱动方案首页](./index.md)
- [查看使用示例](./step6-examples.md)
