<?php
// Gitee Webhook 处理脚本

// 设置密钥（与 Gitee 中设置的一致）
$secret = 'your_secret_key';

// 获取 Gitee 发送的密钥
$gitee_token = isset($_SERVER['HTTP_X_GITEE_TOKEN']) ? $_SERVER['HTTP_X_GITEE_TOKEN'] : '';

// 验证密钥
if ($gitee_token !== $secret) {
    http_response_code(403);
    die('Invalid token');
}

// 记录日志
$log_file = __DIR__ . '/deploy.log';
$log_content = date('Y-m-d H:i:s') . " - 开始部署\n";
file_put_contents($log_file, $log_content, FILE_APPEND);

// 执行部署脚本
$output = shell_exec('bash /www/wwwroot/docs.example.com/deploy.sh 2>&1');

// 记录输出
file_put_contents($log_file, $output . "\n", FILE_APPEND);

echo 'Deployment triggered';
?>
