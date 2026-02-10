<template>
  <div class="rental-stats" v-if="isDev">
    <div class="stats-header">
      <h3>📊 总体统计</h3>
      <span class="dev-badge">DEV</span>
    </div>
    
    <div class="stats-grid">
      <!-- 财务统计 -->
      <div class="stat-card financial">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-label">总投入</div>
          <div class="stat-value">¥{{ stats.totalCost }}</div>
        </div>
      </div>
      
      <div class="stat-card financial">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <div class="stat-label">总收入</div>
          <div class="stat-value">¥{{ stats.totalIncome }}</div>
        </div>
      </div>
      
      <div class="stat-card financial" :class="profitClass">
        <div class="stat-icon">{{ stats.totalProfit >= 0 ? '📈' : '📉' }}</div>
        <div class="stat-content">
          <div class="stat-label">净利润</div>
          <div class="stat-value">¥{{ stats.totalProfit }}</div>
        </div>
      </div>
      
      <div class="stat-card highlight">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-label">回报率</div>
          <div class="stat-value">{{ stats.recoveryRate }}%</div>
          <div class="stat-progress">
            <div class="progress-bar" :style="{ width: Math.min(stats.recoveryRate, 100) + '%' }"></div>
          </div>
        </div>
      </div>
      
      <!-- 游戏统计 -->
      <div class="stat-card">
        <div class="stat-icon">🎮</div>
        <div class="stat-content">
          <div class="stat-label">游戏总数</div>
          <div class="stat-value">{{ stats.totalGames }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-label">已回本</div>
          <div class="stat-value">{{ stats.recoveredGames }}</div>
          <div class="stat-sub">{{ recoveryPercentage }}%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-label">租赁次数</div>
          <div class="stat-value">{{ stats.totalRentals }}</div>
        </div>
      </div>
      
      <!-- 状态统计 -->
      <div class="stat-card status">
        <div class="stat-icon">🟢</div>
        <div class="stat-content">
          <div class="stat-label">未出租</div>
          <div class="stat-value">{{ stats.availableGames }}</div>
        </div>
      </div>
      
      <div class="stat-card status">
        <div class="stat-icon">🟡</div>
        <div class="stat-content">
          <div class="stat-label">出租中</div>
          <div class="stat-value">{{ stats.rentedGames }}</div>
        </div>
      </div>
      
      <div class="stat-card status" :class="{ 'warning': stats.overdueGames > 0 }">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-label">已超时</div>
          <div class="stat-value">{{ stats.overdueGames }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  isDev: {
    type: Boolean,
    default: false
  }
})

const profitClass = computed(() => {
  if (props.stats.totalProfit > 0) return 'profit'
  if (props.stats.totalProfit < 0) return 'loss'
  return ''
})

const recoveryPercentage = computed(() => {
  if (props.stats.totalGames === 0) return 0
  return ((props.stats.recoveredGames / props.stats.totalGames) * 100).toFixed(0)
})
</script>

<style scoped>
.rental-stats {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 2px dashed var(--vp-c-brand-1);
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stats-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.dev-badge {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.highlight {
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg) 100%);
  border-color: var(--vp-c-brand-1);
}

.stat-card.financial {
  border-left: 3px solid var(--vp-c-brand-1);
}

.stat-card.profit {
  border-left-color: #10b981;
}

.stat-card.loss {
  border-left-color: #ef4444;
}

.stat-card.warning {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.stat-icon {
  font-size: 2rem;
  line-height: 1;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.stat-sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
}

.stat-progress {
  margin-top: 0.5rem;
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transition: width 0.6s ease;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .rental-stats {
    padding: 1rem;
  }
  
  .stats-grid {
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 0.75rem;
    gap: 0.75rem;
  }
}
</style>
