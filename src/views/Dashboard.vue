<template>
  <div class="dashboard">
    <!-- 背景图：最底层 -->
    <div class="dashboard-bg"></div>
    <!-- 底图：地图层 -->
    <div class="map-base">
      <MapCenter />
    </div>
    <!-- 前景内容：覆盖在底图之上，中间区域不阻挡鼠标，方便操作地图 -->
    <div class="dashboard-overlay">
      <div class="overlay-block">
        <Header />
      </div>
      <main class="content">
        <div class="overlay-block">
          <LeftPanel />
        </div>
        <div class="center-space"></div>
        <div class="overlay-block">
          <RightPanel />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header/index.vue'
import LeftPanel from '@/components/LeftPanel/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
// import MapCenter from '@/components/MapCenter/index.vue'
import MapCenter from '@/components/MapCenter/indexThree.vue'
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
  z-index: 0; /* 最底层 */
  background-image:
    url('@/assets/images/background.png'),
    linear-gradient(rgba(4, 11, 21, 0.18), rgba(4, 11, 21, 0.18)),
    url('@/assets/images/bg.png');
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
</style>
