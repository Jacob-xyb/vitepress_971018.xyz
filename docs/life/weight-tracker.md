---
title: 体重记录
---

<script setup>
import { ref, computed, onMounted } from 'vue'
import weightData from './weight-data.js'

// 将数组数据转换为对象格式
const records = ref(
  weightData.data.map(row => ({
    date: row[0],
    weight: row[1],
    calories: row[2],
    rope: row[3]
  }))
)

// 当前选择的指标
const selectedMetric = ref('calories')

// 指标选项
const metrics = [
  { value: 'calories', label: '消耗卡路里 (kcal)', color: '#ef4444' },
  { value: 'rope', label: '跳绳个数', color: '#10b981' }
]

// 图表实例
let chartInstance = null

// 初始化图表
onMounted(() => {
  if (typeof window !== 'undefined') {
    import('chart.js/auto').then((Chart) => {
      const ctx = document.getElementById('weightChart')
      if (ctx) {
        createChart(Chart.default)
      }
    })
  }
})

// 创建图表
function createChart(Chart) {
  const ctx = document.getElementById('weightChart')
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const currentMetric = metrics.find(m => m.value === selectedMetric.value)
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: records.value.map(r => r.date),
      datasets: [
        {
          label: '体重 (kg)',
          data: records.value.map(r => r.weight),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          yAxisID: 'y',
          tension: 0.3,
          fill: true
        },
        {
          label: currentMetric.label,
          data: records.value.map(r => r[selectedMetric.value]),
          borderColor: currentMetric.color,
          backgroundColor: currentMetric.color + '20',
          yAxisID: 'y1',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              label += context.parsed.y
              return label
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: '体重 (kg)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: currentMetric.label
          },
          grid: {
            drawOnChartArea: false,
          }
        }
      }
    }
  })
}

// 切换指标
function changeMetric(metric) {
  selectedMetric.value = metric
  if (typeof window !== 'undefined') {
    import('chart.js/auto').then((Chart) => {
      createChart(Chart.default)
    })
  }
}

// 统计数据
const stats = computed(() => {
  if (records.value.length === 0) return null
  
  const weights = records.value.map(r => r.weight)
  const latest = records.value[records.value.length - 1]
  const first = records.value[0]
  
  return {
    current: latest.weight,
    change: (latest.weight - first.weight).toFixed(1),
    min: Math.min(...weights),
    max: Math.max(...weights),
    avg: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1),
    totalCalories: records.value.reduce((sum, r) => sum + r.calories, 0),
    totalRope: records.value.reduce((sum, r) => sum + r.rope, 0)
  }
})
</script>

# 体重记录

<div class="weight-tracker">
  <!-- 统计卡片 -->
  <div class="stats-grid" v-if="stats">
    <div class="stat-card">
      <div class="stat-label">当前体重</div>
      <div class="stat-value">{{ stats.current }} kg</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">体重变化</div>
      <div class="stat-value" :class="stats.change < 0 ? 'positive' : 'negative'">
        {{ stats.change > 0 ? '+' : '' }}{{ stats.change }} kg
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-label">最低体重</div>
      <div class="stat-value">{{ stats.min }} kg</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">平均体重</div>
      <div class="stat-value">{{ stats.avg }} kg</div>
    </div>
  </div>

  <!-- 指标切换 -->
  <div class="metric-selector">
    <span class="selector-label">对比指标：</span>
    <button 
      v-for="metric in metrics" 
      :key="metric.value"
      @click="changeMetric(metric.value)"
      :class="['metric-btn', { active: selectedMetric === metric.value }]"
      :style="{ '--metric-color': metric.color }"
    >
      {{ metric.label }}
    </button>
  </div>

  <!-- 图表 -->
  <div class="chart-container">
    <canvas id="weightChart"></canvas>
  </div>

  <!-- 数据表格 -->
  <div class="data-table">
    <h2>详细记录</h2>
    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>体重 (kg)</th>
          <th>消耗卡路里 (kcal)</th>
          <th>跳绳个数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records.slice().reverse()" :key="record.date">
          <td>{{ record.date }}</td>
          <td>{{ record.weight }}</td>
          <td>{{ record.calories }}</td>
          <td>{{ record.rope }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 累计统计 -->
  <div class="total-stats" v-if="stats">
    <h2>累计统计</h2>
    <div class="total-grid">
      <div class="total-item">
        <span class="total-icon">🔥</span>
        <div>
          <div class="total-label">总消耗卡路里</div>
          <div class="total-value">{{ stats.totalCalories }} kcal</div>
        </div>
      </div>
      <div class="total-item">
        <span class="total-icon">🏃</span>
        <div>
          <div class="total-label">总跳绳次数</div>
          <div class="total-value">{{ stats.totalRope.toLocaleString() }} 个</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.weight-tracker {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stat-value.positive {
  color: #10b981;
}

.stat-value.negative {
  color: #ef4444;
}

.metric-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.selector-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.metric-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
}

.metric-btn:hover {
  border-color: var(--metric-color);
  background: var(--vp-c-bg-soft);
}

.metric-btn.active {
  border-color: var(--metric-color);
  background: var(--metric-color);
  color: white;
}

.chart-container {
  height: 400px;
  margin-bottom: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
}

.data-table h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.data-table th {
  background: var(--vp-c-bg-mute);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.data-table td {
  color: var(--vp-c-text-2);
}

.data-table tbody tr:hover {
  background: var(--vp-c-bg-mute);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.total-stats {
  margin-top: 2rem;
}

.total-stats h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.total-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.total-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
}

.total-icon {
  font-size: 2rem;
}

.total-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.25rem;
}

.total-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-container {
    height: 300px;
  }
  
  .data-table {
    overflow-x: auto;
  }
  
  .total-grid {
    grid-template-columns: 1fr;
  }
}
</style>
