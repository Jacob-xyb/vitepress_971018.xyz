# Step 5: 部署客户端

在客户端机器上安装并配置自动化客户端。

## 安装 Python（如果未安装）

参考 [Step 1: 服务器环境准备](./step1-server-setup.md) 中的 Python 安装步骤。

## 安装客户端依赖

```bash
# 创建项目目录
mkdir ai-automation-client
cd ai-automation-client

# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# 安装依赖
pip install requests pyautogui pillow
```

## 创建客户端脚本

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
    def __init__(self, server_ip='192.168.1.100', server_port=5000, api_key=None):
        """
        初始化客户端
        server_ip: 服务器的局域网 IP 地址
        server_port: 服务器端口（默认 5000）
        api_key: API 密钥（如果服务器启用了认证）
        """
        self.server_url = f'http://{server_ip}:{server_port}'
        self.api_key = api_key
        self.headers = {}
        
        if api_key:
            self.headers['X-API-Key'] = api_key
        
        self.check_connection()
    
    def check_connection(self):
        """检查服务器连接"""
        try:
            response = requests.get(
                f'{self.server_url}/health',
                timeout=5
            )
            if response.json()['status'] == 'ok':
                model = response.json().get('model', 'unknown')
                print(f"✅ 已连接到 AI 服务器: {self.server_url}")
                print(f"📦 服务器模型: {model}")
                return True
            else:
                print("❌ 服务器响应异常")
                return False
        except Exception as e:
            print(f"❌ 无法连接到服务器 {self.server_url}")
            print(f"错误: {e}")
            print("\n请检查：")
            print("1. 服务器是否启动")
            print("2. IP 地址是否正确")
            print("3. 防火墙设置")
            print("4. 网络连通性")
            return False
    
    def capture_screen(self, region=None):
        """
        截取屏幕并转为 base64
        region: (x, y, width, height) 截取指定区域
        """
        if region:
            screenshot = ImageGrab.grab(bbox=region)
        else:
            screenshot = ImageGrab.grab()
        
        buffered = BytesIO()
        screenshot.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        return img_base64
    
    def ask_ai(self, question, region=None):
        """
        向服务器发送截图和问题
        question: 要问的问题
        region: 截图区域（可选）
        """
        try:
            print(f"📤 发送请求: {question[:50]}...")
            image_base64 = self.capture_screen(region)
            
            response = requests.post(
                f'{self.server_url}/analyze',
                json={
                    'image': image_base64,
                    'question': question
                },
                headers=self.headers,
                timeout=30
            )
            
            result = response.json()
            if result.get('success'):
                answer = result['result']
                print(f"📥 AI 响应: {answer[:100]}...")
                return answer
            else:
                error = result.get('error', 'Unknown error')
                print(f"❌ 错误: {error}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {e}")
            return None
    
    def find_and_click(self, button_description, confidence=0.8):
        """
        AI 识别并点击按钮
        button_description: 按钮描述
        confidence: 置信度（0-1）
        """
        prompt = f"""
        请在这个截图中找到"{button_description}"。
        返回格式：x坐标,y坐标
        只返回数字，例如：500,300
        如果找不到，返回：NOT_FOUND
        """
        
        response = self.ask_ai(prompt)
        
        if not response or 'NOT_FOUND' in response.upper():
            print(f"❌ 未找到: {button_description}")
            return False
        
        try:
            # 解析坐标
            coords = response.strip().split(',')
            x, y = int(coords[0].strip()), int(coords[1].strip())
            
            # 点击
            pyautogui.click(x, y)
            print(f"✅ 已点击 {button_description} at ({x}, {y})")
            return True
        except Exception as e:
            print(f"❌ 无法解析坐标: {response}")
            print(f"错误: {e}")
            return False
    
    def type_text(self, text, interval=0.1):
        """输入文本"""
        pyautogui.write(text, interval=interval)
        print(f"⌨️  已输入: {text}")
    
    def wait(self, seconds):
        """等待指定秒数"""
        print(f"⏳ 等待 {seconds} 秒...")
        time.sleep(seconds)


# 使用示例
if __name__ == '__main__':
    # 配置服务器信息
    SERVER_IP = '192.168.1.100'  # ⚠️ 修改为实际服务器 IP
    API_KEY = None  # 如果服务器启用了认证，填写 API Key
    
    # 初始化客户端
    client = AIClient(server_ip=SERVER_IP, api_key=API_KEY)
    
    # 示例：点击按钮
    print("\n=== 示例：点击按钮 ===")
    client.find_and_click('开始按钮')
    client.wait(2)
    
    # 示例：询问 AI
    print("\n=== 示例：询问 AI ===")
    answer = client.ask_ai('这个界面上有哪些按钮？')
    if answer:
        print(f"AI 回答: {answer}")
```

## 创建配置文件

创建 `config.py`：

```python
# config.py - 客户端配置

# 服务器配置
SERVER_CONFIG = {
    'ip': '192.168.1.100',  # ⚠️ 修改为服务器 IP
    'port': 5000,
    'api_key': None  # 如果启用了认证，填写 API Key
}

# 任务配置
TASK_CONFIG = {
    'delay': 2,  # 操作间隔（秒）
    'retry': 3,  # 重试次数
    'timeout': 30  # 请求超时（秒）
}
```

## 创建实用工具脚本

创建 `examples.py`：

```python
# examples.py - 使用示例
from client import AIClient
from config import SERVER_CONFIG
import time
from pathlib import Path

# 初始化客户端
client = AIClient(
    server_ip=SERVER_CONFIG['ip'],
    server_port=SERVER_CONFIG['port'],
    api_key=SERVER_CONFIG['api_key']
)

def example_simple_click():
    """示例1：简单点击"""
    print("\n=== 示例1：简单点击 ===")
    client.find_and_click('确定按钮')

def example_form_fill():
    """示例2：表单填写"""
    print("\n=== 示例2：表单填写 ===")
    
    # 点击用户名输入框
    client.find_and_click('用户名输入框')
    client.wait(1)
    client.type_text('testuser')
    
    # 点击密码输入框
    client.find_and_click('密码输入框')
    client.wait(1)
    client.type_text('password123')
    
    # 点击登录按钮
    client.find_and_click('登录按钮')

def example_batch_process(folder_path, button1, button2):
    """示例3：批量处理文件"""
    print(f"\n=== 示例3：批量处理文件 ===")
    
    folder = Path(folder_path)
    if not folder.exists():
        print(f"❌ 文件夹不存在: {folder_path}")
        return
    
    files = list(folder.glob('*'))
    print(f"📁 找到 {len(files)} 个文件")
    
    success_count = 0
    fail_count = 0
    
    for i, file in enumerate(files, 1):
        print(f"\n[{i}/{len(files)}] 处理: {file.name}")
        
        # 点击按钮1
        if client.find_and_click(button1):
            client.wait(1)
            
            # 点击按钮2
            if client.find_and_click(button2):
                print(f"✅ {file.name} 处理完成")
                success_count += 1
                client.wait(2)
            else:
                print(f"❌ {file.name} 失败（按钮2）")
                fail_count += 1
        else:
            print(f"❌ {file.name} 失败（按钮1）")
            fail_count += 1
    
    print(f"\n📊 处理完成: 成功 {success_count}, 失败 {fail_count}")

if __name__ == '__main__':
    # 运行示例
    # example_simple_click()
    # example_form_fill()
    # example_batch_process('D:/my_files', '打开按钮', '加载按钮')
    
    print("请取消注释上面的示例代码来运行")
```

## 运行客户端

### 测试连接

```bash
python client.py
```

应该看到：
```
✅ 已连接到 AI 服务器: http://192.168.1.100:5000
📦 服务器模型: llava:7b
```

### 运行示例

```bash
python examples.py
```

## 打包成可执行文件（可选）

如果要分发给不懂 Python 的用户：

### 安装 PyInstaller

```bash
pip install pyinstaller
```

### 打包

```bash
# Windows
pyinstaller --onefile --windowed --name "AI自动化工具" client.py

# 生成的 exe 在 dist/ 目录
```

### 分发

1. 将 `dist/AI自动化工具.exe` 和 `config.py` 打包
2. 用户只需修改 `config.py` 中的服务器 IP
3. 双击运行 exe 即可

## 故障排查

### 无法连接服务器

1. 检查服务器 IP 是否正确
2. 检查服务器是否运行
3. 测试网络连通性：`ping 服务器IP`
4. 检查防火墙设置

### PyAutoGUI 无法工作

```bash
# Linux 需要额外依赖
sudo apt install python3-tk python3-dev

# macOS 需要授权
# 系统偏好设置 → 安全性与隐私 → 辅助功能
```

### 截图失败

```python
# 测试截图功能
from PIL import ImageGrab
screenshot = ImageGrab.grab()
screenshot.save('test.png')
```

## 检查清单

完成本步骤后，确认以下内容：

- [ ] Python 和依赖已安装
- [ ] 已创建 client.py 和 config.py
- [ ] 已配置正确的服务器 IP
- [ ] 可以成功连接到服务器
- [ ] 可以执行简单的自动化任务

## 下一步

客户端部署完成后，继续 [Step 6: 使用示例](./step6-examples.md)
