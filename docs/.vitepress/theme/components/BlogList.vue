<script setup>
import { data as posts } from '../../../blogs/posts.data.js'
</script>

<template>
  <div class="blog-list">
    <div v-if="posts.length === 0" class="blog-empty">
      <p>暂无博客文章</p>
    </div>
    <div v-else class="blog-items">
      <a
        v-for="post in posts"
        :key="post.url"
        :href="encodeURI(post.url)"
        class="blog-item"
      >
        <div class="blog-item-content">
          <h3 class="blog-title">{{ post.title }}</h3>
          <p v-if="post.description" class="blog-desc">{{ post.description }}</p>
        </div>
        <span v-if="post.date" class="blog-date">{{ post.date }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.blog-list {
  margin-top: 1rem;
}

.blog-empty {
  color: var(--vp-c-text-2);
  text-align: center;
  padding: 2rem 0;
}

.blog-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.blog-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, background-color 0.2s;
}

.blog-item:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.blog-item-content {
  flex: 1;
  min-width: 0;
}

.blog-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blog-desc {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blog-date {
  flex-shrink: 0;
  margin-left: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}
</style>
