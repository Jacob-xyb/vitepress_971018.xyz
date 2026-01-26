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

/**
 * 默认颜色配置
 * 当用户未指定 lightColor/darkColor 且未指定 color 时使用
 */
const PROP_DEFAULTS = {
  lightColor: '#2c3e50',  // 浅色模式默认：深灰
  darkColor: '#e5e7eb'    // 深色模式默认：浅灰
}

const props = defineProps({
  // 图标名称（Simple Icons 的 slug，如 'markdown', 'github', 'vue'）
  icon: {
    type: String,
    required: true
  },
  // 固定颜色（两种主题都使用此颜色，作为 lightColor 和 darkColor 的回退值）
  color: {
    type: String,
    default: undefined
  },
  // 浅色模式颜色（支持 #ffffff 或 ffffff 格式）
  // 优先级：lightColor > color > PROP_DEFAULTS.lightColor
  lightColor: {
    type: String,
    default: undefined
  },
  // 深色模式颜色（支持 #ffffff 或 ffffff 格式）
  // 优先级：darkColor > color > PROP_DEFAULTS.darkColor
  darkColor: {
    type: String,
    default: undefined
  },
  // 图标尺寸（支持 px, rem, em, % 单位）
  size: {
    type: String,
    default: '24px'
  },
  // 图标的 alt 文本（用于无障碍访问）
  alt: {
    type: String,
    default: ''
  }
})

const { isDark } = useData()

/**
 * 处理颜色格式：去掉开头的 # 号
 * Simple Icons CDN 不需要 # 前缀
 */
const normalizeColor = (color) => {
  return color?.replace(/^#/, '')
}

/**
 * 根据当前主题动态生成图标 URL
 * 颜色选择优先级：
 * - 浅色模式：lightColor > color > PROP_DEFAULTS.lightColor
 * - 深色模式：darkColor > color > PROP_DEFAULTS.darkColor
 */
const iconUrl = computed(() => {
  let color
  
  if (isDark.value) {
    // 深色模式
    color = normalizeColor(props.darkColor ?? props.color ?? PROP_DEFAULTS.darkColor)
  } else {
    // 浅色模式
    color = normalizeColor(props.lightColor ?? props.color ?? PROP_DEFAULTS.lightColor)
  }
  
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
