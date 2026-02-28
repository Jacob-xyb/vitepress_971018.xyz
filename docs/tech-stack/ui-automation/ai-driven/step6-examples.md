# Step 6: 使用示例

实际应用场景示例和最佳实践。

## 场景 1：批量导入文件

自动遍历文件夹，将每个文件导入到应用程序中。

```python
from client import AIClient
from pathlib import Path
import time

# 初始化客户端
client = AIClient(server_ip='192.168.1.100')

def batch_import_files(folder_path):
    """批量导入文件"""
    folder = Path(folder_path)
    files = list(folder.glob('*.pdf'))  # 只处理 PDF 文件
    
    print(f"📁 找到 {len(files)} 个 PDF 文件")
    
    for i, file in enumerate(files, 1):
        print(f"\n[{i}/{len(files)}] 处理: {file.name}")
        
        # 1. 点击"导入"按钮
        if not client.find_and_click('导入按钮'):
            continue
        
        client.wait(2)
        
        # 2. 在文件选择对话框中输入文件路径
        client.type_text(str(file.absolute()))
        client.wait(1)
        
        # 3. 点击"打开"按钮
        client.find_and_click('打开按钮')
        client.wait(3)
        
        # 4. 点击"确认"按钮
        client.find_and_click('确认按钮')
        client.wait(2)
        
        print(f"✅ {file.name} 导入完成")

# 运行
batch_import_files('D:/documents')
```

## 场景 2：自动化测试

测试应用程序的登录流程。

```python
from client import AIClient
import time

client = AIClient(server_ip='192.168.1.100')

def test_login(username, password):
    """测试登录功能"""
    print("\n=== 开始登录测试 ===")
    
    # 1. 点击用户名输入框
    if not client.find_and_click('用户名输入框'):
        print("❌ 测试失败：找不到用户名输入框")
        return False
    
    client.wait(1)
    client.type_text(username)
    
    # 2. 点击密码输入框
    if not client.find_and_click('密码输入框'):
        print("❌ 测试失败：找不到密码输入框")
        return False
    
    client.wait(1)
    client.type_text(password)
    
    # 3. 点击登录按钮
    if not client.find_and_click('登录按钮'):
        print("❌ 测试失败：找不到登录按钮")
        return False
    
    client.wait(3)
    
    # 4. 验证登录是否成功
    response = client.ask_ai('屏幕上是否显示"登录成功"或用户名？')
    
    if response and ('成功' in response or '用户' in response):
        print("✅ 测试通过：登录成功")
        return True
    else:
        print("❌ 测试失败：登录失败")
        return False

# 运行测试
test_login('testuser', 'password123')
```

## 场景 3：数据录入

从 Excel 读取数据并录入到应用程序。

```python
from client import AIClient
import pandas as pd
import time

client = AIClient(server_ip='192.168.1.100')

def data_entry_from_excel(excel_path):
    """从 Excel 录入数据"""
    # 读取 Excel
    df = pd.read_excel(excel_path)
    
    print(f"📊 读取到 {len(df)} 条数据")
    
    for index, row in df.iterrows():
        print(f"\n[{index + 1}/{len(df)}] 录入数据...")
        
        # 点击"新建"按钮
        client.find_and_click('新建按钮')
        client.wait(2)
        
        # 填写姓名
        client.find_and_click('姓名输入框')
        client.wait(1)
        client.type_text(row['姓名'])
        
        # 填写年龄
        client.find_and_click('年龄输入框')
        client.wait(1)
        client.type_text(str(row['年龄']))
        
        # 填写邮箱
        client.find_and_click('邮箱输入框')
        client.wait(1)
        client.type_text(row['邮箱'])
        
        # 点击"保存"按钮
        client.find_and_click('保存按钮')
        client.wait(2)
        
        print(f"✅ {row['姓名']} 录入完成")

# 运行
data_entry_from_excel('data.xlsx')
```

## 场景 4：智能任务规划

让 AI 理解复杂任务并自动执行。

```python
from client import AIClient

client = AIClient(server_ip='192.168.1.100')

def execute_complex_task(task_description):
    """执行复杂任务"""
    print(f"\n📋 任务: {task_description}")
    
    # 让 AI 分解任务
    prompt = f"""
    任务：{task_description}
    
    请将这个任务分解为具体步骤，每行一个步骤。
    格式示例：
    1. 点击"文件"菜单
    2. 点击"打开"选项
    3. 输入文件路径
    4. 点击"确定"按钮
    
    只返回步骤列表，不要其他解释。
    """
    
    steps = client.ask_ai(prompt)
    
    if steps:
        print(f"\n🤖 AI 生成的步骤:\n{steps}\n")
        
        # 询问用户是否执行
        confirm = input("是否执行这些步骤？(y/n): ")
        if confirm.lower() == 'y':
            print("\n开始执行...")
            # 这里可以进一步解析步骤并执行
            # 实际应用中需要更复杂的逻辑
        else:
            print("已取消")
    else:
        print("❌ AI 无法理解任务")

# 示例
execute_complex_task("打开记事本，输入'Hello World'，然后保存到桌面")
```

## 场景 5：条件判断

根据屏幕内容做出不同的操作。

```python
from client import AIClient

client = AIClient(server_ip='192.168.1.100')

def conditional_action():
    """根据屏幕内容执行不同操作"""
    # 询问 AI 当前状态
    response = client.ask_ai('屏幕上是否显示错误信息？')
    
    if response and '是' in response:
        print("⚠️  检测到错误，执行错误处理...")
        client.find_and_click('确定按钮')
        client.wait(2)
        client.find_and_click('重试按钮')
    else:
        print("✅ 正常状态，继续执行...")
        client.find_and_click('下一步按钮')
```

## 场景 6：循环等待

等待某个元素出现后再继续。

```python
from client import AIClient
import time

client = AIClient(server_ip='192.168.1.100')

def wait_for_element(element_description, timeout=60):
    """等待元素出现"""
    print(f"⏳ 等待 {element_description} 出现...")
    
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        response = client.ask_ai(f'屏幕上是否有"{element_description}"？')
        
        if response and '是' in response:
            print(f"✅ {element_description} 已出现")
            return True
        
        time.sleep(2)
    
    print(f"❌ 超时：{element_description} 未出现")
    return False

# 使用
if wait_for_element('加载完成提示', timeout=30):
    client.find_and_click('继续按钮')
```

## 最佳实践

### 1. 错误处理

```python
def safe_click(client, button_description, retry=3):
    """带重试的点击"""
    for i in range(retry):
        try:
            if client.find_and_click(button_description):
                return True
            print(f"重试 {i + 1}/{retry}...")
            time.sleep(2)
        except Exception as e:
            print(f"错误: {e}")
    
    return False
```

### 2. 日志记录

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

def logged_action(action_name, func):
    """记录操作日志"""
    logger.info(f"开始: {action_name}")
    try:
        result = func()
        logger.info(f"成功: {action_name}")
        return result
    except Exception as e:
        logger.error(f"失败: {action_name} - {e}")
        return None
```

### 3. 配置管理

```python
import json

def load_config(config_file='config.json'):
    """加载配置文件"""
    with open(config_file, 'r', encoding='utf-8') as f:
        return json.load(f)

config = load_config()
client = AIClient(
    server_ip=config['server']['ip'],
    api_key=config['server']['api_key']
)
```

### 4. 进度通知

```python
def send_notification(title, message):
    """发送系统通知"""
    try:
        # Windows
        from win10toast import ToastNotifier
        toaster = ToastNotifier()
        toaster.show_toast(title, message, duration=5)
    except:
        print(f"通知: {title} - {message}")

# 使用
send_notification("自动化任务", "批量处理完成！")
```

## 性能优化技巧

### 1. 减少截图次数

```python
# 不好的做法：每次都截图
for i in range(10):
    client.find_and_click('按钮')

# 好的做法：先定位一次，然后重复点击
response = client.ask_ai('找到"按钮"的坐标')
x, y = parse_coordinates(response)
for i in range(10):
    pyautogui.click(x, y)
```

### 2. 使用区域截图

```python
# 只截取需要的区域
region = (100, 100, 500, 400)  # (x, y, width, height)
client.ask_ai('这个区域有什么？', region=region)
```

### 3. 缓存常见结果

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_button_position(button_name):
    return client.find_and_click(button_name)
```

## 检查清单

完成本步骤后，你应该能够：

- [ ] 执行简单的点击操作
- [ ] 批量处理文件
- [ ] 填写表单
- [ ] 进行条件判断
- [ ] 处理错误和重试
- [ ] 记录日志

## 下一步

了解使用示例后，继续 [Step 7: 故障排查](./step7-troubleshooting.md)
