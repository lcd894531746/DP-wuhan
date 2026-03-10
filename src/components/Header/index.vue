<template>
  <header class="header">
    <div class="header-left">
      <span class="datetime">{{ currentTime }}</span>
    </div>
    <div class="header-center">
      <h1 class="main-title">惟众信息安全质量信息化管理系统</h1>
    </div>
    <div class="search-bar">
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="搜索项目名称或电梯注册码" />
      </div>
      <div class="street-select">
        <select>
          <option>请选择街道名称</option>
        </select>
      </div>
    </div>
    <div class="header-right">
      <div class="weather-icon"></div>
      <div class="temperature">38°C</div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now
    .toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/\//g, '-')
}

let timer
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.header {
  height: 70px;
  position: relative;
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  flex: 1;
}

.datetime {
  font-family: Myriad Pro;
  font-weight: 400;
  font-size: 18px;
  color: #FFFFFF;
  margin-left: 37px;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.main-title {
  font-family: FZCuHeiSongS-B-GB;
  font-weight: 400;
  font-size: 36px;
  color: #FFFFFF;
  line-height: 60px;
  text-shadow: 0px 10px 3px rgba(27,29,31,0.64);
  background: linear-gradient(0deg, #FFFFFF 17.2607421875%, #01BEFC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-bar {
  position: absolute;
  left: 500px;
  top: 95px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 186, 255, 0.1);
  border: 1px solid rgba(0, 186, 255, 0.4);
  border-radius: 4px;
}

.search-icon {
  margin-right: 8px;
  font-size: 16px;
}

.search-input input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  width: 280px;
}

.search-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.street-select select {
  padding: 10px 16px;
  background: rgba(0, 186, 255, 0.1);
  border: 1px solid rgba(0, 186, 255, 0.4);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  outline: none;
}




.header-right {
  width: 120px;
  display: flex;
  align-items: center;
}

.weather-icon {
  width: 24px;
  height: 25px;
  background: url("@/assets/images/icon-29.png") no-repeat center center;
  background-size: 100% 100%;
  margin-right: 17px;
}

.temperature {
  font-family: Myriad Pro;
  font-weight: 400;
  font-size: 24px;
  color: #FFFFFF;
  background: linear-gradient(0deg, #3FA4F6 0%, #F7FDFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
