<template>
  <div class="map-center" ref="mapContainerRef">
    <Transition name="loader-fade">
      <div v-if="!mapReady" class="loader-overlay">
        <div class="loader-spinner"></div>
        <div class="loader-text">地图加载中...</div>
      </div>
    </Transition>

    <div class="three-stage" ref="threeRef" :class="{ 'is-ready': mapReady }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import wuhanGeo from "@/wuhan_geo.json"
import position1 from "@/assets/images/position-1.png"
import position2 from "@/assets/images/position-2.png"
import position3 from "@/assets/images/position-3.png"
import positionOut from "@/assets/images/position-out.png"

const mapContainerRef = ref(null)
const threeRef = ref(null)
const mapReady = ref(false)

let scene, camera, renderer, controls, animationId
let pointsGroup = null

// 模拟业务数据 - 分布在武汉各个行政区
const mockBusinessData = [
  // 江岸区
//   { id: 1, type: 'helmet', name: '安全帽-江岸1', lng: 114.32, lat: 30.62 },
//   { id: 2, type: 'person', name: '张工', lng: 114.30, lat: 30.60 },
//   // 江汉区
//   { id: 3, type: 'station', name: '监测站点-江汉', lng: 114.27, lat: 30.59 },
//   { id: 4, type: 'person', name: '李工', lng: 114.25, lat: 30.58 },
  // 硚口区
//   { id: 5, type: 'helmet', name: '安全帽-硚口1', lng: 114.22, lat: 30.58 },
//   { id: 6, type: 'person', name: '王工', lng: 114.20, lat: 30.57 },
  // 汉阳区
//   { id: 7, type: 'station', name: '监测站点-汉阳', lng: 114.22, lat: 30.55 },
//   { id: 8, type: 'helmet', name: '安全帽-汉阳1', lng: 114.25, lat: 30.54 },
//   { id: 9, type: 'person', name: '赵工', lng: 114.20, lat: 30.53 },
  // 武昌区
//   { id: 10, type: 'helmet', name: '安全帽-武昌1', lng: 114.35, lat: 30.56 },
//   { id: 11, type: 'station', name: '监测站点-武昌', lng: 114.33, lat: 30.54 },
  { id: 12, type: 'person', name: '刘工', lng: 114.37, lat: 30.55 },
  // 青山区
//   { id: 13, type: 'helmet', name: '安全帽-青山1', lng: 114.42, lat: 30.64 },
  { id: 14, type: 'person', name: '陈工', lng: 114.40, lat: 30.62 },
  // 洪山区
  { id: 15, type: 'station', name: '监测站点-洪山', lng: 114.38, lat: 30.52 },
//   { id: 16, type: 'helmet', name: '安全帽-洪山1', lng: 114.42, lat: 30.50 },
//   { id: 17, type: 'person', name: '周工', lng: 114.35, lat: 30.48 },
  // 东西湖区
  { id: 18, type: 'station', name: '监测站点-东西湖', lng: 114.15, lat: 30.65 },
  { id: 19, type: 'helmet', name: '安全帽-东西湖1', lng: 114.12, lat: 30.62 },
//   { id: 20, type: 'person', name: '吴工', lng: 114.18, lat: 30.60 },
  // 汉南区
  { id: 21, type: 'helmet', name: '安全帽-汉南1', lng: 114.08, lat: 30.32 },
  { id: 22, type: 'person', name: '郑工', lng: 114.10, lat: 30.30 },
  // 蔡甸区
  { id: 23, type: 'station', name: '监测站点-蔡甸', lng: 114.05, lat: 30.55 },
//   { id: 24, type: 'helmet', name: '安全帽-蔡甸1', lng: 114.02, lat: 30.52 },
//   { id: 25, type: 'person', name: '孙工', lng: 114.08, lat: 30.50 },
  // 江夏区
  { id: 26, type: 'station', name: '监测站点-江夏', lng: 114.35, lat: 30.35 },
//   { id: 27, type: 'helmet', name: '安全帽-江夏1', lng: 114.38, lat: 30.32 },
//   { id: 28, type: 'person', name: '钱工', lng: 114.32, lat: 30.30 },
//   // 黄陂区
  { id: 29, type: 'station', name: '监测站点-黄陂', lng: 114.38, lat: 30.88 },
//   { id: 30, type: 'helmet', name: '安全帽-黄陂1', lng: 114.35, lat: 30.85 },
  { id: 31, type: 'person', name: '冯工', lng: 114.42, lat: 30.82 },
  // 新洲区
//   { id: 32, type: 'station', name: '监测站点-新洲', lng: 114.82, lat: 30.85 },
//   { id: 33, type: 'helmet', name: '安全帽-新洲1', lng: 114.80, lat: 30.82 },
  { id: 34, type: 'person', name: '褚工', lng: 114.85, lat: 30.80 }
]

// 点位类型配置
const pointTypeConfig = {
  helmet: { color: '#FFD700', label: '安全帽', iconPath: position3 },
  station: { color: '#00FF00', label: '站点', iconPath: position1 },
  person: { color: '#FF6B6B', label: '人员', iconPath: position2 }
}

// 地图位置偏移配置（可根据需要调整）
const mapOffset = {
  x: -10,  // 正值向右，负值向左
  y: -10     // 正值向上，负值向下
}

// 经纬度转平面坐标（垂直翻转：y轴取反）
function project(lng, lat) {
  const x = (lng - 114.3) * 100 + mapOffset.x
  const y = (lat - 30.6) * 100 + mapOffset.y
  return [x, y]  // 移除 -y 的负号，实现垂直翻转
}

// 创建文字标签
function createTextSprite(text) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 256
  canvas.height = 64

  // 背景透明
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 文字样式 - 调整字体大小
  ctx.font = '18px "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#FCFCFC'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 4
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(32, 8, 1) // 调整显示大小

  return sprite
}

// 创建业务点位图标（使用图片）
function createPointIcon(type) {
  const config = pointTypeConfig[type]
  const textureLoader = new THREE.TextureLoader()
  
  const texture = textureLoader.load(config.iconPath)
  texture.colorSpace = THREE.SRGBColorSpace
  
  const material = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    depthTest: false // 确保图标始终在最前面
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(2.4, 2.4, 1) // 设计稿 26*26，按比例缩小

  return sprite
}

// 创建业务点位（带背景）
function createBusinessPoint(data) {
  const [x, y] = project(data.lng, data.lat)

  const pointGroup = new THREE.Group()

  // 创建背景
  const bgTexture = new THREE.TextureLoader().load(positionOut)
  bgTexture.colorSpace = THREE.SRGBColorSpace
  const bgMaterial = new THREE.SpriteMaterial({ 
    map: bgTexture, 
    transparent: true,
    depthTest: false
  })
  const bgSprite = new THREE.Sprite(bgMaterial)
  bgSprite.scale.set(6, 6, 1)
  bgSprite.position.set(x, y + 0.3, 14)
  pointGroup.add(bgSprite)

  // 创建图标
  const icon = createPointIcon(data.type)
  icon.position.set(x, y, 15)
  icon.userData = { ...data, isBusinessPoint: true }
  pointGroup.add(icon)

  return pointGroup
}

// 加载业务点位数据
function loadBusinessPoints() {
  if (pointsGroup) {
    scene.remove(pointsGroup)
    pointsGroup = null
  }

  pointsGroup = new THREE.Group()

  mockBusinessData.forEach(data => {
    const point = createBusinessPoint(data)
    pointsGroup.add(point)
  })

  scene.add(pointsGroup)
}

// 计算多边形面积（有符号）
function getPolygonArea(polygon) {
  let area = 0
  for (let i = 0; i < polygon.length - 1; i++) {
    const [x1, y1] = project(polygon[i][0], polygon[i][1])
    const [x2, y2] = project(polygon[i + 1][0], polygon[i + 1][1])
    area += x1 * y2 - x2 * y1
  }
  // 闭合
  const [x1, y1] = project(polygon[polygon.length - 1][0], polygon[polygon.length - 1][1])
  const [x2, y2] = project(polygon[0][0], polygon[0][1])
  area += x1 * y2 - x2 * y1
  return area / 2
}

// 计算多边形质心（Centroid）- 更准确的中心点
function getPolygonCenter(polygon) {
  let area = 0
  let cx = 0
  let cy = 0

  for (let i = 0; i < polygon.length - 1; i++) {
    const [x1, y1] = project(polygon[i][0], polygon[i][1])
    const [x2, y2] = project(polygon[i + 1][0], polygon[i + 1][1])

    const cross = x1 * y2 - x2 * y1
    area += cross
    cx += (x1 + x2) * cross
    cy += (y1 + y2) * cross
  }

  // 闭合多边形
  const [x1, y1] = project(polygon[polygon.length - 1][0], polygon[polygon.length - 1][1])
  const [x2, y2] = project(polygon[0][0], polygon[0][1])
  const cross = x1 * y2 - x2 * y1
  area += cross
  cx += (x1 + x2) * cross
  cy += (y1 + y2) * cross

  area = area / 2
  if (Math.abs(area) < 0.0001) {
    // 面积太小，退回到平均值
    let sumX = 0, sumY = 0
    polygon.forEach(p => {
      const [x, y] = project(p[0], p[1])
      sumX += x
      sumY += y
    })
    return [sumX / polygon.length, sumY / polygon.length]
  }

  cx = cx / (6 * area)
  cy = cy / (6 * area)

  return [cx, cy]
}

// 计算 MultiPolygon 的加权质心（按面积加权）
function getMultiPolygonCenter(multiCoords) {
  let totalArea = 0
  let weightedCx = 0
  let weightedCy = 0

  multiCoords.forEach(polygonGroup => {
    const polygon = polygonGroup[0] // 外边界
    const area = Math.abs(getPolygonArea(polygon))
    const [cx, cy] = getPolygonCenter(polygon)

    totalArea += area
    weightedCx += cx * area
    weightedCy += cy * area
  })

  if (totalArea < 0.0001) {
    // 退回到第一个多边形的中心
    return getPolygonCenter(multiCoords[0][0])
  }

  return [weightedCx / totalArea, weightedCy / totalArea]
}

// 创建地图
function createMap() {
  const group = new THREE.Group()
  const edgesGroup = new THREE.Group()
  const labelsGroup = new THREE.Group()
  // 记录已创建标签的区域，避免重复
  const createdLabels = new Set()

  wuhanGeo.features.forEach((feature) => {
    const geometry = feature.geometry
    const coords = geometry.coordinates
    const name = feature.properties?.name || ''
    // 每个区域只创建一个标签
    const shouldCreateLabel = name && !createdLabels.has(name)
    if (shouldCreateLabel) {
      createdLabels.add(name)
    }

    if (geometry.type === "MultiPolygon") {
      // MultiPolygon 计算所有子多边形的加权质心
      if (shouldCreateLabel) {
        const [cx, cy] = getMultiPolygonCenter(coords)
        const label = createTextSprite(name)
        label.position.set(cx, cy, 15)
        labelsGroup.add(label)
      }
      coords.forEach((polygonGroup) => {
        buildShape(polygonGroup[0])
      })
    }

    if (geometry.type === "Polygon") {
      buildShape(coords[0], shouldCreateLabel ? name : '')
    }
  })

  scene.add(group)
  scene.add(edgesGroup)
  scene.add(labelsGroup)

  // 创建地图倒影
  const reflectionGroup = group.clone()
  reflectionGroup.scale.set(1, 1, -0.3) // Z轴压缩并翻转
  reflectionGroup.position.z = 0 // 向下偏移
  reflectionGroup.traverse((child) => {
    if (child.isMesh) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map(mat => {
          const newMat = mat.clone()
          newMat.transparent = true
          newMat.opacity = 0.1
          return newMat
        })
      } else {
        child.material = child.material.clone()
        child.material.transparent = true
        child.material.opacity = 0.2
      }
    }
  })
  scene.add(reflectionGroup)

  function buildShape(polygon, labelName) {
    const shape = new THREE.Shape()
    const points = []

    polygon.forEach((p, i) => {
      const lng = p[0]
      const lat = p[1]
      const [x, y] = project(lng, lat)
      points.push(new THREE.Vector3(x, y, 12))

      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    })

    // 主体 - 深蓝色半透明，增加分段数使侧面更平滑
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 12,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 32
    })

    // 顶面材质 - 深蓝色无光泽
    const topMaterial = new THREE.MeshLambertMaterial({
      color: "#203E6F",
      transparent: true,
      opacity: 0.95  // ← 调整透明度，范围 0-1
    })

    // 侧面材质 - 纯色光滑
    const sideMaterial = new THREE.MeshPhongMaterial({
      color: "#4FB5D2",
      transparent: true,
      opacity: 1,
      shininess: 0,
      specular: "#000000",
      flatShading: false
    })

    // 计算顶点法线使侧面更平滑
    geometry.computeVertexNormals()

    const mesh = new THREE.Mesh(geometry, [topMaterial, sideMaterial])
    group.add(mesh)

    // 发光边框线 - 增强轮廓
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#5AB7D3",
      linewidth: 5,
      transparent: true,
      opacity: 0.9
    })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    edgesGroup.add(line)

    // 添加第二层轮廓线增强效果
    const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, p.y, p.z - 0.5))
    )
    const lineMaterial2 = new THREE.LineBasicMaterial({
      color: "#5AB7D3",
      linewidth: 3,
      transparent: true,
      opacity: 0.5
    })
    const line2 = new THREE.Line(lineGeometry2, lineMaterial2)
    edgesGroup.add(line2)

    // 创建区域名称标签（仅 Polygon 类型使用）
    if (labelName) {
      const [cx, cy] = getPolygonCenter(polygon)
      const label = createTextSprite(labelName)
      label.position.set(cx, cy, 15)
      labelsGroup.add(label)
    }

    // 底部发光轮廓
    const bottomPoints = points.map(p => new THREE.Vector3(p.x, p.y, 0.1))
    const bottomLineGeometry = new THREE.BufferGeometry().setFromPoints(bottomPoints)
    const bottomLineMaterial = new THREE.LineBasicMaterial({
      color: "#00bcd4",
      linewidth: 3,
      transparent: true,
      opacity: 0.6
    })
    const bottomLine = new THREE.Line(bottomLineGeometry, bottomLineMaterial)
    edgesGroup.add(bottomLine)
  }
}

// 初始化 Three
function initThree() {

  const width = threeRef.value.clientWidth
  const height = threeRef.value.clientHeight

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  // 相机位置：用户调整的合适角度  
  camera.position.set(-0.64, -95.76, 175.50)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })

  renderer.setSize(width, height)

  threeRef.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  // 暂时不限制旋转角度，方便调试
  // controls.maxPolarAngle = Math.PI / 2.1
  // 允许更自由的旋转，但保持一定限制
  // 固定缩放距离为 245.46，禁止缩放
  const distance = 230
  controls.minDistance = distance
  controls.maxDistance = distance
    // 禁止所有鼠标操作
  controls.enablePan = false      // 禁止平移
  controls.enableRotate = false   // 禁止旋转
  controls.enableZoom = false     // 禁止缩放
  
  // 设置目标点为地图中心
  controls.target.set(0, 0, 0)
  controls.update()

  // 监听鼠标操作，打印相机位置
  controls.addEventListener('change', () => {
    console.log('Camera position:', {
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2)
    })
  })

  // 监听鼠标滚轮，打印当前缩放距离
  renderer.domElement.addEventListener('wheel', () => {
    const distance = camera.position.distanceTo(controls.target)
    console.log('Current zoom distance:', distance.toFixed(2))
  })

  // 主光源 - 增强亮度
  const light = new THREE.DirectionalLight("#ffffff", 5)
  light.position.set(50, -50, 100)
  scene.add(light)

  // 侧面补光
  const sideLight = new THREE.DirectionalLight("#ffffff", 1)
  sideLight.position.set(-50, 0, 20)
  scene.add(sideLight)

  // 环境光 - 增强让整体更亮
  const ambient = new THREE.AmbientLight("#ffffff", 3)
  scene.add(ambient)

  // 底部补光
  const bottomLight = new THREE.DirectionalLight("#4FB5D2", 0.5)
  bottomLight.position.set(0, 0, -20)
  scene.add(bottomLight)

  createMap()

  // 加载业务点位
  loadBusinessPoints()

  animate()

  mapReady.value = true
}

// 渲染循环
function animate() {

  animationId = requestAnimationFrame(animate)

  renderer.render(scene, camera)

}

// 自适应
function resize() {

  if (!renderer) return

  const w = threeRef.value.clientWidth
  const h = threeRef.value.clientHeight

  camera.aspect = w / h
  camera.updateProjectionMatrix()

  renderer.setSize(w, h)

}

onMounted(() => {
  // 使用 requestAnimationFrame 确保 DOM 已经渲染并获取到正确尺寸
  requestAnimationFrame(() => {
    initThree()
    window.addEventListener("resize", resize)
  })
})

onUnmounted(() => {

  cancelAnimationFrame(animationId)

  renderer?.dispose()

  window.removeEventListener("resize", resize)

})
</script>

<style scoped>
.map-center {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.three-stage {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.three-stage.is-ready {
  opacity: 1;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: radial-gradient(circle at center, rgba(13,61,147,.22), rgba(5,8,16,.92));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(95,220,255,.2);
  border-top-color: #5fdcff;
  border-radius: 50%;
  animation: spin .9s linear infinite;
}

.loader-text {
  color: #bfe9ff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>