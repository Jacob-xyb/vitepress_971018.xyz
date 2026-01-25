# Web开发

::: info
这里记录Web开发相关的知识和工具
:::

## 内容导航

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: '🚀',
    name: 'Vitepress',
    title: '前端框架 - 生成静态网页',
    links: [
      { icon: 'github', link: '/web/vitepress/' }
    ]
  },
  {
    avatar: '📦',
    name: 'npm',
    title: '基础',
    links: [
      { icon: 'github', link: '/web/npm/' }
    ]
  }
]
</script>

<VPTeamMembers size="small" :members="members" />
