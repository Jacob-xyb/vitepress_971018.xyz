<template>
  <div class="nav-links-container">
    <!-- 左侧分类导航 -->
    <aside class="nav-sidebar">
      <div class="nav-category" 
           v-for="category in categories" 
           :key="category.id"
           :class="{ active: activeCategory === category.id }"
           @click="activeCategory = category.id">
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="nav-content">
      <div class="nav-section" v-for="section in currentSections" :key="section.title">
        <h2 class="section-title">
          <span class="title-icon">{{ section.icon }}</span>
          {{ section.title }}
        </h2>
        <div class="links-grid">
          <a v-for="link in section.links" 
             :key="link.name"
             :href="link.url"
             target="_blank"
             class="link-card"
             @click="handleLinkClick(link)">
            <div class="link-icon">
              <!-- 如果是 Simple Icons 名称（不含 / . http），使用 ThemeIcon -->
              <ThemeIcon 
                v-if="isSimpleIcon(link.icon)" 
                :icon="link.icon" 
                size="36px"
                :alt="link.name"
              />
              <!-- 如果是图片路径，使用 img -->
              <img v-else-if="isImageIcon(link.icon)" :src="link.icon" :alt="link.name" />
              <!-- 否则显示 emoji 或默认图标 -->
              <span v-else>{{ link.icon || '🔗' }}</span>
            </div>
            <div class="link-info">
              <div class="link-name">
                {{ link.name }}
                <span class="badges">
                  <span v-if="link.needVPN" class="badge badge-vpn" title="需要 VPN 访问">🌐</span>
                  <span v-if="link.hasAds" class="badge badge-ads" title="包含广告">📢</span>
                  <span v-if="link.needLogin" class="badge badge-login" title="需要登录">🔐</span>
                  <span v-if="link.needPay" class="badge badge-pay" title="需要付费">💰</span>
                  <span v-if="link.isFree" class="badge badge-free" title="完全免费">✨</span>
                  <span v-if="getHotLevel(link.url) > 0" class="badge badge-hot" :title="`已访问 ${getClickCount(link.url)} 次`">
                    {{ '🔥'.repeat(getHotLevel(link.url)) }}
                  </span>
                </span>
              </div>
              <div class="link-desc">{{ link.desc }}</div>
            </div>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { navData, hotConfig, mvpConfig } from '../../../nav/links.js'
import ThemeIcon from './ThemeIcon.vue'

const activeCategory = ref(navData.categories[0]?.id || 'mvp')
const categories = navData.categories
const links = navData.links
const linkStats = ref({})

// 获取当前分类的内容（如果是 mvp 则动态生成）
const currentSections = computed(() => {
  if (activeCategory.value === 'mvp') {
    return generateMvpSections()
  }
  return links[activeCategory.value] || []
})

// 判断是否为 Simple Icons 名称（纯字母、数字、连字符）
const isSimpleIcon = (icon) => {
  if (!icon || typeof icon !== 'string') return false
  // 不包含 / . http 等路径特征，且只包含字母数字连字符
  return !icon.includes('/') && !icon.includes('.') && !icon.startsWith('http') && /^[a-z0-9-]+$/i.test(icon)
}

// 判断是否为图片路径
const isImageIcon = (icon) => {
  if (!icon) return false
  return icon.startsWith('/') || icon.startsWith('http') || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.svg') || icon.endsWith('.webp')
}

// 加载统计数据
const loadStats = () => {
  try {
    const saved = localStorage.getItem('navLinkStats')
    if (saved) {
      linkStats.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

// 保存统计数据
const saveStats = () => {
  try {
    localStorage.setItem('navLinkStats', JSON.stringify(linkStats.value))
  } catch (error) {
    console.error('Failed to save stats:', error)
  }
}

// 获取基准访问次数
const getBaseCount = (url) => {
  // 遍历所有链接找到对应的 baseCount
  for (const categoryLinks of Object.values(links)) {
    for (const section of categoryLinks) {
      const link = section.links.find(l => l.url === url)
      if (link && link.baseCount) {
        return link.baseCount
      }
    }
  }
  return 0
}

// 记录点击
const handleLinkClick = (link) => {
  const url = link.url
  
  if (!linkStats.value[url]) {
    linkStats.value[url] = {
      count: 0,
      lastVisit: null
    }
  }
  
  linkStats.value[url].count++
  linkStats.value[url].lastVisit = new Date().toISOString()
  saveStats()
}

// 获取点击次数（baseCount + 用户实际点击次数）
const getClickCount = (url) => {
  const baseCount = getBaseCount(url)
  const userClicks = linkStats.value[url]?.count || 0
  return baseCount + userClicks
}

// 获取所有链接的访问次数（用于排名）
const getAllCounts = computed(() => {
  const allUrls = []
  for (const categoryLinks of Object.values(links)) {
    for (const section of categoryLinks) {
      for (const link of section.links) {
        const count = getClickCount(link.url)
        if (count >= hotConfig.minCount) {
          allUrls.push({ 
            url: link.url, 
            count,
            link: link  // 保存完整的链接对象
          })
        }
      }
    }
  }
  // 按访问次数降序排序
  return allUrls.sort((a, b) => b.count - a.count)
})

// 生成全场最佳页面的内容
const generateMvpSections = () => {
  const allCounts = getAllCounts.value
  
  // 过滤出符合最低访问次数的链接
  const qualifiedLinks = allCounts.filter(item => item.count >= mvpConfig.minCount)
  
  if (qualifiedLinks.length === 0) {
    return [{
      title: '暂无数据',
      icon: '📊',
      links: []
    }]
  }
  
  const sections = []
  
  // OnePiece - 第1名
  const onePieceLinks = qualifiedLinks.slice(0, mvpConfig.onePiece)
  if (onePieceLinks.length > 0) {
    sections.push({
      title: 'OnePiece',
      icon: '👑',
      links: onePieceLinks.map(item => ({
        ...item.link,
        desc: `${item.link.desc} · 访问 ${item.count} 次`
      }))
    })
  }
  
  // 四皇 - 第2-5名
  const yonkoLinks = qualifiedLinks.slice(mvpConfig.onePiece, mvpConfig.onePiece + mvpConfig.yonko)
  if (yonkoLinks.length > 0) {
    sections.push({
      title: '四皇',
      icon: '⚔️',
      links: yonkoLinks.map(item => ({
        ...item.link,
        desc: `${item.link.desc} · 访问 ${item.count} 次`
      }))
    })
  }
  
  // 七武海 - 第6-12名
  const shichibukaiLinks = qualifiedLinks.slice(
    mvpConfig.onePiece + mvpConfig.yonko, 
    mvpConfig.onePiece + mvpConfig.yonko + mvpConfig.shichibukai
  )
  if (shichibukaiLinks.length > 0) {
    sections.push({
      title: '七武海',
      icon: '🗡️',
      links: shichibukaiLinks.map(item => ({
        ...item.link,
        desc: `${item.link.desc} · 访问 ${item.count} 次`
      }))
    })
  }
  
  return sections
}

// 获取热度等级（基于排名）
const getHotLevel = (url) => {
  const count = getClickCount(url)
  if (count < hotConfig.minCount) return 0
  
  const allCounts = getAllCounts.value
  const rank = allCounts.findIndex(item => item.url === url) + 1
  
  if (rank === 0) return 0
  if (rank <= hotConfig.topHot) return 3      // 前N名：🔥🔥🔥
  if (rank <= hotConfig.topHot + hotConfig.secondHot) return 2  // 前N+M名：🔥🔥
  if (rank <= hotConfig.topHot + hotConfig.secondHot + hotConfig.thirdHot) return 1  // 前N+M+K名：🔥
  
  return 0
}

// 监听 localStorage 变化（跨标签页实时更新）
const handleStorageChange = (e) => {
  if (e.key === 'navLinkStats' && e.newValue) {
    try {
      linkStats.value = JSON.parse(e.newValue)
    } catch (error) {
      console.error('Failed to parse storage change:', error)
    }
  }
}

onMounted(() => {
  loadStats()
  // 监听其他标签页的 localStorage 变化
  window.addEventListener('storage', handleStorageChange)
  
  // 开发模式：暴露导出函数到全局
  if (import.meta.env.DEV) {
    window.exportNavStats = () => {
      const data = localStorage.getItem('navLinkStats')
      
      if (!data || data === '{}') {
        console.log('\n❌ 暂无统计数据')
        console.log('💡 提示：先点击几个链接，然后再导出统计数据\n')
        return
      }
      
      const stats = JSON.parse(data)
      const hasData = Object.keys(stats).some(url => stats[url].count > 0)
      
      if (!hasData) {
        console.log('\n❌ 暂无有效统计数据')
        console.log('💡 提示：先点击几个链接，然后再导出统计数据\n')
        return
      }
      
      console.log('\n=== 导航统计数据导出 ===\n')
      console.log('📊 统计数据（按访问次数排序）：')
      
      const allCounts = getAllCounts.value
      allCounts.forEach((item, index) => {
        const rank = index + 1
        const userClicks = linkStats.value[item.url]?.count || 0
        const baseCount = getBaseCount(item.url)
        const level = getHotLevel(item.url)
        const fire = level === 3 ? '🔥🔥🔥' : level === 2 ? '🔥🔥' : level === 1 ? '🔥' : ''
        console.log(`  ${rank}. ${item.url} ${fire}`)
        console.log(`     总计: ${item.count} (基准: ${baseCount} + 用户: ${userClicks})`)
      })
      
      console.log('\n📋 使用方法（自动更新）：')
      console.log('1. 数据正在复制到剪贴板...')
      console.log('2. 在终端运行：')
      console.log('   npm run update-nav-stats "粘贴的数据"')
      console.log('3. 访问清除页面：http://localhost:5173/clear-stats.html')
      
      // 尝试自动复制到剪贴板
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(data)
          .then(() => {
            console.log('\n✅ 数据已复制到剪贴板！直接粘贴即可')
          })
          .catch((err) => {
            console.log('\n⚠️  自动复制失败，请手动复制：')
            console.log('运行：copy(localStorage.getItem("navLinkStats"))')
            console.log('错误：', err.message)
            console.log('\n📦 原始数据：')
            console.log(data)
          })
      } else {
        console.log('\n⚠️  浏览器不支持自动复制，请手动复制：')
        console.log('运行：copy(localStorage.getItem("navLinkStats"))')
        console.log('\n📦 原始数据：')
        console.log(data)
      }
    }
    
    // 添加手动复制函数
    window.copyNavStats = () => {
      const data = localStorage.getItem('navLinkStats')
      if (!data || data === '{}') {
        console.log('❌ 暂无统计数据')
        return
      }
      console.log('📋 请复制以下数据：')
      console.log(data)
      console.log('\n或者运行：copy(localStorage.getItem("navLinkStats"))')
    }
    
    console.log('💡 开发模式提示：')
    console.log('- 运行 exportNavStats() 导出统计数据')
    console.log('- 运行 copyNavStats() 手动查看数据')
  }
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
.nav-links-container {
  display: flex;
  min-height: 600px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 100%;
}

/* 左侧分类导航 */
.nav-sidebar {
  width: 200px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  padding: 20px 0;
  flex-shrink: 0;
}

.nav-category {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--vp-c-text-2);
}

.nav-category:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
}

.nav-category.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  border-right: 3px solid var(--vp-c-brand);
}

.category-icon {
  font-size: 20px;
  margin-right: 10px;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
}

/* 右侧内容区 */
.nav-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  max-height: 800px;
}

.nav-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.title-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* 链接卡片网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.link-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.link-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 12px;
  flex-shrink: 0;
  background: var(--vp-c-bg);
  border-radius: 8px;
}

.link-icon img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 4px;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badges {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.badge {
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  animation: pulse 2s ease-in-out infinite;
}

.badge-vpn {
  animation: pulse 2s ease-in-out infinite;
}

.badge-ads {
  animation: none;
  opacity: 0.8;
}

.badge-login {
  animation: none;
  opacity: 0.8;
}

.badge-pay {
  animation: none;
  opacity: 0.8;
}

.badge-free {
  animation: sparkle 1.5s ease-in-out infinite;
}

.badge-hot {
  animation: fire 0.8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes fire {
  0%, 100% {
    transform: scale(1) rotate(-5deg);
  }
  50% {
    transform: scale(1.15) rotate(5deg);
  }
}

.link-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-links-container {
    flex-direction: column;
  }

  .nav-sidebar {
    width: 100%;
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 10px;
  }

  .nav-category {
    flex-direction: column;
    padding: 10px 15px;
    white-space: nowrap;
  }

  .category-icon {
    margin-right: 0;
    margin-bottom: 4px;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
