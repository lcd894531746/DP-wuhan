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
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import wuhanGeo from "@/wuhan_full.json"
import wuhanOutline from "@/wuhan_outline.json"
import position1 from "@/assets/images/position-1.png"
import position2 from "@/assets/images/position-2.png"
import position3 from "@/assets/images/position-3.png"
import positionOut from "@/assets/images/position-out.png"
import bgImage from "@/assets/images/bg.png"


const mapContainerRef = ref(null)
const threeRef = ref(null)
const mapReady = ref(false)
const emit = defineEmits(["ready"])

let scene, camera, renderer, controls, animationId
let composer = null // 后期处理合成器
let bloomComposer = null // Bloom 发光效果合成器
let pointsGroup = null
let mapEdgesGroup = null // 全局引用边界组
let outerOutlineGlowGroup = null // 外部轮廓荧光层（独立，不影响其他）
let mapLiftZ = 0 // 地图入场/当前位置，用于同步贴底特效
let raycaster = null
let pointerNdc = null
let districtMeshes = []
let hoveredDistrict = null
let uiReadyTimer = null

const DISTRICT_HOVER_STYLE = {
  topColor: "#2B5FA8",
  sideColor: "#8AF3FF",
  emissive: "#00E5FF",
  emissiveIntensity: 0.9,
  topOpacity: 1,
  sideOpacity: 1
}

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

// 经纬度转平面坐标
function project(lng, lat) {
  const x = (lng - 114.3) * 100 + mapOffset.x
  const y = (lat - 30.6) * 100 + mapOffset.y
  return [x, y]
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
  // 处理透明边缘，避免旋转时出现黑底/黑块
  texture.premultiplyAlpha = true
  texture.needsUpdate = true

  const material = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    depthTest: false,
    depthWrite: false
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(32, 8, 1) // 调整显示大小
  sprite.renderOrder = 1300

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
function createBusinessPoint(data, index = 0) {
  const [x, y] = project(data.lng, data.lat)

  const pointGroup = new THREE.Group()
  pointGroup.userData = {
    isBusinessPointGroup: true,
    appearStart: performance.now() + index * 90, // 错峰进入
    appearDone: false
  }

  // 创建背景
  const bgTexture = new THREE.TextureLoader().load(positionOut)
  bgTexture.colorSpace = THREE.SRGBColorSpace
  const bgMaterial = new THREE.SpriteMaterial({ 
    map: bgTexture, 
    transparent: true,
    depthTest: false,
    opacity: 0
  })
  const bgSprite = new THREE.Sprite(bgMaterial)
  bgSprite.scale.set(0.001, 0.001, 1)
  bgSprite.position.set(x, y + 0.3, 14)
  bgSprite.userData = { targetScale: 6 }
  pointGroup.add(bgSprite)

  // 创建图标
  const icon = createPointIcon(data.type)
  icon.material.opacity = 0
  icon.scale.set(0.001, 0.001, 1)
  icon.position.set(x, y, 15)
  icon.userData = { ...data, isBusinessPoint: true, targetScale: 2.4 }
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

  mockBusinessData.forEach((data, idx) => {
    const point = createBusinessPoint(data, idx)
    pointsGroup.add(point)
  })

  scene.add(pointsGroup)
}

function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function updateBusinessPointsAnimation() {
  if (!pointsGroup) return

  const now = performance.now()
  pointsGroup.children.forEach(group => {
    if (!group?.userData?.isBusinessPointGroup || group.userData.appearDone) return

    const start = group.userData.appearStart ?? now
    const elapsed = now - start
    if (elapsed < 0) return

    const duration = 650
    const t = Math.min(elapsed / duration, 1)
    const k = easeOutBack(t)
    const alpha = t

    group.children.forEach(child => {
      const targetScale = child.userData?.targetScale
      if (targetScale) child.scale.set(targetScale * k, targetScale * k, 1)
      if (child.material) child.material.opacity = alpha
    })

    if (t >= 1) group.userData.appearDone = true
  })
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

// 创建背景平面（作为地面，与地图固定在一起）
function createBackgroundPlane() {
  // 背景图是 1920×1080 设计稿，按原比例设置
  // 放大背景平面，避免相机拉远时露出“黑边”
  const planeWidth = 1920
  const planeHeight = 1080
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
  
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(bgImage)
  texture.colorSpace = THREE.SRGBColorSpace
  
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  })
  
  const plane = new THREE.Mesh(geometry, material)
  // 放在地图倒影下方（倒影在 Z 负方向）
  plane.position.set(-10, -10, -5)
  plane.renderOrder = -1000
  scene.add(plane)

  // 仅写深度的“地面遮罩”：用于制造“从平面升起”的遮挡效果（不影响画面）
  const depthMaskMat = new THREE.MeshBasicMaterial({ colorWrite: false })
  depthMaskMat.depthTest = true
  depthMaskMat.depthWrite = true
  const depthMask = new THREE.Mesh(geometry, depthMaskMat)
  depthMask.position.copy(plane.position)
  // 稍微抬一点，避免 z-fighting
  depthMask.position.z += 0.05
  depthMask.renderOrder = -999
  scene.add(depthMask)
}

// 创建动态光环效果（扫描线样式）
let rippleRings = []
const RIPPLE_COUNT = 1 // 同时存在的光环数量（减少频率）
const RIPPLE_MAX_RADIUS = 40 // 最大扩散半径
const RIPPLE_SPEED = 10 // 扩散速度（单位/秒），配合 dt 保持不同帧率一致
const RIPPLE_Z_OFFSET = 0.2 // 光环贴底高度（从模型底部扩散）
const RIPPLE_COLOR = {
  core: [0, 229, 255], // 更偏青蓝，避免过“妖”
  alpha1: 0.0,
  alpha2: 0.18,
  alpha3: 0.55,
  alpha4: 0.0
}
let rippleLastTime = 0

function createRippleEffect() {
  // 创建扫描线纹理
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  
  // 绘制渐变圆环
  const gradient = ctx.createRadialGradient(128, 128, 60, 128, 128, 128)
  const [r, g, b] = RIPPLE_COLOR.core
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${RIPPLE_COLOR.alpha1})`)
  gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${RIPPLE_COLOR.alpha2})`)
  gradient.addColorStop(0.9, `rgba(${r}, ${g}, ${b}, ${RIPPLE_COLOR.alpha3})`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${RIPPLE_COLOR.alpha4})`)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  
  const texture = new THREE.CanvasTexture(canvas)
  
  // 创建多个光环
  for (let i = 0; i < RIPPLE_COUNT; i++) {
    const geometry = new THREE.PlaneGeometry(600, 600)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide, // 双面渲染
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    
    const ring = new THREE.Mesh(geometry, material)
    // 平放在 XY 平面（Z 轴向上）
    ring.position.set(0, 0, mapLiftZ + RIPPLE_Z_OFFSET) // 贴着模型底部扩散
    ring.renderOrder = 1200
    ring.frustumCulled = false // 避免某些视角被误裁剪导致“消失”
    
    // 每个光环的初始相位不同
    ring.userData = {
      phase: (i / RIPPLE_COUNT) * RIPPLE_MAX_RADIUS,
      active: true
    }
    
    scene.add(ring)
    rippleRings.push(ring)
  }

  rippleLastTime = performance.now()
}

// 更新光环动画
function updateRippleAnimation() {
  const now = performance.now()
  const dt = rippleLastTime ? (now - rippleLastTime) / 1000 : 0.016
  rippleLastTime = now

  rippleRings.forEach(ring => {
    if (!ring.userData.active) return

    // 同步地图当前位置，确保光环始终从底部扩散（跟随入场动画/整体抬升）
    ring.position.z = mapLiftZ + RIPPLE_Z_OFFSET
    
    // 当前半径
    let currentRadius = ring.userData.phase
    
    // 向外扩散
    currentRadius += RIPPLE_SPEED * dt
    
    // 如果超出最大半径，重置到中心
    if (currentRadius > RIPPLE_MAX_RADIUS) {
      currentRadius = 0
    }
    
    ring.userData.phase = currentRadius
    
    // 根据半径计算透明度
    const progress = currentRadius / RIPPLE_MAX_RADIUS
    const opacity = 0.9 * (1 - progress) // 越往外越透明
    
    // 更新缩放
    const scale = currentRadius / 50 // 从中心开始缩放
    ring.scale.set(scale, scale, 1)
    ring.material.opacity = opacity
  })
}

// 创建高亮边缘线条效果（沿地图边界移动的发光线条）
let highlightLineProgress = 0
const HIGHLIGHT_SPEED = 0.001 // 移动速度
let outlineRunner = null // 沿外轮廓跑动的荧光段（更明显）
let outlineRunnerCurve = null
let outlineRunnerSamples = null
let outlineRunnerTick = 0

function getWuhanOutlinePoints() {
  const outlinePoints = []

  if (wuhanOutline && wuhanOutline.features && wuhanOutline.features.length > 0) {
    const feature = wuhanOutline.features[0]
    const geometry = feature.geometry

    if (geometry?.type === "MultiPolygon") {
      // 取第一个多边形的外边界（主轮廓）
      const polygon = geometry.coordinates?.[0]?.[0] || []
      for (let i = 0; i < polygon.length; i += 1) {
        const [lng, lat] = polygon[i]
        const [x, y] = project(lng, lat)
        outlinePoints.push(new THREE.Vector3(x, y, 12.6))
      }
    } else if (geometry?.type === "Polygon") {
      const polygon = geometry.coordinates?.[0] || []
      for (let i = 0; i < polygon.length; i += 1) {
        const [lng, lat] = polygon[i]
        const [x, y] = project(lng, lat)
        outlinePoints.push(new THREE.Vector3(x, y, 12.6))
      }
    }
  }

  // 尽量闭合
  if (outlinePoints.length > 2) {
    const first = outlinePoints[0]
    const last = outlinePoints[outlinePoints.length - 1]
    if (!first.equals(last)) outlinePoints.push(first.clone())
  }

  return outlinePoints
}

function createOuterOutlineGlow() {
  // 清理旧对象，避免重复叠加
  if (outerOutlineGlowGroup) {
    scene.remove(outerOutlineGlowGroup)
    outerOutlineGlowGroup.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose?.()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.())
        else obj.material.dispose?.()
      }
    })
    outerOutlineGlowGroup = null
  }

  const outlinePoints = getWuhanOutlinePoints()
  if (outlinePoints.length < 4) return

  outerOutlineGlowGroup = new THREE.Group()
  outerOutlineGlowGroup.renderOrder = 999

  // 用 TubeGeometry 做“粗线 + 光晕”，比 LineBasicMaterial 更稳定（不依赖 linewidth）
  const curve = new THREE.CatmullRomCurve3(outlinePoints, true, "catmullrom", 0.2)
  const tubularSegments = Math.min(Math.max(outlinePoints.length * 2, 400), 1600)

  const coreGeo = new THREE.TubeGeometry(curve, tubularSegments, 0.35, 8, true)
  const haloGeo = new THREE.TubeGeometry(curve, tubularSegments, 1.1, 10, true)

  const coreMat = new THREE.MeshStandardMaterial({
    color: "#00d4ff",
    emissive: "#00a8cc",
    emissiveIntensity: 2.0,
    transparent: true,
    opacity: 0.9,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const haloMat = new THREE.MeshStandardMaterial({
    color: "#0088aa",
    emissive: "#006688",
    emissiveIntensity: 1.4,
    transparent: true,
    opacity: 0.2,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const core = new THREE.Mesh(coreGeo, coreMat)
  const halo = new THREE.Mesh(haloGeo, haloMat)
  core.renderOrder = 999
  halo.renderOrder = 998

  outerOutlineGlowGroup.add(halo)
  outerOutlineGlowGroup.add(core)
  scene.add(outerOutlineGlowGroup)
}

function createOutlineRunner() {
  // 清理旧对象，避免重复叠加
  if (outlineRunner) {
    scene.remove(outlineRunner)
    outlineRunner.geometry?.dispose?.()
    if (Array.isArray(outlineRunner.material)) outlineRunner.material.forEach(m => m.dispose?.())
    else outlineRunner.material?.dispose?.()
    outlineRunner = null
  }

  const outlinePoints = getWuhanOutlinePoints()
  if (outlinePoints.length < 4) return

  outlineRunnerCurve = new THREE.CatmullRomCurve3(outlinePoints, true, "catmullrom", 0.2)

  // 预采样，减少每帧计算量
  const sampleCount = 1400
  outlineRunnerSamples = outlineRunnerCurve.getPoints(sampleCount)

  const initGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outlineRunnerSamples.slice(0, 60), false), 120, 0.75, 10, false)
  const runnerMat = new THREE.MeshStandardMaterial({
    color: "#00d4ff",
    emissive: "#00d4ff",
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  outlineRunner = new THREE.Mesh(initGeo, runnerMat)
  outlineRunner.renderOrder = 1001
  scene.add(outlineRunner)
}

function updateOutlineRunner() {
  if (!outlineRunner || !outlineRunnerSamples || outlineRunnerSamples.length < 200) return

  // 更新进度（循环绕圈）
  highlightLineProgress += HIGHLIGHT_SPEED
  if (highlightLineProgress > 1) highlightLineProgress = 0

  // 控制更新频率，避免 TubeGeometry 频繁重建带来开销
  outlineRunnerTick += 1
  const updateEvery = 2
  if (outlineRunnerTick % updateEvery !== 0) return

  const total = outlineRunnerSamples.length
  const headIndex = Math.floor((highlightLineProgress % 1) * total)
  const segmentLen = Math.floor(total * 0.06) // 跑动段长度（占轮廓比例）

  const segmentPoints = []
  for (let i = 0; i < segmentLen; i += 1) {
    segmentPoints.push(outlineRunnerSamples[(headIndex + i) % total])
  }

  // 用小段曲线生成 Tube，保证“粗线+发光”效果稳定
  const segCurve = new THREE.CatmullRomCurve3(segmentPoints, false, "catmullrom", 0.1)
  const newGeo = new THREE.TubeGeometry(segCurve, Math.max(segmentLen * 2, 120), 0.2, 10, false)

  outlineRunner.geometry.dispose?.()
  outlineRunner.geometry = newGeo

  // 头部更亮一些（轻微脉冲）
  if (outlineRunner.material?.emissiveIntensity != null) {
    outlineRunner.material.emissiveIntensity = 2.6 + 0.6 * Math.sin(performance.now() / 180)
  }
}

function createHighlightLineEffect() {
  // 使用 wuhanOutline 的外轮廓数据（高亮移动线）
  const outlinePoints = getWuhanOutlinePoints().filter((_, idx) => idx % 2 === 0)
  
  if (outlinePoints.length === 0) return
  
  // 创建发光线条 - 使用 ShaderMaterial 实现发光效果
  const geometry = new THREE.BufferGeometry()
  
  // 自定义着色器实现发光效果
  const vertexShader = `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  
  const fragmentShader = `
    varying vec3 vPosition;
    uniform float time;
    void main() {
      // 白色发光效果
      vec3 color = vec3(1.0, 1.0, 1.0);
      // 脉冲效果：基础亮度1.0，变化幅度0.5，频率3.0
      float pulse = 1.0 + 0.5 * sin(time * 5.0);
      gl_FragColor = vec4(color * pulse, 1.0);
    }
  `
  
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      time: { value: 0 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  highlightLine = new THREE.Line(geometry, material)
  highlightLine.userData = { 
    outlinePoints: outlinePoints,
    material: material
  }
  highlightLine.renderOrder = 1000
  scene.add(highlightLine)
}

// 更新高亮线条位置
function updateHighlightLine() {
  if (!highlightLine) return
  
  const outlinePoints = highlightLine.userData.outlinePoints
  const totalPoints = outlinePoints.length
  if (totalPoints === 0) return
  
  // 更新进度
  highlightLineProgress += HIGHLIGHT_SPEED
  if (highlightLineProgress > 1) {
    highlightLineProgress = 0
  }
  
  // 计算当前位置对应的点索引
  const currentIndex = Math.floor(highlightLineProgress * totalPoints)
  const segmentLength = 100 // 高亮线条长度（点数）
  
  // 获取当前线条的点
  const linePoints = []
  for (let i = 0; i < segmentLength; i++) {
    const index = (currentIndex + i) % totalPoints
    linePoints.push(outlinePoints[index])
  }
  
  // 更新几何体
  highlightLine.geometry.setFromPoints(linePoints)
}

// 创建地图
function createMap() {
  const group = new THREE.Group()
  const edgesGroup = new THREE.Group()
  const labelsGroup = new THREE.Group()
  districtMeshes = []
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
        // MultiPolygon 的标签只创建一次（上面已经按面积加权质心创建）
        buildShape(polygonGroup[0], '')
      })
    }

    if (geometry.type === "Polygon") {
      buildShape(coords[0], shouldCreateLabel ? name : '')
    }
  })

  scene.add(group)
  scene.add(edgesGroup)
  scene.add(labelsGroup)
  
  // 保存全局引用
  mapEdgesGroup = edgesGroup

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
          // 透明倒影不写入深度，避免旋转时出现黑块/遮挡异常
          newMat.depthWrite = false
          newMat.depthTest = true
          return newMat
        })
      } else {
        child.material = child.material.clone()
        child.material.transparent = true
        child.material.opacity = 0.2
        child.material.depthWrite = false
        child.material.depthTest = true
      }
    }
  })
  scene.add(reflectionGroup)

  // 地图入场动画：从底部（Z轴下方）升起
  const startZ = -50 // 起始位置（Z轴下方）
  const endZ = 0 // 目标位置
  const duration = 4000 // 动画时长（毫秒）
  const startTime = Date.now()
  mapLiftZ = startZ
  
  // 初始位置在下方
  group.position.z = startZ
  edgesGroup.position.z = startZ
  labelsGroup.position.z = startZ
  // 入场动画完成前不显示行政区名称，避免“地图未升起但名字先出现”
  labelsGroup.visible = false
  // 倒影初始位置：因为 scale.z = -0.3，需要反向计算
  reflectionGroup.position.z = startZ
  
  // 动画函数
  function animateEntrance() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用 easeOutCubic 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    const currentZ = startZ + (endZ - startZ) * easeProgress
    mapLiftZ = currentZ
    group.position.z = currentZ
    edgesGroup.position.z = currentZ
    labelsGroup.position.z = currentZ
    // 倒影同步移动（保持与地图相同的 Z 位置）
    reflectionGroup.position.z = currentZ
    
    if (progress < 1) {
      requestAnimationFrame(animateEntrance)
    } else {
      labelsGroup.visible = true
    }
  }
  
  animateEntrance()

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

    // 顶面材质 - 深蓝青色半透明（参考图片配色）
    const topMaterial = new THREE.MeshLambertMaterial({
      color: "#1a3a5c",
      transparent: true,
      opacity: 0.85
    })

    // 侧面材质 - 青蓝色发光感
    const sideMaterial = new THREE.MeshPhongMaterial({
      color: "#2a8bc2",
      transparent: true,
      opacity: 0.9,
      shininess: 30,
      specular: "#4FB5D1",
      flatShading: false
    })

    // 计算顶点法线使侧面更平滑
    geometry.computeVertexNormals()

    const mesh = new THREE.Mesh(geometry, [topMaterial, sideMaterial])
    mesh.userData = {
      districtName: labelName || '',
      base: {
        topColor: topMaterial.color.getHex(),
        sideColor: sideMaterial.color.getHex(),
        topOpacity: topMaterial.opacity,
        sideOpacity: sideMaterial.opacity,
        sideEmissive: sideMaterial.emissive ? sideMaterial.emissive.getHex() : 0x000000,
        sideEmissiveIntensity: sideMaterial.emissiveIntensity ?? 0
      }
    }
    group.add(mesh)
    districtMeshes.push(mesh)

    // 发光边框线 - 青蓝色发光轮廓
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#00d4ff",
      linewidth: 5,
      transparent: true,
      opacity: 0.8
    })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    edgesGroup.add(line)

    // 添加第二层轮廓线增强发光效果
    const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, p.y, p.z - 0.5))
    )
    const lineMaterial2 = new THREE.LineBasicMaterial({
      color: "#00a8cc",
      linewidth: 3,
      transparent: true,
      opacity: 0.4
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
      color: "#0088aa",
      linewidth: 3,
      transparent: true,
      opacity: 0.5
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
  // 场景底色：避免默认黑色露出导致“黑边/黑底”不好看
  // 这里用深蓝底，和系统大屏风格更统一
  scene.background = new THREE.Color("#061A2E")

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
  // 相机位置：保持方向不变，按比例缩放到距离 242.58
  // 原向量 (-0.64, -95.76, 175.50)，模长 ≈ 200.09
  const initDir = new THREE.Vector3(-6.63, -185.83, 158.00).normalize()
  const initDist = 242.58
  camera.position.copy(initDir.multiplyScalar(initDist))
  // 将相机的“上方”设为 Z 轴（因为地图在 XY 平面展开，Z 轴是高度方向）
  camera.up.set(0, 0, 1)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })

  renderer.setSize(width, height)
  renderer.setClearColor(new THREE.Color("#061A2E"), 1)

  threeRef.value.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  pointerNdc = new THREE.Vector2()

  // 初始化后期处理 - 选择性 Bloom 发光效果
  // 创建两个 composer：一个用于正常渲染，一个用于 Bloom
  const renderScene = new RenderPass(scene, camera)
  
  // 正常渲染 composer
  composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  
  // Bloom composer（只渲染发光层）
  bloomComposer = new EffectComposer(renderer)
  const bloomRenderPass = new RenderPass(scene, camera)
  bloomComposer.addPass(bloomRenderPass)
  
  // Bloom 效果
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    2.5,  // 强度
    0.6,  // 半径
    0.2   // 阈值
  )
  bloomComposer.addPass(bloomPass)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  // 上下弧度范围：0（俯视） ~ 1.026（58.8°）
  // 说明：贴近 0 可能会翻转，这里用 0.001 代替 0
  controls.minPolarAngle = 0.001
  controls.maxPolarAngle = 1.292
  // 允许更自由的旋转，但保持一定限制
  // 固定缩放距离为 245.46，禁止缩放
  const distance = 77
  controls.minDistance = distance
  controls.maxDistance = 465.18
    // 禁止所有鼠标操作
  // controls.enablePan = false      // 禁止平移
  // controls.enableRotate = false   // 禁止旋转
  // controls.enableZoom = false     // 禁止缩放
  
  // 设置目标点，Y值往上偏移让地图整体上移
  controls.target.set(0, -5, 0)
  controls.update()

  // 初始化视角：使用调试确认的相机位置
  {
    camera.position.set(1.89, -127.25, 164.22)
    camera.lookAt(controls.target)
    controls.update()
  }

  // 监听鼠标操作，打印相机位置和当前 polar 角度
  controls.addEventListener('change', () => {
    const dist = camera.position.distanceTo(controls.target)
    const polarRad = Math.acos(camera.position.z / dist)
    const polarDeg = (polarRad * 180 / Math.PI).toFixed(1)
    console.log(`polar角度: ${polarDeg}° (弧度: ${polarRad.toFixed(3)})`, '| Camera:', {
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

  // 坐标轴辅助器：调试用，生产关闭

  // 创建背景平面
  createBackgroundPlane()

  // 创建动态光环效果
  createRippleEffect()

  createMap()

  // 鼠标移入高亮行政区
  renderer.domElement.addEventListener("pointermove", onPointerMove)
  renderer.domElement.addEventListener("pointerleave", onPointerLeave)
  
  // 延迟加载：等地图升起动画完成后再加载特效/点位
  uiReadyTimer = setTimeout(() => {
    createOutlineRunner()
    loadBusinessPoints()
    // 通知外层：模型主动画与核心资源已就绪（左右面板可入场）
    emit("ready")
  }, 4000)

  animate()

  mapReady.value = true
}

function setDistrictHover(mesh) {
  if (!mesh || !Array.isArray(mesh.material) || mesh.material.length < 2) return
  const [topMat, sideMat] = mesh.material
  topMat.color.set(DISTRICT_HOVER_STYLE.topColor)
  topMat.opacity = DISTRICT_HOVER_STYLE.topOpacity

  sideMat.color.set(DISTRICT_HOVER_STYLE.sideColor)
  sideMat.opacity = DISTRICT_HOVER_STYLE.sideOpacity
  if (sideMat.emissive) {
    sideMat.emissive.set(DISTRICT_HOVER_STYLE.emissive)
    sideMat.emissiveIntensity = DISTRICT_HOVER_STYLE.emissiveIntensity
  }
}

function restoreDistrictBase(mesh) {
  if (!mesh || !Array.isArray(mesh.material) || mesh.material.length < 2) return
  const base = mesh.userData?.base
  if (!base) return

  const [topMat, sideMat] = mesh.material
  topMat.color.setHex(base.topColor)
  topMat.opacity = base.topOpacity

  sideMat.color.setHex(base.sideColor)
  sideMat.opacity = base.sideOpacity
  if (sideMat.emissive) {
    sideMat.emissive.setHex(base.sideEmissive)
    sideMat.emissiveIntensity = base.sideEmissiveIntensity
  }
}

function pickDistrict(clientX, clientY) {
  if (!raycaster || !pointerNdc || !camera || !renderer) return null
  if (!districtMeshes || districtMeshes.length === 0) return null

  const rect = renderer.domElement.getBoundingClientRect()
  pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
  pointerNdc.y = -(((clientY - rect.top) / rect.height) * 2 - 1)

  raycaster.setFromCamera(pointerNdc, camera)
  const hits = raycaster.intersectObjects(districtMeshes, false)
  return hits.length ? hits[0].object : null
}

function onPointerMove(e) {
  const hit = pickDistrict(e.clientX, e.clientY)
  if (hit === hoveredDistrict) return

  if (hoveredDistrict) restoreDistrictBase(hoveredDistrict)
  hoveredDistrict = hit

  if (hoveredDistrict) {
    setDistrictHover(hoveredDistrict)
    renderer.domElement.style.cursor = "pointer"
  } else {
    renderer.domElement.style.cursor = ""
  }
}

function onPointerLeave() {
  if (hoveredDistrict) restoreDistrictBase(hoveredDistrict)
  hoveredDistrict = null
  if (renderer?.domElement) renderer.domElement.style.cursor = ""
}

// 渲染循环
function animate() {

  animationId = requestAnimationFrame(animate)
  
  // 更新光环动画
  updateRippleAnimation()

  // 业务点位入场动画（渐显+弹性缩放）
  updateBusinessPointsAnimation()
  
  // 更新高亮线条动画
  // 更新沿外轮廓跑动的荧光段（跟随同一 progress）
  updateOutlineRunner()
  
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

  if (uiReadyTimer) {
    clearTimeout(uiReadyTimer)
    uiReadyTimer = null
  }

  if (renderer?.domElement) {
    renderer.domElement.removeEventListener("pointermove", onPointerMove)
    renderer.domElement.removeEventListener("pointerleave", onPointerLeave)
  }

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