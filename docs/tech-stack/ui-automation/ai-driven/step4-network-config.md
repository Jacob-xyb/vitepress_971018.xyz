# Step 4: 配置网络访问

配置防火墙和网络，让客户端可以访问服务器。

## 配置防火墙

### Windows 防火墙

#### 方法 1: 使用命令行（推荐）

以管理员身份运行 PowerShell：

```powershell
# 添加防火墙规则
netsh advfirewall firewall add rule name="AI Automation Server" dir=in action=allow protocol=TCP localport=5000

# 查看规则
netsh advfirewall firewall show rule name="AI Automation Server"
```

#### 方法 2: 使用图形界面

1. 打开"Windows Defender 防火墙"
2. 点击"高级设置"
3. 选择"入站规则" → "新建规则"
4. 选择"端口" → 下一步
5. 选择"TCP"，输入端口 `5000` → 下一步
6. 选择"允许连接" → 下一步
7. 全部勾选 → 下一步
8. 输入名称"AI Automation Server" → 完成

#### 临时关闭防火墙测试（不推荐）

```powershell
# 关闭防火墙（仅用于测试）
netsh advfirewall set allprofiles state off

# 重新开启
netsh advfirewall set allprofiles state on
```

### Linux 防火墙

#### Ubuntu/Debian (ufw)

```bash
# 允许 5000 端口
sudo ufw allow 5000/tcp

# 查看状态
sudo ufw status

# 如果防火墙未启用
sudo ufw enable
```

#### CentOS/RHEL (firewalld)

```bash
# 允许 5000 端口
sudo firewall-cmd --permanent --add-port=5000/tcp

# 重新加载
sudo firewall-cmd --reload

# 查看端口
sudo firewall-cmd --list-ports
```

#### iptables

```bash
# 允许 5000 端口
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT

# 保存规则
sudo iptables-save > /etc/iptables/rules.v4
```

### macOS 防火墙

macOS 默认防火墙不会阻止出站连接，通常不需要额外配置。

如果需要配置：

1. 打开"系统偏好设置" → "安全性与隐私"
2. 点击"防火墙"选项卡
3. 点击"防火墙选项"
4. 添加 Python 应用程序到允许列表

## 测试网络连通性

### 从服务器本地测试

```bash
# 测试本地访问
curl http://localhost:5000/health

# 测试局域网访问
curl http://192.168.1.100:5000/health  # 替换为实际 IP
```

### 从客户端测试

在客户端机器上：

```bash
# 测试网络连通性
ping 192.168.1.100  # 替换为服务器 IP

# 测试端口是否开放
# Windows
Test-NetConnection -ComputerName 192.168.1.100 -Port 5000

# Linux/macOS
telnet 192.168.1.100 5000
# 或
nc -zv 192.168.1.100 5000

# 测试 HTTP 访问
curl http://192.168.1.100:5000/health
```

## 配置静态 IP（可选但推荐）

为服务器配置静态 IP，避免 IP 变化导致客户端无法连接。

### Windows

1. 打开"网络和共享中心"
2. 点击当前网络连接
3. 点击"属性"
4. 选择"Internet 协议版本 4 (TCP/IPv4)"
5. 点击"属性"
6. 选择"使用下面的 IP 地址"
7. 输入：
   - IP 地址：`192.168.1.100`（根据实际情况）
   - 子网掩码：`255.255.255.0`
   - 默认网关：`192.168.1.1`（路由器 IP）
   - DNS 服务器：`8.8.8.8`

### Linux

编辑网络配置文件：

#### Ubuntu 18.04+ (netplan)

编辑 `/etc/netplan/01-netcfg.yaml`：

```yaml
network:
  version: 2
  ethernets:
    eth0:  # 网卡名称
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

应用配置：
```bash
sudo netplan apply
```

#### CentOS/RHEL

编辑 `/etc/sysconfig/network-scripts/ifcfg-eth0`：

```ini
BOOTPROTO=static
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
```

重启网络：
```bash
sudo systemctl restart network
```

### macOS

1. 打开"系统偏好设置" → "网络"
2. 选择当前网络连接
3. 点击"高级"
4. 选择"TCP/IP"选项卡
5. 配置 IPv4：手动
6. 输入 IP 地址、子网掩码、路由器地址

## 配置路由器端口转发（可选）

如果需要从外网访问（不推荐，有安全风险）：

1. 登录路由器管理界面（通常是 `192.168.1.1`）
2. 找到"端口转发"或"虚拟服务器"设置
3. 添加规则：
   - 外部端口：5000
   - 内部 IP：192.168.1.100
   - 内部端口：5000
   - 协议：TCP

::: danger 安全警告
不建议将服务器暴露到公网，除非：
1. 添加了身份验证
2. 使用了 HTTPS
3. 配置了访问限制
:::

## 添加 API 认证（推荐）

为服务器添加简单的 API Key 认证：

修改 `server.py`：

```python
API_KEY = 'your-secret-key-here'  # 修改为强密码

@app.before_request
def check_auth():
    # 跳过健康检查和首页
    if request.path in ['/', '/health']:
        return
    
    # 检查 API Key
    api_key = request.headers.get('X-API-Key')
    if api_key != API_KEY:
        return jsonify({'error': 'Unauthorized'}), 401
```

客户端请求时需要添加 Header：

```python
headers = {'X-API-Key': 'your-secret-key-here'}
response = requests.post(url, json=data, headers=headers)
```

## 故障排查

### 无法访问服务器

1. **检查服务器是否运行**
   ```bash
   # 查看进程
   ps aux | grep server.py  # Linux/macOS
   tasklist | findstr python  # Windows
   ```

2. **检查端口是否监听**
   ```bash
   # Linux/macOS
   netstat -tuln | grep 5000
   lsof -i :5000
   
   # Windows
   netstat -ano | findstr 5000
   ```

3. **检查防火墙**
   ```bash
   # 临时关闭防火墙测试
   # Windows
   netsh advfirewall set allprofiles state off
   
   # Linux
   sudo ufw disable
   ```

4. **检查 IP 地址**
   ```bash
   # 确认服务器 IP
   ipconfig  # Windows
   ifconfig  # Linux/macOS
   ```

### 连接超时

1. 检查网络连通性：`ping 服务器IP`
2. 检查是否在同一局域网
3. 检查路由器设置

### 403/401 错误

检查 API Key 是否正确配置。

## 检查清单

完成本步骤后，确认以下内容：

- [ ] 防火墙已配置，允许 5000 端口
- [ ] 可以从服务器本地访问 API
- [ ] 可以从客户端 ping 通服务器
- [ ] 可以从客户端访问服务器 API
- [ ] （可选）已配置静态 IP
- [ ] （可选）已添加 API 认证

## 下一步

网络配置完成后，继续 [Step 5: 部署客户端](./step5-deploy-client.md)
