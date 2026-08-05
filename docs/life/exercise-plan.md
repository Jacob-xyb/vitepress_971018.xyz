---
title: 锻炼计划
pageClass: wide-page
outline: [2, 3]
---

<script setup>
import { reactive } from 'vue'
import { exercisePhases } from './exercise-data.js'

// 姿势翻面状态：key = 动作名，val = 是否已翻到背面（默认正面 = false）
const flipStates = reactive({})

function toggleFlip(name) {
  flipStates[name] = !flipStates[name]
}

// 把每个 phase 标准化成 entries 数组（统一渲染逻辑）：
//   - phase.days 存在 → 直接返回 days
//   - phase.items 存在 → 包成单个无 label 的 entry（不分天，常驻章节）
//   - 都没有 → 空数组
function getEntries(phase) {
  if (phase.days) return phase.days
  if (phase.items) return [{ label: '', items: phase.items }]
  return []
}
</script>

<template v-for="(phase, idx) in exercisePhases" :key="phase.phase + '_' + idx">
<div class="phase-block">

## {{ phase.phase }}

<div v-if="phase.startDate || phase.description" class="phase-meta">
  <span v-if="phase.startDate">📅 {{ phase.startDate }} 起</span>
  <span v-if="phase.startDate && phase.description"> ｜ </span>
  <span v-if="phase.description">{{ phase.description }}</span>
</div>

<template v-for="(entry, eIdx) in getEntries(phase)" :key="entry.label || 'entry_' + eIdx">

<h3 v-if="entry.label">{{ entry.label }}<span v-if="entry.note" class="day-note">{{ entry.note }}</span></h3>

<div v-if="entry.items && entry.items.length" class="exercise-grid">
  <div v-for="item in entry.items" :key="item.name + (item.variants && item.variants.some(v => v.gif) ? '_m' : '_s')">
    <div v-if="item.variants && item.variants.some(v => v.gif)"
         class="exercise-card posture-flip-card"
         :class="{ 'is-flipped': !!flipStates[item.name] }"
         @click="toggleFlip(item.name)">
      <div class="flip-inner">
        <div class="flip-face flip-front">
          <img
            v-if="item.variants[0].gif"
            :src="item.variants[0].gif"
            :alt="item.name"
            loading="lazy"
            class="exercise-gif"
          />
          <div v-else class="exercise-placeholder">
            <span>{{ item.name.charAt(0) }}</span>
          </div>
          <div class="exercise-info">
            <div class="exercise-name">{{ item.name }}</div>
            <div class="exercise-reps">{{ item.variants[0].reps }}<span v-if="item.variants[0].weight" class="weight"> @ {{ item.variants[0].weight }}</span></div>
          </div>
        </div>
        <div class="flip-face flip-back">
          <img
            v-if="item.variants[1].gif"
            :src="item.variants[1].gif"
            :alt="item.name"
            loading="lazy"
            class="exercise-gif"
          />
          <div v-else class="exercise-placeholder">
            <span>{{ item.name.charAt(0) }}</span>
          </div>
          <div class="exercise-info">
            <div class="exercise-name">{{ item.name }}</div>
            <div class="exercise-reps">{{ item.variants[1].reps }}<span v-if="item.variants[1].weight" class="weight"> @ {{ item.variants[1].weight }}</span></div>
          </div>
        </div>
      </div>
      <div class="flip-hint">
        <span :class="['scene', { active: !flipStates[item.name] }]">{{ item.variants[0].scene }}</span>
        <span class="icon">↻</span>
        <span :class="['scene', { active: flipStates[item.name] }]">{{ item.variants[1].scene }}</span>
      </div>
    </div>
    <div v-else class="exercise-card">
      <img
        v-if="item.gif"
        :src="item.gif"
        :alt="item.name"
        loading="lazy"
        class="exercise-gif"
      />
      <div v-else class="exercise-placeholder">
        <span>{{ item.name.charAt(0) }}</span>
      </div>
      <div class="exercise-info">
        <div class="exercise-name">{{ item.name }}</div>
        <div class="exercise-detail">
          <ul v-if="item.variants" class="variant-list">
            <li v-for="(v, idx) in item.variants" :key="v.scene" class="variant-item">
              <span :class="['scene-badge', `variant-pos-${idx}`]">{{ v.scene }}</span>
              <span class="reps">{{ v.reps }}</span>
              <span v-if="v.weight" class="weight">@ {{ v.weight }}</span>
            </li>
          </ul>
          <div v-else class="exercise-reps">{{ item.reps }}<span v-if="item.weight" class="weight"> @ {{ item.weight }}</span></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div v-else class="rest-day">💤 休息日</div>

</template>

</div>
</template>

<style scoped>
.exercise-plan-page {
  max-width: 1200px;
  margin: 0 auto;
}

.phase-meta {
  display: inline-block;
  margin: -0.5rem 0 2rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.day-note {
  margin-left: 0.6rem;
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
}

/* 卡片网格：自动填充列，最小 220px，移动端单列 */
.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin: 1rem 0 2rem;
}

/* 姿势翻面卡：整张卡可点击，正反两面以 rotateY 切换。
   仅作用于带有 variants 且至少一个 variant 有 GIF 的动作（如蝴蝶机正常/平行）。 */
.posture-flip-card {
  position: relative;
  cursor: pointer;
  user-select: none;
}

/* 禁用 hover lift，避免 transform 与下方 3D 旋转冲突；只保留阴影 */
.posture-flip-card:hover {
  transform: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* 位置颜色边条：左 variant[0] 绿、右 variant[1] 紫。
   透明度跟随 flip 状态切换：高亮=当前面，弱化=背面提示。 */
.posture-flip-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #10b981;
  z-index: 3;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.6s ease;
}

.posture-flip-card.is-flipped::before {
  opacity: 0.2;
}

.posture-flip-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: #8b5cf6;
  z-index: 3;
  pointer-events: none;
  opacity: 0.2;
  transition: opacity 0.6s ease;
}

.posture-flip-card.is-flipped::after {
  opacity: 1;
}

/* 旋转容器：宽度撑满，3D 空间开启，子元素两面均按 Y 轴旋转 */
.flip-inner {
  position: relative;
  width: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.posture-flip-card.is-flipped .flip-inner {
  transform: rotateY(180deg);
}

/* 共用：两面都要隐藏背面（背面转到正面时不可见） */
.flip-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 背面：绝对定位覆盖在正面之上，预旋转 180° 朝向用户 */
.flip-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
}

/* 翻面提示徽章：固定在右上角，不随面旋转，始终展示当前/另一姿势 */
.flip-hint {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: none;
}

.flip-hint .scene {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.flip-hint .scene.active {
  opacity: 1;
}

.flip-hint .icon {
  font-size: 0.85rem;
  opacity: 0.85;
}

.exercise-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.exercise-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* GIF 图：1:1 方形，自动循环（GIF 本身是动画） */
.exercise-gif {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: var(--vp-c-bg-mute);
}

/* GIF 缺失时的占位块：灰色背景 + 动作名首字，与 GIF 同比例避免布局抖动 */
.exercise-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  font-size: 3rem;
  font-weight: 600;
  user-select: none;
}

.exercise-info {
  padding: 0.75rem 1rem;
}

.exercise-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.4rem;
}

/* 旧结构兼容：reps 字符串 */
.exercise-reps {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

/* 新结构：多场景变体列表 */
.variant-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.variant-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

/* 场景徽章：圆角小标签，颜色按场景区分 */
.scene-badge {
  display: inline-block;
  min-width: 3.2em;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

/* 位置颜色：第 1 个 variant 绿色，第 2 个紫色，与 scene 名无关。
   这样以后随便改 scene 字段也不用动 CSS。 */
.scene-badge.variant-pos-0 {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}

.scene-badge.variant-pos-1 {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
  border-color: rgba(139, 92, 246, 0.3);
}

.reps {
  color: var(--vp-c-text-1);
}

.weight {
  color: var(--vp-c-text-2);
  font-weight: 600;
}

/* 休息日块 */
.rest-day {
  margin: 1rem 0 2rem;
  padding: 2.5rem 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .exercise-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }
  .exercise-placeholder {
    font-size: 2.2rem;
  }
}
</style>