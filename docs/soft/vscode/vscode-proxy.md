<!--
 * @Author: Jacob-xyb 949782197@qq.com
 * @Date: 2026-03-13 14:53:32
 * @LastEditors: Jacob-xyb 949782197@qq.com
 * @LastEditTime: 2026-03-13 15:50:28
 * @Description: Life is struggle.
-->
# VSCode 设置代理

## 确认代理

V2ray 通常是 socks:10808 和 http:10809

- 验证socks是否能正常联网

直接在终端测试：
```bash

# 测试 HTTP 代理
curl -x http://127.0.0.1:10809 https://api.github.com

# 或者用 curl 检测
curl -v --socks5 127.0.0.1:10808 https://api.github.com
```
返回 JSON 数据或 200 就说明代理正常。


- 如果报`CRYPT_E_REVOCATION_OFFLINE`，则说明网络策略限制了，无法访问证书吊销检查服务器（CRL/OCSP）。

需要增加参数 `-k`

`curl -x http://127.0.0.1:10809 -k https://api.github.com`

并且在 VSCode 设置（settings.json）中添加：

```json
{
  "http.proxyStrictSSL": false
}
```

## VSCode的命令行启动参数 --proxy-server

```bash
code --proxy-server=http://127.0.0.1:10809
```

### 确认 vscode 网络状态

```bash
# 测试主进程网络
curl -x http://127.0.0.1:10809 -k https://api.github.com

# 用 node 测试
node -e "require('http').get('http://www.google.com', (r) => console.log('状态码:', r.statusCode))"
```

## VSCode中配置代理

```json
{
  "http.proxy": "http://127.0.0.1:10809",
  "http.proxyStrictSSL": false,
  "http.proxySupport": "on"
}
```

- 如果依旧失败
VSCode 的 http.proxy 设置只影响 VSCode 主进程，插件的 node 子进程是独立进程，不会读取 VSCode 的代理设置。

## 给node子进程设置代理

curl 可以说明 VSCode 主进程代理生效了，但 node 子进程（插件）没有继承代理。

原因
VSCode 的 http.proxy 设置只影响 VSCode 主进程，插件的 node 子进程是独立进程，不会读取 VSCode 的代理设置。

解决方案
需要给 node 子进程设置环境变量。创建启动脚本：

# 保存为 start-vscode.ps1
```powershell
$env:HTTP_PROXY="http://127.0.0.1:10809"
$env:HTTPS_PROXY="http://127.0.0.1:10809"
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
& "code" "--proxy-server=http://127.0.0.1:10809"
```
双击运行这个脚本启动 VSCode。

验证
启动后，在 VSCode 终端测试：
```bash
node -e "require('https').get('https://api.github.com/zen', (r) => console.log(r.statusCode))"
```
如果返回 200 就成功了。