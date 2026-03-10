<template>
  <div class="map-center" ref="mapContainerRef">
    <Transition name="loader-fade">
      <div v-if="!mapReady" class="loader-overlay">
        <div class="loader-spinner"></div>
        <div class="loader-text">地图加载中...</div>
      </div>
    </Transition>
    <Transition name="map-fade">
      <div v-show="mapReady" class="echarts-stage">
        <div class="echarts-overlay" ref="echartsRef"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
// 注意：wuhan_geo.json 放在 src 目录下
import wuhanGeo from "@/wuhan_geo.json";

const mapContainerRef = ref(null);
const echartsRef = ref(null);
const mapReady = ref(false);

let chart = null;
let resizeObserver = null;
let resizeTimer = null;

const center = [114.3055, 30.5928];
const hubs = [
  { name: "江汉区", coord: [114.2707, 30.601], value: 78 },
  { name: "武昌区", coord: [114.3162, 30.5538], value: 86 },
  { name: "汉阳区", coord: [114.2658, 30.5492], value: 66 },
  { name: "洪山区", coord: [114.3435, 30.5048], value: 90 },
  { name: "青山区", coord: [114.3974, 30.6391], value: 58 },
  { name: "东西湖区", coord: [114.137, 30.622], value: 54 },
  { name: "江夏区", coord: [114.313, 30.3473], value: 63 },
  { name: "黄陂区", coord: [114.3742, 30.874], value: 48 },
  { name: "蔡甸区", coord: [114.0292, 30.582], value: 42 },
  { name: "新洲区", coord: [114.8002, 30.8421], value: 45 },
];

const barData = hubs.map((item) => [...item.coord, item.value]);
const lineData = hubs.map((item) => ({
  coords: [
    [...center, 10],
    [...item.coord, 20 + item.value * 0.3],
  ],
}));

function initChart() {
  if (!echartsRef.value) return;

  chart = echarts.init(echartsRef.value);

  try {
    echarts.registerMap("wuhan", wuhanGeo);
    chart.setOption({
      // 整个 canvas 背景设为完全透明，避免一整块黑底
      // backgroundColor: "rgba(0, 0, 0, 0)",
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          if (Array.isArray(params.value) && params.value.length >= 3) {
            return `${params.name || "区域"}<br/>强度：${params.value[2]}`;
          }
          return params.name || "武汉";
        },
      },
      geo3D: {
        map: "wuhan",
        regionHeight: 8,
        boxWidth: 108,
        boxDepth: 124,
        // 关闭内置环境贴图，避免产生一大片深色背景
        environment: "none",
        shading: "lambert",
        itemStyle: {
          // 地图底色半透明，只保留一点蓝色轮廓 RGBA(31, 61, 110, 1)
          color: "RGBA(31, 61, 110, 0.4)",
          borderColor: "#69d9ff",
          borderWidth: 1.4,
          opacity: 1,
        },
        label: {
          show: true,
          color: "#dff6ff",
          fontSize: 12,
          distance: 2,
        },
        emphasis: {
          label: {
            color: "#ffffff",
          },
          itemStyle: {
            color: "#2dbeff",
          },
        },
        viewControl: {
        projection: "perspective",
        autoRotate: false,
        autoRotateDirection: "cw",
        autoRotateSpeed: 8,
          distance: 104,
          alpha: 62,
          beta: -8,
          minAlpha: 45,
          maxAlpha: 85,
          minDistance: 80,
          maxDistance: 180,
          panSensitivity: 0,
        },
        light: {
           main: {
    intensity: 0.8
  },
  ambient: {
    intensity: 0.8
  }
        },
        groundPlane: {
          show: false,
        },
        // 关闭会加重暗部的后期特效，避免区域被压黑
        postEffect: {
          enable: false,
          bloom: {
            enable: false,
          },
          SSAO: {
            enable: false,
          },
        },
        temporalSuperSampling: {
          enable: true,
        },
      },
      series: [
        // {
        //   name: "武汉底图",
        //   type: "map3D",
        //   map: "wuhan",
        //   geo3DIndex: 0,
        //   shading: "lambert",
        //   itemStyle: {
        //     color: "rgba(18, 63, 168, 0.35)",
        //     borderColor: "#69d9ff",
        //     borderWidth: 1.4,
        //     opacity: 0.7,
        //   },
        //   emphasis: {
        //     itemStyle: {
        //       color: "#2dbeff",
        //     },
        //   },
        //   silent: false,
        // },
        {
          name: "热力柱",
          type: "bar3D",
          coordinateSystem: "geo3D",
          bevelSize: 0.3,
          barSize: 1.8,
          minHeight: 4,
          data: barData,
          shading: "color",
          itemStyle: {
            color: (params) => {
              const value = params.value[2];
              if (value > 80) return "#ffd166";
              if (value > 60) return "#38d9ff";
              return "#2f7bff";
            },
            opacity: 0.96,
          },
        },
        {
          name: "飞线",
          type: "lines3D",
          coordinateSystem: "geo3D",
          blendMode: "lighter",
          effect: {
            show: true,
            period: 4,
            trailWidth: 4,
            trailLength: 0.22,
            trailOpacity: 0.9,
            trailColor: "#9be8ff",
          },
          lineStyle: {
            width: 1.5,
            color: "#69d9ff",
            opacity: 0.45,
          },
          data: lineData,
        },
        {
          name: "核心点",
          type: "scatter3D",
          coordinateSystem: "geo3D",
          symbol: "circle",
          symbolSize: 14,
          itemStyle: {
            color: "#ffd166",
            opacity: 1,
          },
          label: {
            show: true,
            formatter: "{b}",
            color: "#ffe8a6",
            fontSize: 14,
            distance: 10,
          },
          data: [{ name: "武汉核心", value: [...center, 18] }],
        },
      ],
    });
    chart.resize();
    mapReady.value = true;
  } catch (error) {
    if (echartsRef.value) {
      echartsRef.value.innerHTML =
        '<div style="color:#fff;padding:24px;text-align:center;">地图数据加载失败，请检查本地 wuhan_geo.json。</div>';
    }
  }
}

function resizeChart() {
  chart?.resize();
}

function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeChart();
  }, 120);
}

onMounted(() => {
  nextTick(() => {
    initChart();
    resizeChart();
  });

  window.addEventListener("resize", handleResize);
  resizeObserver = new ResizeObserver(() => {
    resizeChart();
  });

  if (mapContainerRef.value) {
    resizeObserver.observe(mapContainerRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  resizeObserver?.disconnect();
  clearTimeout(resizeTimer);
  chart?.dispose();
});

defineExpose({
  container: mapContainerRef,
});
</script>

<style scoped>
.map-center {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: radial-gradient(circle at center, rgba(13, 61, 147, 0.22) 0%, rgba(5, 8, 16, 0.92) 75%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.loader-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(95, 220, 255, 0.2);
  border-top-color: #5fdcff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.loader-text {
  color: rgba(191, 233, 255, 0.85);
  font-size: 14px;
  letter-spacing: 0.5px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.echarts-stage {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.echarts-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.echarts-overlay :deep(canvas) {
  background: transparent !important;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

.map-fade-enter-active {
  transition: opacity 0.6s ease 0.15s;
}

.map-fade-enter-from {
  opacity: 0;
}
</style>
