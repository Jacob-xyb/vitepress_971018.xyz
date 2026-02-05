import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './markdown.css'
import ThemeIcon from './components/ThemeIcon.vue'
import NavLinks from './components/NavLinks.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ThemeIcon', ThemeIcon)
    app.component('NavLinks', NavLinks)
  }
}
