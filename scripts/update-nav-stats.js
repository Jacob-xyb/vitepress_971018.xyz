import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取 links.js 文件
const linksPath = path.resolve(__dirname, '../docs/nav/links.js')
let linksContent = fs.readFileSync(linksPath, 'utf-8')

// 从命令行参数获取统计数据
const statsJson = process.argv[2]

if (!statsJson) {
  console.error('❌ 错误：缺少统计数据参数')
  console.log('\n使用方法：')
  console.log('1. 在浏览器控制台运行：exportNavStats()')
  console.log('2. 数据会自动复制到剪贴板')
  console.log('3. 运行脚本：npm run update-nav-stats "粘贴的数据"')
  process.exit(1)
}

try {
  const stats = JSON.parse(statsJson)
  let updateCount = 0

  console.log('\n🔄 开始更新导航统计数据...\n')

  // 先解析 links.js 获取当前的 baseCount
  const getBaseCountFromFile = (url) => {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = linksContent.match(
      new RegExp(`url:\\s*['"]${escapedUrl}['"][^}]*baseCount:\\s*(\\d+)`)
    )
    return match ? parseInt(match[1]) : 0
  }

  // 遍历统计数据
  for (const [url, data] of Object.entries(stats)) {
    const userClicks = data.count || 0
    const currentBaseCount = getBaseCountFromFile(url)
    const newBaseCount = currentBaseCount + userClicks
    
    if (newBaseCount === 0) continue

    // 转义 URL 中的特殊字符用于正则匹配
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    // 匹配链接对象，查找 url 并更新或添加 baseCount
    const urlPattern = new RegExp(
      `(\\{[^}]*url:\\s*['"]${escapedUrl}['"][^}]*)(baseCount:\\s*\\d+)([^}]*\\})`,
      'g'
    )
    
    // 如果已存在 baseCount，更新它
    if (urlPattern.test(linksContent)) {
      linksContent = linksContent.replace(
        new RegExp(
          `(\\{[^}]*url:\\s*['"]${escapedUrl}['"][^}]*)(baseCount:\\s*)(\\d+)([^}]*\\})`,
          'g'
        ),
        `$1$2${newBaseCount}$4`
      )
      console.log(`✅ 更新：${url}`)
      console.log(`   旧基准: ${currentBaseCount}, 用户点击: ${userClicks}, 新基准: ${newBaseCount}`)
      updateCount++
    } else {
      // 如果不存在 baseCount，在 url 后面添加
      const addPattern = new RegExp(
        `(\\{[^}]*url:\\s*['"]${escapedUrl}['"])([^}]*)(\\})`,
        'g'
      )
      
      if (addPattern.test(linksContent)) {
        linksContent = linksContent.replace(
          new RegExp(
            `(\\{[^}]*url:\\s*['"]${escapedUrl}['"])([^}]*)(\\})`,
            'g'
          ),
          (match, p1, p2, p3) => {
            // 检查是否已经有 baseCount（避免重复添加）
            if (p2.includes('baseCount:')) {
              return match
            }
            // 在最后一个属性后添加 baseCount
            return `${p1}${p2}, baseCount: ${newBaseCount}${p3}`
          }
        )
        console.log(`✅ 添加：${url}`)
        console.log(`   用户点击: ${userClicks}, 新基准: ${newBaseCount}`)
        updateCount++
      }
    }
  }

  // 写回文件
  fs.writeFileSync(linksPath, linksContent, 'utf-8')

  console.log(`\n✨ 完成！共更新 ${updateCount} 个链接的统计数据`)
  console.log(`📝 文件已保存：${linksPath}`)
  
  // 生成清除 localStorage 的 HTML 文件
  const clearHtmlPath = path.resolve(__dirname, '../docs/public/clear-stats.html')
  const clearHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>清除导航统计数据</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 500px;
    }
    h1 { color: #333; margin-bottom: 1rem; }
    .status { font-size: 4rem; margin: 1rem 0; }
    .message { color: #666; font-size: 1.1rem; line-height: 1.6; }
    .success { color: #10b981; }
    .button {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.75rem 2rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.3s;
    }
    .button:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>导航统计数据清除</h1>
    <div class="status">✅</div>
    <div class="message success">
      <p><strong>统计数据已成功清除！</strong></p>
      <p>您的本地访问记录已重置</p>
      <p>现在显示的是最新的基准热度</p>
    </div>
    <a href="/nav/" class="button">返回导航页</a>
  </div>
  <script>
    // 清除 localStorage
    localStorage.removeItem('navLinkStats');
    console.log('✅ 导航统计数据已清除');
  </script>
</body>
</html>`

  fs.writeFileSync(clearHtmlPath, clearHtml, 'utf-8')
  
  console.log('\n🌐 已生成清除页面：')
  console.log(`   ${clearHtmlPath}`)
  console.log('\n📌 下一步：')
  console.log('1. 启动开发服务器：npm run docs:dev')
  console.log('2. 访问：http://localhost:5173/clear-stats.html')
  console.log('3. 页面会自动清除 localStorage 并跳转回导航页')
  console.log('\n或者手动在浏览器控制台运行：')
  console.log('   localStorage.removeItem("navLinkStats")\n')

} catch (error) {
  console.error('❌ 错误：', error.message)
  console.log('\n请确保提供的是有效的 JSON 数据')
  process.exit(1)
}
