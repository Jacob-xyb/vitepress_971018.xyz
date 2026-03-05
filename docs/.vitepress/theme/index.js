import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './markdown.css'
import ThemeIcon from './components/ThemeIcon.vue'
import NavLinks from './components/NavLinks.vue'
import NavCards from './components/NavCards.vue'
import CookingMenu from './components/CookingMenu.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ThemeIcon', ThemeIcon)
    app.component('NavLinks', NavLinks)
    app.component('NavCards', NavCards)
    app.component('CookingMenu', CookingMenu)
    
    // 开发模式：全局导出函数（任何页面都可用）
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      window.exportNavStats = () => {
        const data = localStorage.getItem('navLinkStats')
        
        if (!data || data === '{}') {
          console.log('\n❌ 暂无统计数据')
          console.log('💡 提示：先访问导航页并点击几个链接\n')
          return
        }
        
        const stats = JSON.parse(data)
        const hasData = Object.keys(stats).some(url => stats[url]?.count > 0)
        
        if (!hasData) {
          console.log('\n❌ 暂无有效统计数据')
          console.log('💡 提示：先访问导航页并点击几个链接\n')
          return
        }
        
        console.log('\n=== 导航统计数据导出 ===\n')
        console.log('📊 统计数据：')
        
        // 按访问次数排序
        const sortedStats = Object.entries(stats)
          .filter(([_, data]) => data.count > 0)
          .sort((a, b) => b[1].count - a[1].count)
        
        sortedStats.forEach(([url, data], index) => {
          console.log(`  ${index + 1}. ${url}`)
          console.log(`     访问次数: ${data.count}`)
          console.log(`     最后访问: ${data.lastVisit ? new Date(data.lastVisit).toLocaleString() : '未知'}`)
        })
        
        console.log('\n📋 复制数据到剪贴板：')
        console.log('请运行以下命令（浏览器内置复制功能）：')
        console.log('%ccopy(localStorage.getItem("navLinkStats"))', 'color: #10b981; font-weight: bold; font-size: 14px;')
        console.log('\n然后在终端运行：')
        console.log('npm run update-nav-stats "粘贴的数据"')
        console.log('\n📦 原始数据（可手动复制）：')
        console.log(data)
        console.log('\n')
      }
      
      // 一键复制函数（使用浏览器 copy 命令）
      window.copyNavStats = async () => {
        const data = localStorage.getItem('navLinkStats')
        if (!data || data === '{}') {
          console.log('❌ 暂无统计数据')
          return
        }
        
        // 方法1：直接尝试使用控制台 copy() 函数（最可靠）
        try {
          copy(data)  // 直接调用，不检测
          console.log('✅ 数据已复制到剪贴板')
          console.log('💡 现在可以运行：npm run update-nav-stats')
          return
        } catch (e) {
          // copy() 不可用，继续尝试其他方法
          console.log('⚠️  控制台 copy() 函数不可用，尝试其他方法...')
        }
        
        // 方法2：尝试使用 Clipboard API
        try {
          await navigator.clipboard.writeText(data)
          console.log('✅ 数据已复制到剪贴板（使用 Clipboard API）')
          return
        } catch (e) {
          // Clipboard API 失败
        }
        
        // 方法3：使用临时 textarea（最可靠）
        try {
          const textarea = document.createElement('textarea')
          textarea.value = data
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          const success = document.execCommand('copy')
          document.body.removeChild(textarea)
          
          if (success) {
            console.log('✅ 数据已复制到剪贴板（使用 execCommand）')
            return
          }
        } catch (e) {
          // execCommand 也失败了
        }
        
        // 所有方法都失败，显示数据让用户手动复制
        console.log('⚠️  自动复制失败，请手动复制以下数据：')
        console.log(data)
        console.log('\n或者使用：exportNavStatsToFile() 导出到文件')
      }
      
      // 导出到文件（避免引号问题）
      window.exportNavStatsToFile = () => {
        const data = localStorage.getItem('navLinkStats')
        if (!data || data === '{}') {
          console.log('❌ 暂无统计数据')
          return
        }
        
        // 创建下载链接
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '.nav-stats-temp.json'
        a.click()
        URL.revokeObjectURL(url)
        
        console.log('✅ 数据已下载到文件：.nav-stats-temp.json')
        console.log('📌 下一步：')
        console.log('1. 将下载的文件移动到项目根目录')
        console.log('2. 运行：npm run update-nav-stats')
        console.log('3. 脚本会自动读取文件并更新')
      }
      
      // 清除统计数据函数
      window.clearNavStats = () => {
        const confirm = window.confirm('确定要清除所有统计数据吗？')
        if (confirm) {
          localStorage.removeItem('navLinkStats')
          console.log('✅ 统计数据已清除！')
          console.log('💡 刷新页面后生效')
        }
      }
      
      console.log('%c💡 开发模式提示（全局可用）', 'color: #3b82f6; font-weight: bold; font-size: 14px;')
      console.log('- exportNavStats() - 导出统计数据')
      console.log('- copyNavStats() - 一键复制数据')
      console.log('- exportNavStatsToFile() - 导出到文件（推荐，避免引号问题）')
      console.log('- clearNavStats() - 清除统计数据')
      console.log('\n%c快速复制命令：', 'color: #10b981; font-weight: bold;')
      console.log('copy(localStorage.getItem("navLinkStats"))')
    }
  }
}

