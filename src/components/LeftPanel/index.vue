<template>
  <section class="panel left-panel">
    <!-- 安全板块 -->
    <div class="left-block-1">
      <div class="block-title">安全板块</div>
      <div class="block-body">
        <div class="safe-days">
          <div class="safe-days-label">
            <div class="safe-days-label-icon">
              <img style="width: 28px; height: 20px;" src="@/assets/images/sub-icon.png" alt="安全运行天数">
            </div>
            <div class="safe-days-label-text">企业安全运行天数</div>
          </div>
          <div class="safe-days-counter">
            <span v-for="(d, i) in safeDays" :key="i" class="digit-box">
              <span class="digit">{{ d }}</span>
            </span>
            <span class="unit">天</span>
          </div>
          <div class="rescue-box">
            <span class="rescue-label">963333救援</span>
            <span class="rescue-num">12</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 管理板块 -->
    <div class="left-block-2">
      <div class="block-title">管理板块</div>
      <div class="block-body">
        <div class="manage-circles">
          <div v-for="item in manageStats" :key="item.label" class="manage-card">
            <div class="manage-circle">
              <div class="manage-icon" :style="{ backgroundImage: `url(${item.icon})` }"></div>
            </div>
            <div class="manage-info">
              <div class="manage-num">{{ item.value }}</div>
              <div class="manage-label">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统板块 -->
    <div class="left-block-3">
      <div class="block-title">系统板块</div>
      <div class="block-body">
        <div class="system-iot">
          <div class="safe-days-label">
            <div class="safe-days-label-icon">
              <img style="width: 38px; height: 33px;" src="@/assets/images/icon-1.png" alt="物联网感知系统">
            </div>
            <div class="safe-days-label-text">物联网感知系统</div>
          </div>
          <div class="iot-row">
            <div class="iot-visual-placeholder"></div>
            <div class="iot-data">
              <div class="iot-table">
                <div class="iot-header">
                  <span class="iot-cell">正常</span>
                  <span class="iot-cell">故障</span>
                  <span class="iot-cell iot-cell-warn">预警</span>
                </div>
                <div class="iot-values">
                  <span class="iot-cell">{{ iotStats.normal }}</span>
                  <span class="iot-cell">{{ iotStats.fault }}</span>
                  <span class="iot-cell iot-cell-warn">{{ iotStats.warn }}</span>
                </div>
              </div>
              <div class="iot-rate-row">
                <div class="iot-rate-box">
                  <span class="rate-num">{{ iotStats.iotOnline }}%</span>
                  <span class="rate-label">物联网在线率</span>
                </div>
                <div class="iot-rate-box">
                  <span class="rate-num">{{ iotStats.intercomOnline }}%</span>
                  <span class="rate-label">五方对讲在线率</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="iot-line"></div>
        <div class="elevator-brand">
          <div class="elevator-brand-header">
            <div class="safe-days-label">
              <div class="safe-days-label-icon">
                <img style="width: 28px; height: 20px;" src="@/assets/images/sub-icon.png" alt="电梯品牌和使用年限">
              </div>
              <div class="safe-days-label-text">电梯品牌和使用年限</div>
            </div>
            <div class="brand-tabs">
              <div class="tab" :class="{ active: activeBrandTab === 'brand' }" @click="activeBrandTab = 'brand'">
                品牌
              </div>
              <div class="tab" :class="{ active: activeBrandTab === 'year' }" @click="activeBrandTab = 'year'">
                年限
              </div>
            </div>
          </div>
          <div class="pie-chart-row">
            <div class="pie-chart-placeholder"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import manageIcon1 from '@/assets/images/manage-icon-1.png'
import manageIcon2 from '@/assets/images/manage-icon-2.png'
import manageIcon3 from '@/assets/images/manage-icon-3.png'
import manageIcon4 from '@/assets/images/manage-icon-4.png'

const safeDays = ref(['0', '0', '7', '3', '2'])

const manageStats = ref([
  { value: 84, label: '公司在岗人数', icon: manageIcon1 },
  { value: 82, label: '今日签到人数', icon: manageIcon2 },
  { value: 34, label: '一事两报次数', icon: manageIcon3 },
  { value: 36, label: '企业C级人员(安全管控人员)', icon: manageIcon4 },
])

const iotStats = ref({
  normal: 2489,
  fault: 3,
  warn: 50,
  iotOnline: 90,
  intercomOnline: 90,
})

const activeBrandTab = ref('brand')
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
}

.left-panel {
  width: 404px;
  flex-shrink: 0;
  overflow: hidden;
}

.left-block-1 {
  background: url('@/assets/images/left-1.png') no-repeat center;
  background-size: 100% 100%;
  width: 404px;
  height: 252px;
  overflow: hidden;
}

.left-block-2 {
  background: url('@/assets/images/left-1-2.png') no-repeat center;
  background-size: 100% 100%;
  width: 404px;
  height: 216px;
  overflow: hidden;
}

.left-block-3 {
  width: 404px;
  /* height: 503px; */
  overflow: hidden;
  background: url('@/assets/images/left-block-3.png') no-repeat center;
  background-size: 100% 100%;
}

.block-title {
  font-family: FZCuHeiSongS-B-GB, 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  font-size: 26px;
  color: #ffffff;
  line-height: 48px;
  margin-left: 50px;
  text-shadow: 0px 10px 3px rgba(27, 29, 31, 0.64);
  background: linear-gradient(0deg, #ffffff 17.26%, #01befc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.block-body {
  padding: 0 9px 0px;
}

.sub-title {
  font-size: 14px;
  color: #7eb8da;
  margin: 8px 0 12px;
}

.safe-days-label {
  font-family: 'Microsoft YaHei', sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.safe-days-counter {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.digit-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 47px;
  background-image: url('@/assets/images/number.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.digit {
  font-family: YouSheBiaoTiHei, 'YouShe BiaoTi Hei', sans-serif;
  font-weight: 400;
  font-size: 27px;
  color: #ffffff;
  line-height: 34px;
  background: linear-gradient(0deg, #3fa4f6 0%, #f7fdff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.unit {
  font-family: YouSheBiaoTiHei, 'YouShe BiaoTi Hei', sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: #ffffff;
  line-height: 34px;
  background: linear-gradient(0deg, #3fa4f6 0%, #f7fdff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rescue-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 34px;
  background: url('@/assets/images/left-1-1.png') no-repeat center center;
  background-size: 100% 100%;
  width: 337px;
  height: 80px;
  position: relative;
}

.rescue-label {
  font-family: 'Microsoft YaHei', sans-serif;
  font-weight: bold;
  font-size: 18px;
  color: #fafbfc;
}

.rescue-num {
  font-family: 'Microsoft YaHei', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
  background: linear-gradient(0deg, #fbd501 0%, #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.manage-circles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  padding: 8px 29px;
}

.manage-card {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.manage-circle {
  min-width: 60px !important;
  min-height: 60px !important;
  height: 60px !important;
  background: url('@/assets/images/manage-circle.png') no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manage-icon {
  width: 24px !important;
  height: 24px !important;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.manage-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.manage-num {
  font-family: Microsoft YaHei;
  font-weight: bold;
  font-size: 18px;
  color: #FCFCFC;
  background: linear-gradient(0deg, #FFFFFF 0%, #01BEFC 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.manage-label {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 12px;
  color: #FCFCFC;
}

.system-iot {
  margin-bottom: 20px;
}

.iot-line {
  height: 1px;
  border: 1px dashed #2064A4;
  margin: 0 14px 22px 14px;
}

.iot-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
}

.iot-visual-placeholder {
  width: 114px;
  height: 97px;
  position: relative;
  background: url('@/assets/images/icon-2.png') no-repeat center center;
  background-size: 100% 100%;

  &::after {
    content: '';
    display: block;
    width: 39px;
    height: 41px;
    position: absolute;
    left: 45%;
    transform: translateX(-50%);
    background: url('@/assets/images/icon-3.png') no-repeat center center;
    background-size: 100% 100%;
  }
}

.iot-data {
  flex: 1;
  min-width: 0;
}

.iot-table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  margin-bottom: 12px;
  background: url('@/assets/images/icon-4.png') no-repeat center center;
  background-size: 100% 100%;
  /* width: 273px; */
  height: 67px;
}

.iot-header,
.iot-values {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.iot-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  text-align: center;
  font-size: 14px;
  color: #E9F4FF;
}


.iot-values .iot-cell {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.iot-rate-row {
  display: flex;
  gap: 5px;
}

.iot-rate-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: url('@/assets/images/icon-5.png') no-repeat center center;
  background-size: 100% 100%;
  height: 67px;
}

.rate-num {
  font-weight: 700;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  color: #E9F4FF;
}

.rate-label {
  font-family: Adobe Heiti Std;
  font-weight: normal;
  font-size: 16px;
  color: #00E4FF;
}

.elevator-brand {
  margin-top: 4px;
}

.elevator-brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.elevator-brand .safe-days-label {
  margin: 10px 0 10px 0;
  display: inline-flex;
  align-items: center;
}

.elevator-brand .brand-tabs {
  margin-bottom: 0;
  display: inline-flex;
  margin-left: 8px;
  vertical-align: middle;
}

.tab {
  width: 89px;
  height: 25px;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  background: url('@/assets/images/icon-8.png') no-repeat center center;
  background-size: 100% 100%;
  margin-left: 10px;
}

.tab.active {
  background: url('@/assets/images/icon-7.png') no-repeat center center;
}

.pie-chart-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  background: url('@/assets/images/icon-6.png') no-repeat center center;
  background-size: 100% 100%;
  width: 385px;
  height: 179px;
}

.pie-chart-placeholder {
  background: url('@/assets/images/icon-9.png') no-repeat center center;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: 183px 114px;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 146px;
    height: 104px;
    background: url('@/assets/images/icon-10.png') no-repeat center center;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #e2e8f0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.dot-yellow {
  background: #fbd501;
}

.dot-blue {
  background: #0f172a;
  border: 1px solid #38bdf8;
}

.dot-cyan {
  background: #38bdf8;
}
</style>
