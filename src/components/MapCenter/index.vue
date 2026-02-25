<template>
  <div class="map-center" ref="mapContainerRef">
    <!-- 加载遮罩 -->
    <Transition name="loader-fade">
      <div v-if="!mapReady" class="loader-overlay">
        <div class="loader-spinner"></div>
        <div class="loader-text">地图加载中...</div>
      </div>
    </Transition>
    <!-- 地图内容：加载完成后淡入 -->
    <Transition name="map-fade">
      <div v-show="mapReady" class="cesium-wrap">
        <div class="cesium-container" ref="cesiumRef"></div>
        <div v-if="SHOW_WUHAN_3D" class="echarts-overlay" ref="echartsRef"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

const SHOW_WUHAN_3D = false // 武汉 3D 改由 Cesium 绘制，与底图完全重合

const mapContainerRef = ref(null)
const cesiumRef = ref(null)
const echartsRef = ref(null)
const mapReady = ref(false)
let viewer = null
let chart = null
let resizeObserver = null
let resizeTimer = null

const GEO_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/420100_full.json'
const center = [114.3055, 30.5928]
const hubs = [
  { name: '江汉区', coord: [114.2707, 30.601], value: 78 },
  { name: '武昌区', coord: [114.3162, 30.5538], value: 86 },
  { name: '汉阳区', coord: [114.2658, 30.5492], value: 66 },
  { name: '洪山区', coord: [114.3435, 30.5048], value: 90 },
  { name: '青山区', coord: [114.3974, 30.6391], value: 58 },
  { name: '东西湖区', coord: [114.137, 30.622], value: 54 },
  { name: '江夏区', coord: [114.313, 30.3473], value: 63 },
  { name: '黄陂区', coord: [114.3742, 30.874], value: 48 },
  { name: '蔡甸区', coord: [114.0292, 30.582], value: 42 },
  { name: '新洲区', coord: [114.8002, 30.8421], value: 45 },
]

const barData = hubs.map((d) => [...d.coord, d.value])
const lineData = hubs.map((d) => ({
  coords: [[...center, 8], [...d.coord, 20 + d.value * 0.25]],
}))

const CESIUM_BASE = 'https://unpkg.com/cesium@1.129/Build/Cesium/'

// 阿里 DataV 使用 GCJ-02，Cesium/OSM 使用 WGS84，需转换以对齐底图（算法来自 coordtransform）
function gcj02ToWgs84(lng, lat) {
  const PI = 3.1415926535897932384626
  const a = 6378245.0
  const ee = 0.00669342162296594323
  const transformLat = (x, y) => {
    let ret = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3
    ret += (20 * Math.sin(y * PI) + 40 * Math.sin(y / 3 * PI)) * 2 / 3
    ret += (160 * Math.sin(y / 12 * PI) + 320 * Math.sin(y * PI / 30)) * 2 / 3
    return ret
  }
  const transformLng = (x, y) => {
    let ret = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3
    ret += (20 * Math.sin(x * PI) + 40 * Math.sin(x / 3 * PI)) * 2 / 3
    ret += (150 * Math.sin(x / 12 * PI) + 300 * Math.sin(x / 30 * PI)) * 2 / 3
    return ret
  }
  lng = +lng
  lat = +lat
  if (lng < 73.66 || lng > 135.05 || lat < 3.86 || lat > 53.55) return [lng, lat]
  const dlat = transformLat(lng - 105, lat - 35)
  const dlng = transformLng(lng - 105, lat - 35)
  const radlat = (lat / 180) * PI
  let magic = Math.sin(radlat)
  magic = 1 - ee * magic * magic
  const sqrtmagic = Math.sqrt(magic)
  const mgLat = lat + (dlat * 180) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
  const mgLng = lng + (dlng * 180) / (a / sqrtmagic * Math.cos(radlat) * PI)
  return [lng * 2 - mgLng, lat * 2 - mgLat]
}

function transformGeoJsonToWgs84(geo) {
  const conv = (arr) => {
    if (Array.isArray(arr) && arr.length >= 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      return gcj02ToWgs84(arr[0], arr[1])
    }
    if (Array.isArray(arr)) return arr.map(conv)
    return arr
  }
  const out = JSON.parse(JSON.stringify(geo))
  const walk = (obj) => {
    if (Array.isArray(obj) && obj.length >= 2 && typeof obj[0] === 'number' && typeof obj[1] === 'number') {
      return conv(obj)
    }
    if (Array.isArray(obj)) return obj.map(walk)
    if (obj && typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        obj[k] = walk(obj[k])
      }
    }
    return obj
  }
  walk(out)
  return out
}

function loadCesium() {
  return new Promise((resolve, reject) => {
    if (window.Cesium) {
      resolve(window.Cesium)
      return
    }
    window.CESIUM_BASE_URL = CESIUM_BASE
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = CESIUM_BASE + 'Widgets/widgets.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = CESIUM_BASE + 'Cesium.js'
    script.onload = () => resolve(window.Cesium)
    script.onerror = () => reject(new Error('Cesium 脚本加载失败'))
    document.head.appendChild(script)
  })
}

function loadWuhanGeoJson(C, onComplete) {
  if (!viewer) return
  fetch(GEO_URL)
    .then((r) => r.json())
    .then((rawGeo) => {
      const geoJson = transformGeoJsonToWgs84(rawGeo)
      return C.GeoJsonDataSource.load(geoJson, {
        stroke: C.Color.fromCssColorString('#2d4a5f'),
        fill: C.Color.fromCssColorString('#142038').withAlpha(0.85),
        strokeWidth: 1.5,
      }).then((dataSource) => {
        viewer.dataSources.add(dataSource)
        const features = geoJson.features || []
        dataSource.entities.values.forEach((entity, i) => {
          if (entity.polygon) {
            entity.polygon.height = 0
            entity.polygon.extrudedHeight = 600
            entity.polygon.material = C.Color.fromCssColorString('#142038').withAlpha(0.88)
            entity.polygon.outline = true
            entity.polygon.outlineColor = C.Color.fromCssColorString('#2d4a5f')
            entity.polygon.outlineWidth = 2
          }
          const feat = features[i]
          const name = feat?.properties?.name ?? ''
          const centroid = feat?.properties?.centroid || feat?.properties?.center
          if (name && centroid && Array.isArray(centroid) && centroid.length >= 2) {
            const pos = typeof centroid[0] === 'number' ? centroid : centroid[0]
            entity.position = C.Cartesian3.fromDegrees(pos[0], pos[1])
            entity.label = {
              text: name,
              font: '14px "PingFang SC", "Microsoft YaHei", sans-serif',
              fillColor: C.Color.fromCssColorString('#8ba3b8'),
              outlineColor: C.Color.BLACK,
              outlineWidth: 2.5,
              style: C.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: C.VerticalOrigin.CENTER,
              horizontalOrigin: C.HorizontalOrigin.CENTER,
              pixelOffset: new C.Cartesian2(0, 0),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
          }
        })
        onComplete?.()
      })
    })
    .catch(() => {
      console.warn('武汉 GeoJSON 加载失败')
      onComplete?.()
    })
}

function initCesium() {
  if (!cesiumRef.value) return
  loadCesium()
    .then((C) => {
      viewer = new C.Viewer(cesiumRef.value, {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    creditContainer: document.createElement('div'),
    baseLayer: new C.ImageryLayer(
      new C.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        subdomains: ['a', 'b', 'c', 'd'],
      })
    ),
    sceneMode: C.SceneMode.SCENE3D,
  })
      viewer.scene.backgroundColor = C.Color.fromCssColorString('#000000')
      viewer.scene.globe.baseColor = C.Color.fromCssColorString('#000000')
      viewer.scene.globe.enableLighting = false
      const controller = viewer.scene.screenSpaceCameraController
      controller.enableRotate = true
      controller.enableTranslate = true
      controller.enableZoom = true
      controller.enableTilt = true
      controller.minimumPitch = C.Math.toRadians(-90)
      controller.maximumPitch = 0
      viewer.camera.setView({
        destination: C.Cartesian3.fromDegrees(114.3055, 30.5928, 180000),
        orientation: {
          heading: 0,
          pitch: C.Math.toRadians(-45),
          roll: 0,
        },
      })
      loadWuhanGeoJson(C, () => {
        mapReady.value = true
        nextTick(() => resizeCesium())
      })
      resizeCesium()
    })
    .catch((err) => console.warn('Cesium 加载失败:', err.message))
}

function initECharts() {
  if (!echartsRef.value) return
  chart = echarts.init(echartsRef.value)

  fetch(GEO_URL)
    .then((r) => r.json())
    .then((geoJson) => {
      echarts.registerMap('wuhan', geoJson)
      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: (p) => {
            if (Array.isArray(p.value) && p.value.length >= 3) {
              return `${p.name || '区域'}<br/>强度：${p.value[2]}`
            }
            return p.name || '武汉'
          },
        },
        geo3D: {
          map: 'wuhan',
          regionHeight: 2.5,
          center: [114.3055, 30.5928],
          boxWidth: 180,
          boxHeight: 20,
          boxDepth: 180,
        },
        series: [
          {
            name: '底图',
            type: 'map3D',
            map: 'wuhan',
            shading: 'lambert',
            label: {
              show: true,
              color: '#bfe9ff',
              fontSize: 10,
            },
            itemStyle: {
              color: '#0d3d93',
              borderColor: '#5fdcff',
              borderWidth: 1.2,
              opacity: 0.96,
            },
            emphasis: {
              label: { color: '#fff' },
              itemStyle: { color: '#1f9dff' },
            },
            light: {
              main: { intensity: 1.3, alpha: 35, beta: 15, shadow: true },
              ambient: { intensity: 0.45 },
              ambientCubemap: { exposure: 1, diffuseIntensity: 0.4 },
            },
            viewControl: {
              projection: 'perspective',
              autoRotate: false,
              distance: 88,
              alpha: 78,
              beta: 0,
              minDistance: 70,
              maxDistance: 150,
            },
            groundPlane: {
              show: false,
            },
            postEffect: {
              enable: true,
              bloom: { enable: true, bloomIntensity: 0.3 },
              SSAO: { enable: true, radius: 2, intensity: 1.2 },
            },
            temporalSuperSampling: { enable: true },
          },
          {
            name: '热力柱',
            type: 'bar3D',
            coordinateSystem: 'geo3D',
            bevelSize: 0.25,
            barSize: 2.1,
            minHeight: 1,
            data: barData,
            shading: 'color',
            itemStyle: {
              color: (params) => {
                const v = params.value[2]
                if (v > 80) return '#ffd166'
                if (v > 60) return '#38d9ff'
                return '#2f7bff'
              },
              opacity: 0.95,
            },
          },
          {
            name: '飞线',
            type: 'lines3D',
            coordinateSystem: 'geo3D',
            effect: {
              show: true,
              period: 3,
              trailWidth: 4,
              trailLength: 0.25,
              trailOpacity: 0.9,
              trailColor: '#9be8ff',
            },
            lineStyle: {
              width: 1.5,
              color: '#69d9ff',
              opacity: 0.35,
            },
            blendMode: 'lighter',
            data: lineData,
          },
          {
            name: '核心点',
            type: 'scatter3D',
            coordinateSystem: 'geo3D',
            symbol: 'circle',
            symbolSize: 14,
            itemStyle: {
              color: '#ffd166',
              opacity: 1,
            },
            label: {
              show: true,
              formatter: '{b}',
              color: '#ffe8a6',
              fontSize: 12,
              distance: 8,
            },
            data: [{ name: '武汉核心', value: [...center, 18] }],
          },
        ],
      })
      chart.resize()
    })
    .catch(() => {
      if (echartsRef.value) {
        echartsRef.value.innerHTML =
          '<div style="color:#fff;padding:24px;text-align:center;">地图数据加载失败，请检查网络。</div>'
      }
    })
}

function resizeChart() {
  chart?.resize()
}

function resizeCesium() {
  viewer?.resize()
}

function handleResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (SHOW_WUHAN_3D) resizeChart()
    resizeCesium()
  }, 120)
}

onMounted(() => {
  nextTick(() => {
    initCesium()
    if (SHOW_WUHAN_3D) initECharts()
    if (SHOW_WUHAN_3D) resizeChart()
    resizeCesium()
  })
  window.addEventListener('resize', handleResize)
  resizeObserver = new ResizeObserver(() => {
    if (SHOW_WUHAN_3D) resizeChart()
    resizeCesium()
  })
  if (mapContainerRef.value) {
    resizeObserver.observe(mapContainerRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  resizeObserver?.disconnect()
  clearTimeout(resizeTimer)
  chart?.dispose()
  viewer?.destroy()
})

defineExpose({
  container: mapContainerRef,
})
</script>

<style scoped>
.map-center {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

/* 加载遮罩 */
.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: linear-gradient(180deg, #050810 0%, #0a0e1a 100%);
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

/* 地图容器淡入 */
.cesium-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.cesium-container {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.echarts-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: auto;
}

/* 加载遮罩淡出 */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}
.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

/* 地图淡入 */
.map-fade-enter-active {
  transition: opacity 0.6s ease 0.15s;
}
.map-fade-enter-from {
  opacity: 0;
}
</style>
