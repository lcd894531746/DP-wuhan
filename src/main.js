import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
// import autofit from 'autofit.js'

// autofit.js 大屏适配 - 需在 mount 前初始化，确保首帧布局正确
// autofit.init({
//   designHeight: 1080,
//   designWidth: 1920,
//   el: '#app',
//   mode: 'fit',
//   resize: true,
// })

const app = createApp(App)
app.mount('#app')
