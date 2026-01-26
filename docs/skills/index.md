# Web开发

::: info
这里记录Web开发相关的知识和工具
:::

## 内容导航

<div class="nav-cards">
  <a href="/skills/markdown/" class="nav-card">
    <span class="nav-icon">
      <ThemeIcon icon="markdown" size="48px" alt="Markdown" />
    </span>
    <div class="nav-content">
      <h3>Markdown</h3>
      <p>轻量级标记语言</p>
    </div>
  </a>
</div>

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

.nav-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
</style>
