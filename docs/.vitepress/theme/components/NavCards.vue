<template>
  <div class="nav-cards">
    <a 
      v-for="item in items" 
      :key="item.id" 
      :href="item.link" 
      class="nav-card"
    >
      <span class="nav-icon" v-if="item.icon">
        <ThemeIcon 
          v-if="item.icon.startsWith('/') || item.icon.includes('.')" 
          :icon="item.icon" 
          :size="iconSize" 
          :alt="item.title" 
        />
        <span v-else>{{ item.icon }}</span>
      </span>
      <div class="nav-content">
        <h3>{{ item.title }}</h3>
        <p v-if="item.desc">{{ item.desc }}</p>
        <div class="nav-tags" v-if="item.tags && item.tags.length > 0">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup>
import ThemeIcon from './ThemeIcon.vue'

defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  iconSize: {
    type: String,
    default: '48px'
  }
})
</script>

<style scoped>
.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-content {
  flex: 1;
}

.nav-content h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.nav-content p {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.nav-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border-radius: 4px;
}
</style>
