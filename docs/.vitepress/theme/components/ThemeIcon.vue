<template>
  <img 
    :src="iconUrl" 
    :alt="alt"
    :style="{ width, height }"
    class="theme-icon"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  // 图标名称（Simple Icons 的 slug）
  icon: {
    type: String,
    required: true
  },
  // 浅色模式颜色（不带 #）
  lightColor: {
    type: String,
    default: '2c3e50'  // 深灰
  },
  // 深色模式颜色（不带 #）
  darkColor: {
    type: String,
    default: 'e5e7eb'  // 浅灰
  },
  // 图标尺寸
  size: {
    type: String,
    default: '24px'
  },
  // alt 文本
  alt: {
    type: String,
    default: ''
  }
})

const { isDark } = useData()

// 处理颜色：去掉 # 号
const normalizeColor = (color) => {
  return color.replace(/^#/, '')
}

// 根据主题动态生成图标 URL
const iconUrl = computed(() => {
  const color = isDark.value ? normalizeColor(props.darkColor) : normalizeColor(props.lightColor)
  return `https://cdn.simpleicons.org/${props.icon}/${color}`
})

const width = computed(() => props.size)
const height = computed(() => props.size)
</script>

<style scoped>
.theme-icon {
  object-fit: contain;
  vertical-align: middle;
}
</style>
