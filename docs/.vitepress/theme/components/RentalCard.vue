<template>
  <div 
    class="rental-card" 
    :class="{ 'clickable': isDev }"
    :style="{ borderColor: statusConfig[gameStatus].color }"
    @click="isDev && toggleDetails()"
  >
    <div class="game-cover">
      <img :src="game.cover" :alt="game.title" />
    </div>
    <div class="game-info">
      <div class="title-row">
        <h3 class="game-title" :title="game.titleEn">{{ game.title }}</h3>
        <span 
          class="status-dot" 
          :style="{ 
            backgroundColor: statusConfig[gameStatus].color,
            borderColor: statusConfig[gameStatus].color
          }"
        ></span>
      </div>
      <div class="game-meta">
        <span class="rental-price">￥{{ game.rentalPrice }}/月</span>
        <span class="deposit-price">押金: ￥{{ game.deposit }}</span>
      </div>
      <div class="return-info" v-if="lastReturnDate">
        <span class="return-date">
          {{ currentRental ? '预计归还' : '上次归还' }}: {{ lastReturnDate }}
        </span>
      </div>
    </div>
    
    <!-- 弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetails" class="modal-overlay" @click="toggleDetails">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>{{ game.title }}</h3>
              <button class="close-btn" @click="toggleDetails">✕</button>
            </div>
            
            <div class="modal-body">
              <div class="details-section" v-if="game.note">
                <h4>物品状态</h4>
                <div class="note-content">
                  <span class="note-icon">📝</span>
                  <span class="note-text">{{ game.note }}</span>
                </div>
              </div>
              
              <div class="details-section">
                <h4>财务概览</h4>
                <div class="finance-grid">
                  <div class="finance-item">
                    <span class="finance-label">本金</span>
                    <span class="finance-value cost">{{ game.cost }} 元</span>
                  </div>
                  <div class="finance-item">
                    <span class="finance-label">总收入</span>
                    <span class="finance-value income">{{ getTotalIncome(game) }} 元</span>
                  </div>
                  <div class="finance-item">
                    <span class="finance-label">净利润</span>
                    <span class="finance-value" :class="getNetProfit(game) >= 0 ? 'profit' : 'loss'">
                      {{ getNetProfit(game) }} 元
                    </span>
                  </div>
                  <div class="finance-item">
                    <span class="finance-label">回本进度</span>
                    <span class="finance-value progress">{{ getRecoveryRate(game) }}%</span>
                  </div>
                </div>
                
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getRecoveryRate(game) + '%' }"></div>
                </div>
              </div>
              
              <div class="details-section">
                <h4>租赁历史</h4>
                <div v-if="game.history.length > 0" class="history-list">
                  <div v-for="(record, index) in game.history" :key="index" class="history-item">
                    <div class="history-date">{{ record.date }}</div>
                    <div class="history-info">
                      <span class="history-renter">{{ record.renter }}</span>
                      <span class="history-days">{{ calculateDays(record.date, record.returnDate || new Date().toISOString().split('T')[0]) }} 天</span>
                      <span class="history-income">+{{ record.income }} 元</span>
                    </div>
                  </div>
                </div>
                <div v-else class="no-history">暂无租赁记录</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { statusConfig } from '../../../rental/rental-config.js'
import { getTotalIncome, getNetProfit, getRecoveryRate, calculateDays, getGameStatus } from '../../../rental/rental-utils.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  isDev: {
    type: Boolean,
    default: false
  }
})

const showDetails = ref(false)

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

// 计算游戏状态
const gameStatus = computed(() => getGameStatus(props.game))

// 获取当前租赁记录
const currentRental = computed(() => {
  if (props.game.history && props.game.history.length > 0) {
    for (let i = props.game.history.length - 1; i >= 0; i--) {
      if (!props.game.history[i].returned) {
        return props.game.history[i]
      }
    }
  }
  return null
})

// 获取归还时间
const lastReturnDate = computed(() => {
  // 如果有当前租赁，显示预计归还时间
  if (currentRental.value && currentRental.value.returnDate) {
    return currentRental.value.returnDate
  }
  
  // 否则显示最后一次已归还记录的归还日期
  if (props.game.history && props.game.history.length > 0) {
    for (let i = props.game.history.length - 1; i >= 0; i--) {
      if (props.game.history[i].returned && props.game.history[i].returnDate) {
        return props.game.history[i].returnDate
      }
    }
  }
  
  return null
})
</script>

<style scoped>
.rental-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rental-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-1);
}

.rental-card.clickable {
  cursor: pointer;
}

.rental-card.clickable:hover {
  transform: translateY(-8px) scale(1.02);
}

.game-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  overflow: hidden;
  background: var(--vp-c-bg-mute);
}

.game-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rental-card:hover .game-cover img {
  transform: scale(1.05);
}

.game-info {
  padding: 1rem;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.game-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  flex: 1;
}

.status-dot {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.rental-price {
  font-size: 0.75rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.deposit-price {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.return-info {
  display: flex;
  justify-content: flex-end;
}

.return-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: var(--vp-c-bg);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

.details-section {
  margin-bottom: 1.5rem;
}

.details-section:last-child {
  margin-bottom: 0;
}

.details-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.note-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.note-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.note-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.finance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.finance-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.finance-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.finance-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.finance-value.cost {
  color: var(--vp-c-text-1);
}

.finance-value.income {
  color: #10b981;
}

.finance-value.profit {
  color: #10b981;
}

.finance-value.loss {
  color: #ef4444;
}

.finance-value.progress {
  color: var(--vp-c-brand-1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transition: width 0.3s ease;
  border-radius: 4px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  background: var(--vp-c-bg-soft);
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.history-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.history-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.history-renter {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.history-days {
  color: var(--vp-c-text-2);
}

.history-income {
  color: #10b981;
  font-weight: 600;
}

.no-history {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .finance-grid {
    grid-template-columns: 1fr;
  }
}
</style>
