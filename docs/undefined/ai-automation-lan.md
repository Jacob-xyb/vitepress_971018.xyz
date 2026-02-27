# 基于局域网的 AI 自动化方案

## 概述

本方案实现了一个完全免费的 AI 驱动的 UI 自动化系统，采用服务端-客户端架构：
- 服务器运行 AI 模型（Ollama + LLaVA），只需部署一次
- 客户端轻量级，通过局域网调用 AI 服务
- 完全免费，不需要外网，不需要 API 付费

## 架构设计

```
[服务器] 运行 Ollama + LLaVA (一次部署)
    ↓ 局域网 HTTP API
[客户端1] 轻量级软件 (Python + 自动化脚本)
[客户端2] 轻量级软件
[客户端3] 轻量级软件
```

## 功能特性

- ✅ AI 理解自然语言指令
- ✅ 视觉识别屏幕元素（按钮、文本等）
- ✅ 自动化复杂任务（循环、条件判断）
- ✅ 局域网部署，一次配置多处使用
- ✅ 完全免费开源

## 服务器端部署

### 硬件要求

- 内存：16GB+（推荐）
- 硬盘：10GB 空闲空间
- CPU：多核处理器
- 显卡：可选（NVIDIA GPU 可加速）

### 安装步骤

#### 1. 安装 Ollama

**Windows:**
```bash
# 下载安装包
https://ollama.com/download

# 安装后验证
ollama --version
```

**Linux/Mac:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### 2. 下载 AI 模型

```bash
# 下载 LLaVA 视觉语言模型（约 4-5GB）
ollama pull llava

# 验证模型
ollama list
```

#### 3. 安装 Python 依赖

```bash
pip install flask ollama pillow
```

#### 4. 创建服务器脚本

创建 `server.py`：

```python
# server.py - AI 服务器
from flask import Flask, request, jsonify
import ollama
import base64
from io import BytesIO
from PIL import Image
import os

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_screen():
    """接收截图，返回 AI 分析结果"""
    try:
        data = request.json
        image_base64 = data['image']
        question = data['question']
        
        # 解码图片
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        image.save('temp.png')
        
        # 调用本地 AI 模型
        response = ollama.chat(
            model='llava',
            messages=[{
                'role': 'user',
                'content': question,
                'images': ['temp.png']
            }]
        )
        
        return jsonify({
            'success': True,
            'result': response['message']['content']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'model': 'llava'
    })

@app.route('/')
def dashboard():
    """简单的状态页面"""
    return '''
    <html>
    <head><title>AI 自动化服务器</title></head>
    <body>
        <h1>🤖 AI 自动化服务器</h1>
        <p>✅ 状态: 运行中</p>
        <p>📦 模型: LLaVA</p>
        <p>🌐 访问地址: http://服务器IP:5000</p>
    </body>
    </html>
    '''

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 AI 服务器启动")
    print("=" * 50)
    print("📍 本地访问: http://localhost:5000")
    print("🌐 局域网访问: http://0.0.0.0:5000")
    print("💡 客户端配置时使用服务器的局域网 IP")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=False)
```

#### 5. 启动服务器

```bash
python server.py
```

#### 6. 获取服务器 IP

**Windows:**
```bash
ipconfig
# 查找 IPv4 地址，例如：192.168.1.100
```

**Linux/Mac:**
```bash
ifconfig
# 或
ip addr show
```

#### 7. 配置防火墙

**Windows 防火墙:**
```powershell
# 允许 5000 端口
netsh advfirewall firewall add rule name="AI Server" dir=in action=allow protocol=TCP localport=5000
```

**Linux (ufw):**
```bash
sudo ufw allow 5000/tcp
```

## 客户端部署

### 安装步骤

#### 1. 安装 Python 依赖

```bash
pip install requests pyautogui pillow
```

#### 2. 创建客户端脚本

创建 `client.py`：

```python
# client.py - AI 自动化客户端
import requests
import pyautogui
import base64
from io import BytesIO
from PIL import ImageGrab
import time
from pathlib import Path

class AIClient:
    def __init__(self, server_ip='192.168.1.100', server_port=5000):
        """
        初始化客户端
        server_ip: 服务器的局域网 IP 地址
        server_port: 服务器端口（默认 5000）
        """
        self.server_url = f'http://{server_ip}:{server_port}'
        self.check_connection()
    
    def check_connection(self):
        """检查服务器连接"""
        try:
            response = requests.get(f'{self.server_url}/health', timeout=5)
            if response.json()['status'] == 'ok':
                print(f"✓ 已连接到 AI 服务器: {self.server_url}")
                return True
            else:
                print("✗ 服务器响应异常")
                return False
        except Exception as e:
            print(f"✗ 无法连接到服务器 {self.server_url}")
            print(f"错误: {e}")
            print("\n请检查：")
            print("1) 服务器是否启动")
            print("2) IP 地址是否正确")
            print("3) 防火墙设置")
            return False
    
    def capture_screen(self):
        """截取屏幕并转为 base64"""
        screenshot = ImageGrab.grab()
        buffered = BytesIO()
        screenshot.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        return img_base64
    
    def ask_ai(self, question):
        """向服务器发送截图和问题"""
        try:
            print(f"📤 发送请求: {question[:50]}...")
            image_base64 = self.capture_screen()
            
            response = requests.post(
                f'{self.server_url}/analyze',
                json={
                    'image': image_base64,
                    'question': question
                },
                timeout=30
            )
            
            result = response.json()
            if result['success']:
                print(f"📥 AI 响应: {result['result'][:100]}...")
                return result['result']
            else:
                print(f"❌ 错误: {result['error']}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {e}")
            return None
    
    def find_and_click(self, button_description):
        """AI 识别并点击按钮"""
        prompt = f"""
        请在这个截图中找到"{button_description}"按钮。
        返回格式：x坐标,y坐标
        只返回数字，例如：500,300
        如果找不到，返回：NOT_FOUND
        """
        
        response = self.ask_ai(prompt)
        
        if not response or 'NOT_FOUND' in response:
            print(f"✗ 未找到按钮: {button_description}")
            return False
        
        try:
            # 解析坐标
            coords = response.strip().split(',')
            x, y = int(coords[0]), int(coords[1])
            
            # 点击
            pyautogui.click(x, y)
            print(f"✓ 已点击 {button_description} at ({x}, {y})")
            return True
        except Exception as e:
            print(f"✗ 无法解析坐标: {response}")
            return False
    
    def execute_task(self, task_description):
        """让 AI 理解任务并生成步骤"""
        prompt = f"""
        任务：{task_description}
        
        请将这个任务分解为具体步骤，每行一个步骤。
        格式示例：
        1. 点击"打开"按钮
        2. 等待2秒
        3. 点击"加载"按钮
        
        只返回步骤列表，不要其他解释。
        """
        
        response = self.ask_ai(prompt)
        if response:
            print(f"\n📋 AI 生成的步骤:\n{response}\n")
        return response
    
    def load_files_from_folder(self, folder_path, button1, button2):
        """
        循环加载文件夹中的所有文件
        每个文件：点击按钮1 → 点击按钮2
        """
        folder = Path(folder_path)
        
        if not folder.exists():
            print(f"❌ 文件夹不存在: {folder_path}")
            return
        
        files = list(folder.glob('*'))
        print(f"\n📁 找到 {len(files)} 个文件")
        print("=" * 50)
        
        success_count = 0
        fail_count = 0
        
        for i, file in enumerate(files, 1):
            print(f"\n[{i}/{len(files)}] 处理: {file.name}")
            
            # 步骤 1：点击按钮1
            if self.find_and_click(button1):
                time.sleep(1)
                
                # 步骤 2：点击按钮2
                if self.find_and_click(button2):
                    print(f"✅ {file.name} 处理完成")
                    success_count += 1
                    time.sleep(2)
                else:
                    print(f"❌ {file.name} 失败（按钮2）")
                    fail_count += 1
            else:
                print(f"❌ {file.name} 失败（按钮1）")
                fail_count += 1
        
        print("\n" + "=" * 50)
        print(f"📊 处理完成: 成功 {success_count}, 失败 {fail_count}")
        print("=" * 50)


# 使用示例
if __name__ == '__main__':
    # 配置服务器 IP（改成你的服务器 IP）
    SERVER_IP = '192.168.1.100'  # ⚠️ 修改为实际服务器 IP
    
    # 初始化客户端
    client = AIClient(server_ip=SERVER_IP)
    
    # 示例 1：简单的按钮点击
    print("\n=== 示例 1: 点击按钮 ===")
    client.find_and_click('打开按钮')
    
    # 示例 2：循环加载文件
    print("\n=== 示例 2: 批量加载文件 ===")
    client.load_files_from_folder(
        folder_path='D:/my_files',  # ⚠️ 修改为实际文件夹路径
        button1='打开按钮',
        button2='加载按钮'
    )
    
    # 示例 3：让 AI 理解复杂任务
    print("\n=== 示例 3: AI 任务规划 ===")
    task = "打开文件管理器，导航到下载文件夹，选择第一个文件"
    steps = client.execute_task(task)
```

#### 3. 创建配置文件

创建 `config.py`：

```python
# config.py - 客户端配置
SERVER_CONFIG = {
    'ip': '192.168.1.100',  # ⚠️ 修改为服务器 IP
    'port': 5000
}

TASK_CONFIG = {
    'folder_path': 'D:/my_files',  # 要处理的文件夹
    'button1': '打开按钮',
    'button2': '加载按钮',
    'delay': 2  # 操作间隔（秒）
}
```

使用配置：

```python
from config import SERVER_CONFIG, TASK_CONFIG

client = AIClient(
    server_ip=SERVER_CONFIG['ip'],
    server_port=SERVER_CONFIG['port']
)

client.load_files_from_folder(
    folder_path=TASK_CONFIG['folder_path'],
    button1=TASK_CONFIG['button1'],
    button2=TASK_CONFIG['button2']
)
```

#### 4. 运行客户端

```bash
python client.py
```

## 打包成可执行文件（可选）

如果要分发给不懂 Python 的用户：

### 安装 PyInstaller

```bash
pip install pyinstaller
```

### 打包客户端

```bash
# Windows
pyinstaller --onefile --windowed --name "AI自动化工具" client.py

# 生成的 exe 在 dist/ 目录
```

### 分发步骤

1. 将 `dist/AI自动化工具.exe` 和 `config.py` 打包
2. 用户只需修改 `config.py` 中的服务器 IP
3. 双击运行 exe 即可

## 使用场景示例

### 场景 1：批量导入文件

```python
client = AIClient(server_ip='192.168.1.100')

# 遍历文件夹，每个文件执行导入操作
client.load_files_from_folder(
    folder_path='D:/documents',
    button1='导入按钮',
    button2='确认按钮'
)
```

### 场景 2：自动化测试

```python
# 测试登录流程
client.find_and_click('用户名输入框')
pyautogui.write('testuser')

client.find_and_click('密码输入框')
pyautogui.write('password123')

client.find_and_click('登录按钮')
```

### 场景 3：数据录入

```python
import pandas as pd

# 读取 Excel 数据
df = pd.read_excel('data.xlsx')

for index, row in df.iterrows():
    client.find_and_click('姓名输入框')
    pyautogui.write(row['姓名'])
    
    client.find_and_click('年龄输入框')
    pyautogui.write(str(row['年龄']))
    
    client.find_and_click('提交按钮')
    time.sleep(2)
```

## 故障排查

### 客户端无法连接服务器

1. **检查服务器是否运行**
   ```bash
   # 在服务器上访问
   curl http://localhost:5000/health
   ```

2. **检查 IP 地址**
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

3. **检查防火墙**
   ```bash
   # Windows: 临时关闭防火墙测试
   # Linux: 
   sudo ufw status
   ```

4. **测试网络连通性**
   ```bash
   ping 192.168.1.100
   ```

### AI 识别不准确

1. **提高截图质量**
   - 确保界面清晰
   - 避免重叠窗口

2. **优化提示词**
   ```python
   # 更详细的描述
   prompt = "找到屏幕左上角的蓝色'打开'按钮，返回坐标"
   ```

3. **使用更大的模型**
   ```bash
   # 下载 13B 参数版本（更准确但更慢）
   ollama pull llava:13b
   ```

4. **混合使用 OCR**
   ```python
   import pytesseract
   
   # 先用 OCR 识别文字位置
   # 再用 AI 确认
   ```

### 性能优化

1. **启用 GPU 加速**
   ```bash
   # 确保安装了 NVIDIA 驱动
   nvidia-smi
   
   # Ollama 会自动使用 GPU
   ```

2. **调整并发数**
   ```python
   # server.py 中添加队列
   from queue import Queue
   from threading import Thread
   
   request_queue = Queue(maxsize=10)
   ```

3. **缓存常见请求**
   ```python
   from functools import lru_cache
   
   @lru_cache(maxsize=100)
   def cached_analyze(image_hash, question):
       # 缓存相同截图的结果
       pass
   ```

## 进阶功能

### 添加日志记录

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
logger.info('任务开始')
```

### 添加错误重试

```python
def retry_on_failure(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except Exception as e:
            if i == max_retries - 1:
                raise
            time.sleep(2 ** i)  # 指数退避
```

### 添加进度通知

```python
# 使用 Windows 通知
from win10toast import ToastNotifier

toaster = ToastNotifier()
toaster.show_toast(
    "AI 自动化",
    "任务完成！",
    duration=5
)
```

## 成本分析

### 完全免费

- ✅ Ollama: 开源免费
- ✅ LLaVA 模型: 开源免费
- ✅ Python 库: 全部开源
- ✅ 无 API 调用费用
- ✅ 无月费/年费
- ✅ 可商用

### 唯一成本

- 服务器硬件（一次性投入）
- 电费（运行成本）

## 安全建议

1. **局域网隔离**
   - 不要将服务器暴露到公网
   - 使用防火墙限制访问

2. **添加认证**
   ```python
   # server.py 添加 API Key
   API_KEY = 'your-secret-key'
   
   @app.before_request
   def check_auth():
       if request.headers.get('X-API-Key') != API_KEY:
           return jsonify({'error': 'Unauthorized'}), 401
   ```

3. **限制请求频率**
   ```python
   from flask_limiter import Limiter
   
   limiter = Limiter(app, default_limits=["100 per hour"])
   ```

## 总结

这个方案提供了：
- 🎯 完全免费的 AI 自动化解决方案
- 🌐 局域网部署，一次配置多处使用
- 🚀 轻量级客户端，易于分发
- 🔒 数据隐私安全（不上传到云端）
- 📈 可扩展性强，支持多种自动化场景

适用于：
- RPA（机器人流程自动化）
- UI 自动化测试
- 批量数据录入
- 重复性操作自动化

## 参考资源

- [Ollama 官网](https://ollama.com/)
- [LLaVA 模型](https://ollama.com/library/llava)
- [PyAutoGUI 文档](https://pyautogui.readthedocs.io/)
- [Flask 文档](https://flask.palletsprojects.com/)
