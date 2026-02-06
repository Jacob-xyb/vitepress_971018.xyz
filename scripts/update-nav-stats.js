import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import clipboardy from 'clipboardy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取 links.js 文件
const linksPath = path.resolve(__dirname, '../docs/nav/links.js')
let linksContent = fs.readFileSync(linksPath, 'utf-8')

// 从命令行参数、剪贴板或临时文件获取统计数据
let statsJson = process.argv[2]

// 如果没有参数，尝试从剪贴板读取
if (!statsJson) {
  try {
    console.log('📋 正在从剪贴板读取数据...')
    statsJson = await clipboardy.read()
    
    // 检查是否为空
    if (!statsJson || statsJson.trim() === '' || statsJson === 'null' || statsJson === 'undefined') {
      throw new Error('剪贴板为空')
    }
    
    // 验证是否是有效的 JSON
    const testParse = JSON.parse(statsJson)
    
    // 检查是否有有效数据
    if (!testParse || Object.keys(testParse).length === 0) {
      throw new Error('剪贴板中没有有效的统计数据')
    }
    
    console.log('✅ 成功从剪贴板读取数据')
  } catch (e) {
    // 剪贴板读取失败或不是有效 JSON，尝试从文件读取
    const tempFile = path.resolve(__dirname, '../.nav-stats-temp.json')
    if (fs.existsSync(tempFile)) {
      console.log('📂 从临时文件读取数据...')
      statsJson = fs.readFileSync(tempFile, 'utf-8')
      // 读取后删除临时文件
      fs.unlinkSync(tempFile)
    } else {
      console.error('❌ 错误：无法获取统计数据')
      console.log('\n可能的原因：')
      console.log('- 剪贴板为空或数据已清除')
      console.log('- 剪贴板中不是有效的 JSON 数据')
      console.log('\n使用方法：')
      console.log('1. 在浏览器控制台运行：copyNavStats()')
      console.log('2. 确保看到 "✅ 数据已复制到剪贴板" 提示')
      console.log('3. 然后运行：npm run update-nav-stats')
      console.log('\n或者使用文件方式：')
      console.log('1. 在浏览器控制台运行：exportNavStatsToFile()')
      console.log('2. 将下载的文件移动到项目根目录')
      console.log('3. 运行：npm run update-nav-stats')
      console.log('\n💡 提示：先访问导航页并点击几个链接，积累统计数据')
      process.exit(1)
    }
  }
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
  
  console.log('\n📌 下一步：清除本地统计数据')
  console.log('在浏览器控制台运行：clearNavStats()')
  console.log('或手动运行：localStorage.removeItem("navLinkStats")\n')

} catch (error) {
  console.error('❌ 错误：', error.message)
  console.log('\n请确保剪贴板中有有效的 JSON 数据')
  console.log('提示：在浏览器控制台运行 copyNavStats()')
  process.exit(1)
}
