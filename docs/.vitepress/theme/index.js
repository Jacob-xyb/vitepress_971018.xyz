import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ThemeIcon from './components/ThemeIcon.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ThemeIcon', ThemeIcon)
  }
}
