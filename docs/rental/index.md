---
layout: home
title: 游戏租赁
outline: false
---

<script setup>
import { ref, computed } from 'vue'
import { rentalGames } from './games-data.js'
import { getGameStatus } from './rental-utils.js'
import RentalCard from '../.vitepress/theme/components/RentalCard.vue'

const isDev = ref(import.meta.env.DEV)
const selectedStatus = ref('all')
const selectedPlatform = ref('all')

const platforms = computed(() => {
  const platformSet = new Set(rentalGames.map(game => game.platform))
  return ['all', ...Array.from(platformSet)]
})

const filteredGames = computed(() => {
  return rentalGames.filter(game => {
    const statusMatch = selectedStatus.value === 'all' || getGameStatus(game) === selectedStatus.value
    const platformMatch = selectedPlatform.value === 'all' || game.platform === selectedPlatform.value
    return statusMatch && platformMatch
  })
})

const resetFilters = () => {
  selectedStatus.value = 'all'
  selectedPlatform.value = 'all'
}

const hasFilters = computed(() => {
  return selectedStatus.value !== 'all' || selectedPlatform.value !== 'all'
})
</script>

# 游戏租赁管理

<div class="filters-container">
  <div class="filter-group">
    <label class="filter-label">状态：</label>
    <select v-model="selectedStatus" class="filter-select">
      <option value="all">全部</option>
      <option value="available">未出租</option>
      <option value="rented">出租中</option>
      <option value="overdue">已超时</option>
    </select>
  </div>
  
  <div class="filter-group">
    <label class="filter-label">平台：</label>
    <select v-model="selectedPlatform" class="filter-select">
      <option value="all">全部</option>
      <option v-for="platform in platforms.filter(p => p !== 'all')" :key="platform" :value="platform">
        {{ platform }}
      </option>
    </select>
  </div>
  
  <button @click="resetFilters" class="reset-btn" :disabled="!hasFilters">
    重置
  </button>
</div>

<div class="status-legend">
  <div class="legend-item">
    <span class="legend-dot available"></span>
    <span class="legend-text">未出租</span>
  </div>
  <div class="legend-item">
    <span class="legend-dot rented"></span>
    <span class="legend-text">出租中</span>
  </div>
  <div class="legend-item">
    <span class="legend-dot overdue"></span>
    <span class="legend-text">已超时</span>
  </div>
  <span class="legend-note">价格仅供参考</span>
</div>

<div class="games-container">
  <RentalCard 
    v-for="game in filteredGames" 
    :key="game.id" 
    :game="game"
    :isDev="isDev"
  />
</div>

<div v-if="filteredGames.length === 0" class="no-results">
  <p>😔 没有找到符合条件的游戏</p>
</div>

<style scoped>
.filters-container {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  white-space: nowrap;
}

.filter-select {
  min-width: 120px;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 12px;
}

.filter-select:hover {
  border-color: var(--vp-c-brand-1);
}

.filter-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.reset-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  margin-left: auto;
}

.reset-btn:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-legend {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid;
}

.legend-dot.available {
  background: #10b981;
  border-color: #10b981;
}

.legend-dot.rented {
  background: #f59e0b;
  border-color: #f59e0b;
}

.legend-dot.overdue {
  background: #ef4444;
  border-color: #ef4444;
}

.legend-text {
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.legend-note {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.games-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.no-results p {
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .filters-container {
    gap: 0.75rem;
  }
  
  .filter-group {
    flex: 1;
    min-width: 120px;
  }
  
  .filter-select {
    min-width: 0;
    width: 100%;
  }
  
  .reset-btn {
    width: 100%;
  }
  
  .games-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .games-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
