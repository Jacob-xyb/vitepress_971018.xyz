<template>
  <!-- 本地图片：没填颜色直接显示原图，有颜色才用 mask 染色 -->
  <span
    v-if="isLocalIcon"
    class="theme-icon-wrapper"
    :style="iconWrapperStyle"
  >
    <img
      v-if="!hasColorConfig"
      :src="props.icon"
      :alt="alt"
      :style="{ width, height }"
      class="theme-icon-img"
    />
    <span v-else class="theme-icon-mask" />
  </span>
  <!-- Simple Icons 使用 img -->
  <img
    v-else
    :src="finalIconUrl"
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
  // 或本地 SVG 图片路径（如 '/icon/cmd.svg'）
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
  lightColor: {
    type: String,
    default: undefined
  },
  // 深色模式颜色（支持 #ffffff 或 ffffff 格式）
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

// 判断是否为本地图片路径
const isLocalIcon = computed(() => {
  return props.icon.startsWith('/') || props.icon.startsWith('http')
})

// 是否有颜色配置
const hasColorConfig = computed(() => {
  return props.color || props.lightColor || props.darkColor
})

/**
 * 处理颜色格式：保留 # 号（用于 CSS）
 */
const preserveColor = (color) => {
  return color?.startsWith('#') ? color : `#${color}`
}

/**
 * 计算颜色
 */
const currentColor = computed(() => {
  if (isDark.value) {
    return preserveColor(props.darkColor ?? props.color ?? PROP_DEFAULTS.darkColor)
  } else {
    return preserveColor(props.lightColor ?? props.color ?? PROP_DEFAULTS.lightColor)
  }
})

// 本地图片使用 mask 方式染色（仅当有颜色配置时）
const iconWrapperStyle = computed(() => {
  const style = {
    width: props.size,
    height: props.size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  if (hasColorConfig.value) {
    // 有颜色配置：用 mask 染色
    style.backgroundColor = currentColor.value
    style['-webkit-mask-image'] = `url(${props.icon})`
    style['mask-image'] = `url(${props.icon})`
    style['-webkit-mask-size'] = 'contain'
    style['mask-size'] = 'contain'
    style['-webkit-mask-position'] = 'center'
    style['mask-position'] = 'center'
    style['-webkit-mask-repeat'] = 'no-repeat'
    style['mask-repeat'] = 'no-repeat'
  }

  return style
})

/**
 * 处理颜色格式：去掉开头的 # 号
 */
const normalizeColor = (color) => {
  return color?.replace(/^#/, '')
}

/**
 * 根据当前主题动态生成图标 URL
 */
const finalIconUrl = computed(() => {
  let color
  if (isDark.value) {
    color = normalizeColor(props.darkColor ?? props.color ?? PROP_DEFAULTS.darkColor)
  } else {
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

.theme-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.theme-icon-mask {
  width: 100%;
  height: 100%;
}
</style>
