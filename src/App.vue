<template>
  <Dashboard />
</template>

<script setup>
import Dashboard from '@/views/Dashboard.vue'
import { onMounted } from 'vue'
import autofitResponsive from './autofit.js'

const initAutofit = () => {
  // 初始化响应式自适应，基于1920x1080设计稿
  autofitResponsive({
    dw: 1920, // 设计稿宽度
    dh: 1080, // 设计稿高度
    el: '#app', // 渲染的dom
    mode: 'fit', // 'fit' 等比例适配保持比例, 'fill' 填满屏幕可能变形
    resize: true, // 是否监听resize事件
  })
}

onMounted(() => {
  initAutofit()
})
</script>
