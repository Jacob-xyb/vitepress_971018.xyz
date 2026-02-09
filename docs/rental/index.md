---
layout: home
title: 游戏租赁
outline: false
---

<script setup>
import { ref } from 'vue'
import { rentalGames } from './games-data.js'
import RentalCard from '../.vitepress/theme/components/RentalCard.vue'

const isDev = ref(import.meta.env.DEV)
const games = ref(rentalGames)
</script>

# 游戏租赁管理

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
    v-for="game in games" 
    :key="game.id" 
    :game="game"
    :isDev="isDev"
  />
</div>

<style scoped>
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

@media (max-width: 768px) {
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
