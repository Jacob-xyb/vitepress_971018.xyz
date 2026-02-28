# Step 3: 部署服务器端

创建并启动 AI 自动化服务器。

## 创建服务器脚本

在项目目录下创建 `server.py`：

```python
# server.py - AI 自动化服务器
from flask import Flask, request, jsonify
import ollama
import base64
from io import BytesIO
from PIL import Image
import os

app = Flask(__name__)

# 配置模型（根据内存选择）
# 16GB+ 内存: 'llava:13b'
# 8GB 内存: 'llava:7b' 或 'moondream'
MODEL_NAME = 'llava:7b'  # ⚠️ 根据实际情况修改

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
        
        # 保存临时图片
        temp_path = 'temp_screenshot.png'
        image.save(temp_path)
        
        print(f"📸 收到截图请求: {question[:50]}...")
        
        # 调用本地 AI 模型
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{
                'role': 'user',
                'content': question,
                'images': [temp_path]
            }]
        )
        
        result = response['message']['content']
        print(f"✅ AI 响应: {result[:100]}...")
        
        # 清理临时文件
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'result': result
        })
        
    except Exception as e:
        print(f"❌ 错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'model': MODEL_NAME,
        'version': '1.0.0'
    })

@app.route('/')
def dashboard():
    """简单的状态页面"""
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI 自动化服务器</title>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }}
            .container {{
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            h1 {{ color: #333; }}
            .status {{ color: #4CAF50; font-size: 1.2em; }}
            .info {{ margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #2196F3; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 AI 自动化服务器</h1>
            <p class="status">✅ 状态: 运行中</p>
            <div class="info">
                <p>📦 模型: {MODEL_NAME}</p>
                <p>🌐 访问地址: http://服务器IP:5000</p>
                <p>📡 API 端点: /analyze</p>
                <p>💚 健康检查: /health</p>
            </div>
            <h3>使用说明</h3>
            <p>1. 客户端通过 POST 请求发送截图到 /analyze</p>
            <p>2. 服务器返回 AI 分析结果</p>
            <p>3. 支持自然语言提问</p>
        </div>
    </body>
    </html>
    '''

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 AI 自动化服务器启动中...")
    print("=" * 60)
    print(f"📦 使用模型: {MODEL_NAME}")
    print(f"📍 本地访问: http://localhost:5000")
    print(f"🌐 局域网访问: http://0.0.0.0:5000")
    print(f"💡 客户端配置时使用服务器的局域网 IP")
    print("=" * 60)
    print("按 Ctrl+C 停止服务器")
    print("=" * 60)
    
    # 启动服务器
    app.run(host='0.0.0.0', port=5000, debug=False)
```

## 配置模型名称

根据你在 Step 2 中安装的模型，修改 `MODEL_NAME`：

```python
# 如果安装的是 llava:7b
MODEL_NAME = 'llava:7b'

# 如果安装的是 moondream
MODEL_NAME = 'moondream'

# 如果安装的是 llava:13b
MODEL_NAME = 'llava:13b'
```

## 启动服务器

### 方法 1: 直接运行

```bash
# 确保在项目目录下
cd ai-automation-server

# 激活虚拟环境（如果使用）
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# 启动服务器
python server.py
```

### 方法 2: 后台运行（Linux/macOS）

```bash
# 使用 nohup 后台运行
nohup python server.py > server.log 2>&1 &

# 查看日志
tail -f server.log

# 查看进程
ps aux | grep server.py

# 停止服务器
pkill -f server.py
```

### 方法 3: 使用 systemd（Linux 推荐）

创建服务文件 `/etc/systemd/system/ai-automation.service`：

```ini
[Unit]
Description=AI Automation Server
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/ai-automation-server
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/python server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start ai-automation

# 开机自启
sudo systemctl enable ai-automation

# 查看状态
sudo systemctl status ai-automation

# 查看日志
sudo journalctl -u ai-automation -f
```

## 验证服务器

### 1. 检查服务器状态

打开浏览器访问：
```
http://localhost:5000
```

应该看到服务器状态页面。

### 2. 健康检查

```bash
# 使用 curl
curl http://localhost:5000/health

# 或使用浏览器访问
http://localhost:5000/health
```

应该返回：
```json
{
  "status": "ok",
  "model": "llava:7b",
  "version": "1.0.0"
}
```

### 3. 测试 API（可选）

创建测试脚本 `test_server.py`：

```python
import requests
import base64
from PIL import ImageGrab

# 截取屏幕
screenshot = ImageGrab.grab()
screenshot.save('test.png')

# 转换为 base64
with open('test.png', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode()

# 发送请求
response = requests.post(
    'http://localhost:5000/analyze',
    json={
        'image': image_base64,
        'question': '这个截图中有什么内容？'
    }
)

print(response.json())
```

运行测试：
```bash
python test_server.py
```

## 服务器日志

服务器运行时会输出日志：

```
============================================================
🚀 AI 自动化服务器启动中...
============================================================
📦 使用模型: llava:7b
📍 本地访问: http://localhost:5000
🌐 局域网访问: http://0.0.0.0:5000
💡 客户端配置时使用服务器的局域网 IP
============================================================
按 Ctrl+C 停止服务器
============================================================
 * Serving Flask app 'server'
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.100:5000
```

记录下局域网 IP（如 `192.168.1.100`），客户端需要用到。

## 性能优化

### 1. 添加请求队列

如果有多个客户端同时请求：

```python
from queue import Queue
from threading import Thread

request_queue = Queue(maxsize=10)

def process_requests():
    while True:
        task = request_queue.get()
        # 处理任务
        request_queue.task_done()

# 启动工作线程
worker = Thread(target=process_requests, daemon=True)
worker.start()
```

### 2. 添加缓存

缓存相同的请求结果：

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=100)
def cached_analyze(image_hash, question):
    # 分析逻辑
    pass
```

### 3. 限制并发

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    default_limits=["100 per hour", "10 per minute"]
)
```

## 停止服务器

### 直接运行模式

按 `Ctrl+C` 停止。

### 后台运行模式

```bash
# 查找进程
ps aux | grep server.py

# 停止进程
kill <PID>

# 或强制停止
pkill -f server.py
```

### systemd 模式

```bash
sudo systemctl stop ai-automation
```

## 检查清单

完成本步骤后，确认以下内容：

- [ ] 已创建 server.py 文件
- [ ] 已配置正确的模型名称
- [ ] 服务器可以成功启动
- [ ] 可以访问 http://localhost:5000
- [ ] 健康检查返回正常
- [ ] 已记录局域网 IP 地址

## 下一步

服务器部署完成后，继续 [Step 4: 配置网络访问](./step4-network-config.md)
