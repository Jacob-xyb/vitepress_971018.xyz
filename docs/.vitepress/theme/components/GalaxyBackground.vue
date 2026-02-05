<template>
  <div class="galaxy-container">
    <canvas ref="canvas" class="galaxy-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animationId = null
let particles = []
let twinkleStars = [] // 闪烁的十字星

// 粒子类
class Particle {
  constructor(angle, distance, size, color, alpha, speed) {
    this.angle = angle
    this.distance = distance
    this.size = size
    this.color = color
    this.alpha = alpha
    this.baseAlpha = alpha
    this.speed = speed
    this.twinkle = Math.random() * Math.PI * 2
    this.twinkleSpeed = Math.random() * 0.02 + 0.01
  }

  update() {
    // 旋转
    this.angle += this.speed
    
    // 闪烁效果
    this.twinkle += this.twinkleSpeed
    this.alpha = this.baseAlpha * (0.7 + Math.sin(this.twinkle) * 0.3)
  }

  draw(centerX, centerY, stretchX, stretchY, tiltAngle) {
    // 计算位置（螺旋臂）
    const spiralAngle = this.angle + this.distance * 0.002
    let x = Math.cos(spiralAngle) * this.distance
    let y = Math.sin(spiralAngle) * this.distance
    
    // 应用拉伸
    x *= stretchX
    y *= stretchY
    
    // 应用倾斜
    const rotatedX = x * Math.cos(tiltAngle) - y * Math.sin(tiltAngle)
    const rotatedY = x * Math.sin(tiltAngle) + y * Math.cos(tiltAngle)
    
    const finalX = centerX + rotatedX
    const finalY = centerY + rotatedY
    
    // 绘制粒子
    const gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, this.size * 2)
    gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`)
    gradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.5})`)
    gradient.addColorStop(1, `rgba(${this.color}, 0)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(finalX, finalY, this.size * 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 闪烁十字星类
class TwinkleStar {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 3 + 2
    this.alpha = 0
    this.phase = 0 // 0: 淡入, 1: 保持, 2: 淡出, 3: 消失
    this.phaseTime = 0
    this.fadeInDuration = 30 + Math.random() * 30
    this.holdDuration = 20 + Math.random() * 40
    this.fadeOutDuration = 30 + Math.random() * 30
  }

  update() {
    this.phaseTime++
    
    if (this.phase === 0) {
      // 淡入
      this.alpha = this.phaseTime / this.fadeInDuration
      if (this.phaseTime >= this.fadeInDuration) {
        this.phase = 1
        this.phaseTime = 0
      }
    } else if (this.phase === 1) {
      // 保持
      this.alpha = 1
      if (this.phaseTime >= this.holdDuration) {
        this.phase = 2
        this.phaseTime = 0
      }
    } else if (this.phase === 2) {
      // 淡出
      this.alpha = 1 - (this.phaseTime / this.fadeOutDuration)
      if (this.phaseTime >= this.fadeOutDuration) {
        this.phase = 3
      }
    }
  }

  draw() {
    if (this.phase === 3) return
    
    ctx.save()
    ctx.globalAlpha = this.alpha * 0.8
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
    ctx.lineWidth = 1
    
    // 绘制菱形十字星
    ctx.beginPath()
    // 垂直线
    ctx.moveTo(this.x, this.y - this.size)
    ctx.lineTo(this.x, this.y + this.size)
    // 水平线
    ctx.moveTo(this.x - this.size, this.y)
    ctx.lineTo(this.x + this.size, this.y)
    ctx.stroke()
    
    // 绘制中心亮点
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }

  isDead() {
    return this.phase === 3
  }
}

function initGalaxy() {
  particles = []
  twinkleStars = []
  
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  // 使用对角线的一半作为基准距离
  const diagonal = Math.sqrt(canvas.value.width * canvas.value.width + canvas.value.height * canvas.value.height)
  const maxDistance = diagonal * 0.35 // 对角线的 35% 作为主体
  
  // 创建多层螺旋臂 - 2/3 的粒子
  const armCount = 3 // 3条螺旋臂
  const particlesPerArm = 320 // 增加密度
  
  for (let arm = 0; arm < armCount; arm++) {
    const armAngleOffset = (Math.PI * 2 / armCount) * arm
    
    for (let i = 0; i < particlesPerArm; i++) {
      const t = i / particlesPerArm
      const distance = t * maxDistance + Math.random() * 35 // 减少随机偏移，更紧密
      const angle = armAngleOffset + t * Math.PI * 4 + (Math.random() - 0.5) * 0.5
      
      // 根据距离选择颜色，粒子大小混杂
      let color, alpha, size
      const sizeVariation = Math.random() // 用于混杂大小
      
      // 随机亮度分层：1/3 保持原亮度，1/2 亮一些，1/6 最亮
      const brightnessRandom = Math.random()
      let brightnessMultiplier
      if (brightnessRandom < 0.333) {
        brightnessMultiplier = 1.0 // 1/3 保持原亮度
      } else if (brightnessRandom < 0.833) {
        brightnessMultiplier = 1.3 // 1/2 亮一些
      } else {
        brightnessMultiplier = 1.7 // 1/6 最亮
      }
      
      if (t < 0.2) {
        // 核心区域 - 明亮的黄白色，粒子更小
        color = `255, ${240 + Math.random() * 15}, ${200 + Math.random() * 55}`
        alpha = (0.7 + Math.random() * 0.25) * brightnessMultiplier
        alpha = Math.min(alpha, 1) // 限制最大值为 1
        size = sizeVariation < 0.7 ? (0.8 + Math.random() * 0.7) : (0.4 + Math.random() * 0.4) // 放大
      } else if (t < 0.5) {
        // 中间区域 - 蓝白色，中等粒子为主
        color = `${200 + Math.random() * 55}, ${220 + Math.random() * 35}, 255`
        alpha = (0.55 + Math.random() * 0.3) * brightnessMultiplier
        alpha = Math.min(alpha, 1)
        size = sizeVariation < 0.6 ? (0.8 + Math.random() * 0.7) : (0.35 + Math.random() * 0.4) // 放大
      } else if (t < 0.75) {
        // 外围区域 - 粉紫色，小粒子为主
        color = `${220 + Math.random() * 35}, ${150 + Math.random() * 50}, ${230 + Math.random() * 25}`
        alpha = (0.35 + Math.random() * 0.3) * brightnessMultiplier
        alpha = Math.min(alpha, 1)
        size = sizeVariation < 0.5 ? (0.6 + Math.random() * 0.6) : (0.25 + Math.random() * 0.3) // 放大
      } else {
        // 最外层 - 暗淡的蓝紫色，很小的粒子为主
        color = `${100 + Math.random() * 50}, ${120 + Math.random() * 50}, ${180 + Math.random() * 50}`
        alpha = (0.25 + Math.random() * 0.2) * brightnessMultiplier
        alpha = Math.min(alpha, 1)
        size = sizeVariation < 0.4 ? (0.4 + Math.random() * 0.4) : (0.18 + Math.random() * 0.2) // 放大
      }
      
      const speed = (0.0002 + Math.random() * 0.0003) * (1 - t * 0.5) // 加快旋转速度
      
      particles.push(new Particle(angle, distance, size, color, alpha, speed))
    }
  }
  
  // 随机填充椭圆区域 - 1/3 的粒子
  const fillParticles = 400 // 增加填充粒子
  for (let i = 0; i < fillParticles; i++) {
    // 随机角度和距离
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * maxDistance
    
    // 根据距离选择颜色
    const t = distance / maxDistance
    let color, alpha, size
    const sizeVariation = Math.random()
    
    // 随机亮度分层
    const brightnessRandom = Math.random()
    let brightnessMultiplier
    if (brightnessRandom < 0.333) {
      brightnessMultiplier = 1.0
    } else if (brightnessRandom < 0.833) {
      brightnessMultiplier = 1.3
    } else {
      brightnessMultiplier = 1.7
    }
    
    if (t < 0.3) {
      color = `255, ${240 + Math.random() * 15}, ${200 + Math.random() * 55}`
      alpha = (0.55 + Math.random() * 0.25) * brightnessMultiplier
      alpha = Math.min(alpha, 1)
      size = sizeVariation < 0.6 ? (0.7 + Math.random() * 0.5) : (0.35 + Math.random() * 0.35) // 放大
    } else if (t < 0.6) {
      color = `${200 + Math.random() * 55}, ${220 + Math.random() * 35}, 255`
      alpha = (0.4 + Math.random() * 0.3) * brightnessMultiplier
      alpha = Math.min(alpha, 1)
      size = sizeVariation < 0.5 ? (0.6 + Math.random() * 0.5) : (0.3 + Math.random() * 0.3) // 放大
    } else {
      color = `${150 + Math.random() * 70}, ${130 + Math.random() * 70}, ${200 + Math.random() * 55}`
      alpha = (0.23 + Math.random() * 0.25) * brightnessMultiplier
      alpha = Math.min(alpha, 1)
      size = sizeVariation < 0.4 ? (0.45 + Math.random() * 0.45) : (0.22 + Math.random() * 0.25) // 放大
    }
    
    const speed = (Math.random() - 0.5) * 0.0001
    
    particles.push(new Particle(angle, distance, size, color, alpha, speed))
  }
  
  // 添加随机背景星星
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * maxDistance * 1.2
    const color = '255, 255, 255'
    const alpha = Math.random() * 0.4 + 0.1
    const size = Math.random() * 0.35 + 0.15
    const speed = (Math.random() - 0.5) * 0.0001
    
    particles.push(new Particle(angle, distance, size, color, alpha, speed))
  }
  
  // 在 2/3 以内区域添加密集星云
  for (let i = 0; i < 800; i++) { // 大量密集星云粒子
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * maxDistance * 0.67 // 只在 0 到 2/3 距离内
    
    // 星云颜色 - 蓝紫粉色混合，更亮
    const colorChoice = Math.random()
    let color
    if (colorChoice < 0.4) {
      color = `${190 + Math.random() * 50}, ${210 + Math.random() * 40}, 255`
    } else if (colorChoice < 0.7) {
      color = `${230 + Math.random() * 25}, ${170 + Math.random() * 50}, ${240 + Math.random() * 15}`
    } else {
      color = `${210 + Math.random() * 40}, ${190 + Math.random() * 50}, ${245 + Math.random() * 10}`
    }
    
    // 随机亮度分层
    const brightnessRandom = Math.random()
    let brightnessMultiplier
    if (brightnessRandom < 0.333) {
      brightnessMultiplier = 1.0
    } else if (brightnessRandom < 0.833) {
      brightnessMultiplier = 1.3
    } else {
      brightnessMultiplier = 1.7
    }
    
    let alpha = (0.35 + Math.random() * 0.4) * brightnessMultiplier
    alpha = Math.min(alpha, 1)
    const size = 0.4 + Math.random() * 0.5 // 放大
    const speed = (Math.random() - 0.5) * 0.00025 // 加快旋转速度
    
    particles.push(new Particle(angle, distance, size, color, alpha, speed))
  }
  
  // 在 1/3 处形成高度密集的不规则椭圆环
  const ringDistance = maxDistance * 0.33 // 1/3 位置
  for (let i = 0; i < 600; i++) { // 高密度粒子
    const angle = Math.random() * Math.PI * 2
    // 使用高斯分布让粒子在 1/3 位置附近聚集，形成平滑过渡，缩小宽度
    const gaussianOffset = (Math.random() + Math.random() + Math.random() - 1.5) * maxDistance * 0.05 // 从 0.08 减小到 0.05
    const distance = ringDistance + gaussianOffset
    
    // 减少不规则性 - 更小的角度偏移
    const irregularity = (Math.random() - 0.5) * 0.1
    
    // 明亮的星云颜色
    const colorChoice = Math.random()
    let color
    if (colorChoice < 0.35) {
      color = `${200 + Math.random() * 55}, ${220 + Math.random() * 35}, 255` // 蓝白
    } else if (colorChoice < 0.65) {
      color = `${235 + Math.random() * 20}, ${180 + Math.random() * 50}, ${245 + Math.random() * 10}` // 粉紫
    } else {
      color = `${220 + Math.random() * 35}, ${200 + Math.random() * 40}, ${250 + Math.random() * 5}` // 淡紫
    }
    
    // 随机亮度分层
    const brightnessRandom = Math.random()
    let brightnessMultiplier
    if (brightnessRandom < 0.333) {
      brightnessMultiplier = 1.0
    } else if (brightnessRandom < 0.833) {
      brightnessMultiplier = 1.3
    } else {
      brightnessMultiplier = 1.7
    }
    
    let alpha = (0.4 + Math.random() * 0.4) * brightnessMultiplier
    alpha = Math.min(alpha, 1)
    const size = 0.45 + Math.random() * 0.6 // 放大
    const speed = (Math.random() - 0.5) * 0.0003 // 加快旋转速度
    
    particles.push(new Particle(angle + irregularity, distance, size, color, alpha, speed))
  }
  
  // 添加外围扩散的极小粒子 - 延伸到对角线边缘
  for (let arm = 0; arm < armCount; arm++) {
    const armAngleOffset = (Math.PI * 2 / armCount) * arm
    
    for (let i = 0; i < 500; i++) { // 增加外围扩散粒子数量
      const t = 0.7 + Math.random() * 1.3 // 扩大范围到 70%-200%，覆盖到对角线
      const distance = t * maxDistance + Math.random() * 80
      const angle = armAngleOffset + t * Math.PI * 4 + (Math.random() - 0.5) * 1.5 // 更大的角度偏移，形成不规则
      
      // 极小的暗淡粒子，越远越小越暗
      const fadeFactor = Math.max(0, 1 - (t - 0.7) / 1.3) // 距离越远越暗
      const color = `${80 + Math.random() * 60}, ${100 + Math.random() * 60}, ${160 + Math.random() * 60}`
      const alpha = (0.05 + Math.random() * 0.12) * fadeFactor
      const size = (0.06 + Math.random() * 0.12) * (0.3 + fadeFactor * 0.7) // 越远越小
      const speed = (Math.random() * 0.00008) * (1 - t * 0.3)
      
      particles.push(new Particle(angle, distance, size, color, alpha, speed))
    }
  }
}

function animate() {
  // 清除画布 - 透明背景
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  
  // 恢复固定的拉伸比例 - 短轴更短
  const stretchX = 1.8
  const stretchY = 0.5 // 从 0.6 减小到 0.5
  const tiltAngle = -0.25
  
  // 绘制中心很小的明亮核心
  const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 6)
  coreGradient.addColorStop(0, 'rgba(255, 245, 230, 0.7)')
  coreGradient.addColorStop(0.5, 'rgba(255, 235, 210, 0.3)')
  coreGradient.addColorStop(1, 'rgba(255, 225, 190, 0)')
  
  ctx.fillStyle = coreGradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
  ctx.fill()
  
  // 更新和绘制粒子
  particles.forEach(particle => {
    particle.update()
    particle.draw(centerX, centerY, stretchX, stretchY, tiltAngle)
  })
  
  // 随机生成新的闪烁十字星（在空白区域）
  if (Math.random() < 0.02) { // 2% 概率每帧生成
    // 随机选择一个位置，避开星系中心区域
    let x, y
    const attempts = 10
    for (let i = 0; i < attempts; i++) {
      x = Math.random() * canvas.value.width
      y = Math.random() * canvas.value.height
      
      // 检查是否在星系主体外（简单判断：距离中心较远的区域）
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxGalaxyDistance = Math.min(canvas.value.width, canvas.value.height) * 0.4
      
      if (distance > maxGalaxyDistance) {
        twinkleStars.push(new TwinkleStar(x, y))
        break
      }
    }
  }
  
  // 更新和绘制闪烁十字星
  twinkleStars = twinkleStars.filter(star => {
    star.update()
    star.draw()
    return !star.isDead()
  })
  
  animationId = requestAnimationFrame(animate)
}

function resizeCanvas() {
  canvas.value.width = canvas.value.offsetWidth
  canvas.value.height = canvas.value.offsetHeight
  initGalaxy()
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  animate()
  
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
/* 银河系背景容器 */
.galaxy-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Canvas 画布 */
.galaxy-canvas {
  width: 100%;
  height: 100%;
  background: transparent;
}

/* 移动端调整 */
@media (max-width: 768px) {
  .galaxy-container {
    display: none;
  }
}
</style>
