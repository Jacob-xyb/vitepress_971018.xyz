---
title: 体重记录
pageClass: wide-page
outline: false
---

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import weightData from './weight-data.js'

// 将数组数据转换为对象格式
const records = ref(
  weightData.data.map(row => ({
    date: row[0],
    weight: row[1],
    calories: row[2],
    rope: row[3],
    hasExercise: row[2] !== null || row[3] !== null, // 体重线：两者都没有才算无锻炼
    hasCalories: row[2] !== null,                    // 红线：calories 有值就实心
    hasRope: row[3] !== null                         // 绿线：rope 有值就实心
  }))
)

// 当前选择的指标
const selectedMetric = ref('calories')

// 指标选项
const metrics = [
  { value: 'calories', label: '消耗卡路里 (kcal)', color: '#ef4444' },
  { value: 'rope', label: '跳绳个数', color: '#10b981' }
]

// ECharts 实例
let chart = null

// 切换指标
function changeMetric(metric) {
  selectedMetric.value = metric
  if (chart) chart.setOption(buildOption(), true)
}

// 构建 ECharts 配置
function buildOption() {
  const currentMetric = metrics.find(m => m.value === selectedMetric.value)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return {
    backgroundColor: 'transparent',
    legend: {
      top: 10,
      data: ['体重 (kg)', currentMetric.label],
      textStyle: { color: isMobile ? '#9ca3af' : '#d1d5db' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    grid: {
      left: 60,
      right: 60,
      top: 50,
      bottom: 80
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value) => {
          const d = new Date(value)
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        },
        hideOverlap: true
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '体重 (kg)',
        position: 'left',
        nameTextStyle: { color: '#8b5cf6' },
        // 自适应数据范围（不再从 0 起），让波动更清晰
        scale: true,
        // 左轴：保留网格线，但调淡、用虚线，不抢戏
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.15)',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: currentMetric.label,
        position: 'right',
        nameTextStyle: { color: currentMetric.color },
        // 右轴同样自适应数据范围
        scale: true,
        // 右轴：不画网格线，避免和左轴交错成一团
        splitLine: { show: false }
      }
    ],
    // 关键：dataZoom 让 y 轴和图例固定，只拖曲线
    dataZoom: [
      {
        type: 'slider',       // 底部滑块
        xAxisIndex: 0,
        bottom: 10,
        height: 30,
        start: 0,
        end: 100
      },
      {
        type: 'inside',        // 鼠标滚轮缩放 + 拖动平移
        xAxisIndex: 0
      }
    ],
    series: [
      {
        name: '体重 (kg)',
        type: 'line',
        data: records.value.map(r => [r.date, r.weight]),
        yAxisIndex: 0,
        smooth: 0.4,
        symbolSize: 7,
        // 每个点的颜色：实心=紫，空心=白圆
        itemStyle: {
          color: (params) => records.value[params.dataIndex].hasExercise ? '#8b5cf6' : '#ffffff',
          borderColor: '#8b5cf6',
          borderWidth: (params) => records.value[params.dataIndex].hasExercise ? 0 : 2
        },
        lineStyle: { color: '#8b5cf6', width: 2 },
        areaStyle: { color: 'rgba(139, 92, 246, 0.1)' }
      },
      {
        name: currentMetric.label,
        type: 'line',
        data: records.value.map(r => [
          r.date,
          r[selectedMetric.value] === null ? null : r[selectedMetric.value]
        ]),
        yAxisIndex: 1,
        smooth: 0.4,
        symbolSize: 7,
        connectNulls: true, // 跨过 null 连线
        // 每个点的颜色：实心=当前指标色，空心=白圆
        itemStyle: {
          color: (params) => records.value[params.dataIndex][selectedMetric.value] !== null ? currentMetric.color : '#ffffff',
          borderColor: currentMetric.color,
          borderWidth: (params) => records.value[params.dataIndex][selectedMetric.value] !== null ? 0 : 2
        },
        lineStyle: { color: currentMetric.color, width: 2 }
      }
    ]
  }
}

// 初始化图表
onMounted(() => {
  if (typeof window === 'undefined') return
  const el = document.getElementById('weightChart')
  if (!el) return
  chart = echarts.init(el)
  chart.setOption(buildOption())
  // 窗口缩放时重排
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
  if (chart) {
    chart.dispose()
    chart = null
  }
})

function handleResize() {
  if (chart) chart.resize()
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
    totalCalories: records.value.reduce((sum, r) => sum + (r.calories || 0), 0),
    totalRope: records.value.reduce((sum, r) => sum + (r.rope || 0), 0),
    exerciseDays: records.value.filter(r => r.hasExercise).length,
    totalDays: records.value.length
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

  <!-- ECharts 图表：dataZoom 内置滑块，y 轴和图例固定，只拖曲线 -->
  <div id="weightChart" class="chart-container"></div>

  <!-- 数据表格 -->
  <div class="data-table">
    <h2>详细记录</h2>
    <div class="legend">
      <span class="legend-item">
        <span class="legend-dot" style="background: #8b5cf6;"></span>
        有锻炼
      </span>
      <span class="legend-item">
        <span class="legend-dot" style="background: #ffffff; border: 2px solid #8b5cf6;"></span>
        无锻炼 ⚠️
      </span>
    </div>
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
          <td>
            <span :style="{ color: record.hasExercise ? 'inherit' : '#ef4444' }">
              {{ record.weight }}
              <span v-if="!record.hasExercise" style="font-size: 0.75rem; margin-left: 4px;">⚠️</span>
            </span>
          </td>
          <td>{{ record.calories === null ? '-' : record.calories }}</td>
          <td>{{ record.rope === null ? '-' : record.rope }}</td>
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
      <div class="total-item">
        <span class="total-icon">📅</span>
        <div>
          <div class="total-label">锻炼天数</div>
          <div class="total-value">{{ stats.exerciseDays }} / {{ stats.totalDays }} 天</div>
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

/* 图表容器：固定宽度，dataZoom 滑块内置在图表里 */
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}

@media (min-width: 1400px) {
  .chart-container {
    height: 500px;
  }
}

.data-table h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.legend {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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
  display: inline-block;
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
  
  .data-table {
    overflow-x: auto;
  }
  
  .total-grid {
    grid-template-columns: 1fr;
  }
}
</style>
