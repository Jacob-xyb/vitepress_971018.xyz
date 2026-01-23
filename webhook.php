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
