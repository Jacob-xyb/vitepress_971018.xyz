import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './markdown.css'
import ThemeIcon from './components/ThemeIcon.vue'
import GalaxyBackground from './components/GalaxyBackground.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在主页 hero 的 image 位置插入银河系背景
      'home-hero-image': () => h(GalaxyBackground)
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ThemeIcon', ThemeIcon)
  }
}
