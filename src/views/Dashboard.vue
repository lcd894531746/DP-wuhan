<template>
  <div class="dashboard">
    <!-- 背景图：最底层 -->
    <Transition name="ui-fade">
      <div v-if="uiReady" class="dashboard-bg"></div>
    </Transition>
    <!-- 底图：地图层 -->
    <div class="map-base">
      <MapCenter @ready="onMapReady" />
    </div>
    <!-- 前景内容：覆盖在底图之上，中间区域不阻挡鼠标，方便操作地图 -->
    <div class="dashboard-overlay">
      <Transition name="ui-fade-slide">
        <div v-if="uiReady" class="overlay-block">
          <Header />
        </div>
      </Transition>
      <main class="content">
        <Transition name="ui-fade-slide-left">
          <div v-if="uiReady" class="overlay-block">
            <LeftPanel />
          </div>
        </Transition>
        <div class="center-space"></div>
        <Transition name="ui-fade-slide-right">
          <div v-if="uiReady" class="overlay-block">
            <RightPanel />
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Header from '@/components/Header/index.vue'
import LeftPanel from '@/components/LeftPanel/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
// import MapCenter from '@/components/MapCenter/index.vue'
import MapCenter from '@/components/MapCenter/indexThree.vue'

const uiReady = ref(false)
function onMapReady() {
  uiReady.value = true
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  position: relative;
  color: #c5d4e8;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #040b15;
}

/* 底图层：地图 */
.map-base {
  position: absolute;
  z-index: 1; /* 在背景图之上，在前景面板之下 */
  /* 让 3D 地图只占中间区域，留出四周的装饰背景 */
  top: 10px;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

/* 背景图层：装饰框，在地图之上，透明区域可透出地图，不阻挡鼠标 */
.dashboard-bg {
  position: fixed;
  inset: 0;
  z-index: 999; /* 最底层 */
  background-image:
    url('@/assets/images/background.png');
  background-size:
    100% 100%,
    cover,
    cover;
  background-position:
    center,
    center,
    center;
  background-repeat:
    no-repeat,
    no-repeat,
    no-repeat;
  pointer-events: none;
}

/* 前景层：Header + 左右面板 */
.dashboard-overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* 默认不阻挡，让鼠标事件穿透到地图 */
}

.overlay-block {
  pointer-events: auto; /* 仅 Header、左右面板接收鼠标事件 */
}

.content {
  flex: 1;
  display: flex;
  padding: 0 37px;
  min-height: 0;
}

/* 中间留空：不阻挡鼠标，地图可正常旋转/缩放 */
.center-space {
  flex: 1;
  min-width: 0;
  pointer-events: none;
}

/* 左右面板/头部入场动画（等待地图加载完成后再出现） */
.ui-fade-enter-active {
  transition: opacity 0.8s ease;
}
.ui-fade-enter-from {
  opacity: 0;
}
.ui-fade-slide-enter-active,
.ui-fade-slide-left-enter-active,
.ui-fade-slide-right-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.ui-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.ui-fade-slide-left-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
.ui-fade-slide-right-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
</style>
