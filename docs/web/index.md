# Web开发

::: info
这里记录Web开发相关的知识和工具
:::

## 内容导航

<div class="nav-cards">
  <a href="/web/vitepress/" class="nav-card">
    <span class="nav-icon">
    	<img src="/logo/vitepress-logo.svg" width="48" height="48" alt="vitepress" />
	</span>
    <div class="nav-content">
      <h3>vitepress</h3>
      <p>前端框架 - 生成静态网页</p>
    </div>
  </a>
  <a href="/web/npm/" class="nav-card">
    <span class="nav-icon">
    	<ThemeIcon icon="npm" size="48px" alt="npm" color="#CB3837"/>
	</span>
    <div class="nav-content">
      <h3>npm</h3>
      <p>基础</p>
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
