<template>
  <div class="cooking-menu-container">
    <!-- 左侧分类导航 -->
    <aside class="menu-sidebar">
      <div class="menu-category" 
           v-for="category in categories" 
           :key="category.id"
           :class="{ active: activeCategory === category.id }"
           @click="activeCategory = category.id">
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
      </div>
    </aside>

    <!-- 右侧菜品区 -->
    <main class="menu-content">
      <div class="menu-section" v-for="section in currentSections" :key="section.title">
        <h2 class="section-title">
          <span class="title-icon">{{ section.icon }}</span>
          {{ section.title }}
        </h2>
        <div class="dishes-grid">
          <a v-for="dish in section.dishes" 
             :key="dish.name"
             :href="dish.link ? `/food/cooking/${dish.link}` : undefined"
             class="dish-card"
             :class="{ 'has-link': dish.link }"
             :style="{ cursor: dish.link ? 'pointer' : 'default' }">
            <div class="dish-info">
              <div class="dish-name">{{ dish.name }}</div>
              <div class="dish-desc">{{ dish.desc }}</div>
              <div class="dish-meta">
                <span class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  {{ dish.time }}
                </span>
                <span class="meta-item" :class="`difficulty-${dish.difficulty}`">
                  <span class="meta-icon">📊</span>
                  {{ dish.difficulty }}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { dishesData } from '../../../food/cooking/dishes.js'

const activeCategory = ref(dishesData.categories[0]?.id || 'meat')

const categories = dishesData.categories
const dishes = dishesData.dishes

// 获取当前分类的内容
const currentSections = computed(() => {
  return dishes[activeCategory.value] || []
})
</script>

<style scoped>
.cooking-menu-container {
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
.menu-sidebar {
  width: 200px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  padding: 20px 0;
  flex-shrink: 0;
}

.menu-category {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--vp-c-text-2);
}

.menu-category:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
}

.menu-category.active {
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
.menu-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  max-height: 800px;
}

.menu-section {
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
  font-size: 24px;
}

/* 菜品卡片网格 */
.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.dish-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
}

.dish-card.has-link {
  cursor: pointer;
}

.dish-card.has-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.dish-info {
  flex: 1;
  min-width: 0;
}

.dish-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.dish-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.dish-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--vp-c-text-2);
}

.meta-icon {
  font-size: 14px;
}

.difficulty-简单 {
  color: #10b981;
}

.difficulty-中等 {
  color: #f59e0b;
}

.difficulty-困难 {
  color: #ef4444;
}

/* 响应式 */
@media (max-width: 768px) {
  .cooking-menu-container {
    flex-direction: column;
  }

  .menu-sidebar {
    width: 100%;
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 10px;
  }

  .menu-category {
    flex-direction: column;
    padding: 10px 15px;
    white-space: nowrap;
  }

  .category-icon {
    margin-right: 0;
    margin-bottom: 4px;
  }

  .dishes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
