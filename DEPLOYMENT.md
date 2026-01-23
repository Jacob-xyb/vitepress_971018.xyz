# VitePress 自动部署文档

本文档介绍如何使用 Gitee Webhook 实现 VitePress 项目的自动部署。

## 部署架构

```
本地开发 → Git Push → Gitee 仓库 → Webhook → 服务器自动部署
```

## 前置要求

### 服务器环境
- Linux 系统（CentOS/Ubuntu）
- 已安装宝塔面板
- 已安装 Node.js 和 npm
- 已安装 Git

### 检查环境

```bash
# 检查 Node.js
node -v
npm -v

# 检查 Git
git --version
```

如果未安装，执行：

```bash
# 安装 Node.js（通过宝塔面板安装 PM2 会自动安装 Node.js）
# 或手动安装
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs  # CentOS
# apt install -y nodejs  # Ubuntu

# 安装 Git
yum install -y git  # CentOS
# apt install -y git  # Ubuntu
```

## 部署步骤

### 步骤 1：创建部署脚本

在项目根目录创建 `deploy.sh`：

```bash
#!/bin/bash

# VitePress 自动部署脚本
# 网站路径
SITE_PATH="/www/wwwroot/971018.xyz"
# 源码路径（可以和网站路径分开）
SOURCE_PATH="/www/wwwroot/971018.xyz/source"

# 记录日志
echo "========================================" >> $SITE_PATH/deploy.log
echo "部署开始时间: $(date '+%Y-%m-%d %H:%M:%S')" >> $SITE_PATH/deploy.log

# 进入源码目录
cd $SOURCE_PATH

# 拉取最新代码
echo "正在拉取最新代码..." >> $SITE_PATH/deploy.log
git pull origin master >> $SITE_PATH/deploy.log 2>&1

# 安装依赖
echo "正在安装依赖..." >> $SITE_PATH/deploy.log
npm install >> $SITE_PATH/deploy.log 2>&1

# 构建项目
echo "正在构建项目..." >> $SITE_PATH/deploy.log
npm run docs:build >> $SITE_PATH/deploy.log 2>&1

# 复制构建文件到网站目录
echo "正在部署文件..." >> $SITE_PATH/deploy.log
rm -rf $SITE_PATH/*.html $SITE_PATH/assets $SITE_PATH/api $SITE_PATH/guide
cp -r docs/.vitepress/dist/* $SITE_PATH/

echo "部署完成时间: $(date '+%Y-%m-%d %H:%M:%S')" >> $SITE_PATH/deploy.log
echo "========================================" >> $SITE_PATH/deploy.log
```

### 步骤 2：创建 Webhook 接收脚本

在项目根目录创建 `webhook.php`：

```php
<?php
/**
 * Gitee Webhook 自动部署脚本
 * 放在网站根目录，通过 http://你的域名/webhook.php 访问
 */

// 设置密钥（与 Gitee Webhook 中设置的一致）
$secret = 'your_secret_key_here';  // 改成你自己的密钥

// 获取 Gitee 发送的数据
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 验证密钥（Gitee 使用 X-Gitee-Token）
$gitee_token = isset($_SERVER['HTTP_X_GITEE_TOKEN']) ? $_SERVER['HTTP_X_GITEE_TOKEN'] : '';

if ($gitee_token !== $secret) {
    http_response_code(403);
    die('Invalid token');
}

// 记录日志
$log_file = __DIR__ . '/webhook.log';
$log_content = "\n" . date('Y-m-d H:i:s') . " - 收到 Webhook 请求\n";
$log_content .= "分支: " . ($data['ref'] ?? 'unknown') . "\n";
$log_content .= "提交者: " . ($data['user_name'] ?? 'unknown') . "\n";
file_put_contents($log_file, $log_content, FILE_APPEND);

// 只在 push 到 master 分支时部署
if (isset($data['ref']) && $data['ref'] === 'refs/heads/master') {
    // 执行部署脚本
    $output = shell_exec('bash /www/wwwroot/971018.xyz/source/deploy.sh 2>&1');
    
    // 记录输出
    file_put_contents($log_file, $output . "\n", FILE_APPEND);
    
    echo json_encode(['status' => 'success', 'message' => 'Deployment triggered']);
} else {
    echo json_encode(['status' => 'skipped', 'message' => 'Not master branch']);
}
?>
```

### 步骤 3：服务器配置

#### 3.1 上传文件

通过宝塔面板 → 文件管理：

- 上传 `deploy.sh` 到：`/www/wwwroot/971018.xyz/source/deploy.sh`
- 上传 `webhook.php` 到：`/www/wwwroot/971018.xyz/webhook.php`

#### 3.2 修改配置

编辑 `webhook.php`，修改密钥：

```php
$secret = 'my_gitee_webhook_2024';  // 改成你自己的密钥
```

#### 3.3 执行初始化命令

在宝塔面板 → 终端，执行：

```bash
# 创建源码目录
mkdir -p /www/wwwroot/971018.xyz/source

# 克隆仓库
cd /www/wwwroot/971018.xyz/source
git clone https://gitee.com/Jacob-xyb/vitepress_971018.xyz.git .

# 安装依赖
npm install

# 首次构建
npm run docs:build

# 复制文件到网站根目录
cp -r docs/.vitepress/dist/* /www/wwwroot/971018.xyz/

# 给脚本执行权限
chmod +x /www/wwwroot/971018.xyz/source/deploy.sh

# 设置目录权限
chown -R www:www /www/wwwroot/971018.xyz
chmod -R 755 /www/wwwroot/971018.xyz
```

#### 3.4 测试手动部署

```bash
bash /www/wwwroot/971018.xyz/source/deploy.sh
```

查看日志：

```bash
tail -f /www/wwwroot/971018.xyz/deploy.log
```

### 步骤 4：配置 Gitee Webhook

1. 打开 Gitee 仓库：https://gitee.com/Jacob-xyb/vitepress_971018.xyz
2. 点击 **管理 → WebHooks → 添加 WebHook**
3. 填写信息：
   ```
   URL: http://106.15.194.96/webhook.php
   （或 DNS 生效后用 http://971018.xyz/webhook.php）
   
   密码: my_gitee_webhook_2024（与 webhook.php 中设置的一致）
   
   勾选: Push
   ```
4. 点击"添加"
5. 点击"测试"按钮，验证是否配置成功

### 步骤 5：测试自动部署

1. 在本地修改代码
2. 提交并 push 到 Gitee：
   ```bash
   git add .
   git commit -m "test auto deploy"
   git push origin master
   ```
3. 查看服务器日志：
   ```bash
   tail -f /www/wwwroot/971018.xyz/webhook.log
   tail -f /www/wwwroot/971018.xyz/deploy.log
   ```
4. 刷新网站，查看是否更新

## 目录结构

```
/www/wwwroot/971018.xyz/
├── source/                    # 源码目录
│   ├── docs/
│   │   ├── .vitepress/
│   │   │   └── config.js
│   │   ├── api/
│   │   ├── guide/
│   │   └── index.md
│   ├── node_modules/
│   ├── package.json
│   ├── deploy.sh             # 部署脚本
│   └── .git/
├── assets/                    # 构建后的文件（网站根目录）
├── api/
├── guide/
├── index.html
├── webhook.php               # Webhook 接收脚本
├── webhook.log               # Webhook 日志
└── deploy.log                # 部署日志
```

## 常见问题

### 1. Webhook 没有触发

**检查：**
- Gitee Webhook 配置是否正确
- URL 是否可访问（`curl http://你的域名/webhook.php`）
- 密钥是否一致
- 查看 Gitee Webhook 的推送记录

### 2. 部署失败

**检查：**
- 查看 `deploy.log` 日志
- 确认 Node.js 和 npm 已安装
- 确认目录权限正确
- 手动执行部署脚本测试

### 3. 权限问题

```bash
# 修复权限
chown -R www:www /www/wwwroot/971018.xyz
chmod -R 755 /www/wwwroot/971018.xyz
chmod +x /www/wwwroot/971018.xyz/source/deploy.sh
```

### 4. Git 拉取失败

**可能原因：**
- SSH 密钥未配置
- 使用 HTTPS 方式克隆（推荐）
- 网络问题

**解决：**
```bash
# 使用 HTTPS 方式
cd /www/wwwroot/971018.xyz/source
git remote set-url origin https://gitee.com/Jacob-xyb/vitepress_971018.xyz.git
```

## 手动部署

如果自动部署出现问题，可以手动部署：

```bash
cd /www/wwwroot/971018.xyz/source
git pull origin master
npm install
npm run docs:build
cp -r docs/.vitepress/dist/* /www/wwwroot/971018.xyz/
```

## 安全建议

1. **修改默认密钥**：不要使用示例中的密钥
2. **限制访问**：可以在 Nginx 配置中限制 webhook.php 只能被 Gitee IP 访问
3. **定期备份**：定期备份网站数据
4. **监控日志**：定期查看部署日志，及时发现问题

## 优化建议

### 1. 添加构建缓存

在 `deploy.sh` 中添加：

```bash
# 使用 npm ci 代替 npm install（更快）
npm ci
```

### 2. 添加错误通知

部署失败时发送邮件或消息通知。

### 3. 回滚机制

保留上一次的构建，部署失败时可以快速回滚。

## 相关链接

- Gitee 仓库：https://gitee.com/Jacob-xyb/vitepress_971018.xyz
- VitePress 文档：https://vitepress.dev/
- 宝塔面板：https://www.bt.cn/

## 更新日志

- 2026-01-23：初始版本
