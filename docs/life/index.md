# 生活记录

::: info
记录生活中的点点滴滴，追踪个人成长和健康数据。
:::

## 📊 数据追踪

<div class="nav-cards">
  <a href="/life/weight-tracker" class="nav-card">
    <span class="nav-icon">⚖️</span>
    <div class="nav-content">
      <h3>体重记录</h3>
      <p>追踪体重变化和运动数据</p>
    </div>
  </a>
  <a href="/life/exercise-plan" class="nav-card">
    <span class="nav-icon">💪</span>
    <div class="nav-content">
      <h3>锻炼计划</h3>
      <p>无分化训练计划与动作演示</p>
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
