---
title: 游戏攻略
pageClass: wide-page
outline: false
---

<script setup>
const games = [
  {
    id: 1,
    title: '仁王3',
    titleEn: 'Nioh 3',
    cover: '/gameover/仁王3-v.jpg',
    platform: 'PS5,PC',
    link: '/walkthrough/nioh-3'
  },
  {
    id: 2,
    title: '艾尔登法环',
    titleEn: 'Elden Ring',
    cover: '/games/elden-ring.jpg',
    platform: 'PC',
    link: '/walkthrough/elden-ring'
  },
  {
    id: 3,
    title: '荒野大镖客2',
    titleEn: 'Red Dead Redemption 2',
    cover: '/games/rdr2.jpg',
    platform: 'PS5',
    link: '/walkthrough/rdr2'
  },
    {
    id: 3,
    title: '荒野大镖客2',
    titleEn: 'Red Dead Redemption 2',
    cover: '/games/rdr2.jpg',
    platform: 'PS5',
    link: '/walkthrough/rdr2'
  },
    {
    id: 3,
    title: '荒野大镖客2',
    titleEn: 'Red Dead Redemption 2',
    cover: '/games/rdr2.jpg',
    platform: 'PS5',
    link: '/walkthrough/rdr2'
  },
    {
    id: 3,
    title: '荒野大镖客2',
    titleEn: 'Red Dead Redemption 2',
    cover: '/games/rdr2.jpg',
    platform: 'PS5',
    link: '/walkthrough/rdr2'
  },
  // 添加更多游戏...
]

// 根据平台返回对应的颜色
const getPlatformColor = (platform) => {
  const platformLower = platform.toLowerCase()
  
  if (platformLower.startsWith('ps')) {
    return { bg: '#2563eb', text: '#ffffff' } // 蓝色
  } else if (platformLower.startsWith('switch')) {
    return { bg: '#dc2626', text: '#ffffff' } // 红色
  } else if (platformLower.startsWith('pc')) {
    return { bg: '#6b7280', text: '#ffffff' } // 灰色
  }
  
  return { bg: '#6b7280', text: '#ffffff' } // 默认灰色
}
</script>

# 游戏攻略

<div class="games-container">
  <div v-for="game in games" :key="game.id" class="game-card">
    <a :href="game.link" class="game-link">
      <div class="game-cover">
        <img :src="game.cover" :alt="game.title" />
        <div class="game-overlay">
          <span class="view-text">查看攻略</span>
        </div>
      </div>
      <div class="game-info">
        <h3 class="game-title" :title="game.titleEn">{{ game.title }}</h3>
        <div class="game-meta">
          <span 
            v-for="(platform, index) in game.platform.split(',')" 
            :key="index"
            class="game-platform" 
            :style="{ 
              backgroundColor: getPlatformColor(platform).bg,
              color: getPlatformColor(platform).text
            }"
          >
            {{ platform }}
          </span>
        </div>
      </div>
    </a>
  </div>
</div>

<style scoped>
.games-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.game-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-1);
}

.game-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.game-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--vp-c-bg-mute);
}

.game-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-cover img {
  transform: scale(1.05);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.view-text {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid white;
  border-radius: 4px;
}

.game-info {
  padding: 1rem;
}

.game-title {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.75rem;
}

.game-platform {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.65rem;
  letter-spacing: 0.3px;
  line-height: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .games-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .game-info {
    padding: 0.75rem;
  }
  
  .game-title {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .games-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
