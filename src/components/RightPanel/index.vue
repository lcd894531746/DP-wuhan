<template>
  <section class="panel right-panel">
    <div class="block right-block-1">
      <div class="block-title">质量板块</div>
      <div class="block-body">
        <div class="quality-control">
          <div class="safe-days-label">
            <div class="safe-days-label-icon">
              <img style="width: 28px; height: 20px" src="@/assets/images/sub-icon.png" alt="质量管控" />
            </div>
            <div class="safe-days-label-text">质量管控</div>
          </div>
          <div class="inspection">
            <div class="inspection-item">
              <div class="inspection-title">检验检测</div>
              <div class="inspection-row">
                <span>合格</span>
                <span class="inspection-number number-1">56</span>
              </div>
              <div class="inspection-row">
                <span>不合格</span>
                <span class="inspection-number inspection-number-warning number-2">21</span>
              </div>
            </div>
            <div class="inspection-item">
              <div class="inspection-title">三方抽检</div>
              <div class="inspection-row">
                <span>合格</span>
                <span class="inspection-number number-1">62</span>
              </div>
              <div class="inspection-row">
                <span>不合格</span>
                <span class="inspection-number inspection-number-warning number-2">12</span>
              </div>
            </div>
            <div class="inspection-item">
              <div class="inspection-title mb-20">一次性检验合格率</div>
              <div class="inspection-row">
                <span class="inspection-number number-1 " style="font-size: 16px;">156</span>
                <span class="inspection-number number-1" style="font-size: 16px;">90%</span>
              </div>
            </div>
            <div class="inspection-item">
              <div class="inspection-title mb-20">超期未检测统计</div>
              <div class="inspection-row">
                <span></span>
                <span class="inspection-number inspection-number-warning number-2" style="font-size: 16px;">1260</span>
              </div>
            </div>
          </div>
        </div>
        <div class="iot-line"></div>
        <div class="maintenance">
          <div class="maintenance-header">
            <div class="safe-days-label">
              <div class="safe-days-label-icon">
                <img style="width: 28px; height: 20px" src="@/assets/images/sub-icon.png" alt="维保" />
              </div>
              <div class="safe-days-label-text">维保</div>
            </div>
            <div class="date-tabs">
              <span class="tab active">日</span>
              <span class="tab">周</span>
              <span class="tab">月</span>
              <span class="tab">年</span>
            </div>
          </div>
          <div class="weibao-content">
            
          </div>
        </div>
        <div class="iot-line-2"></div>
        <div class="repair">
          <div class="sub-title repair-icon">修理</div>
          <div class="data-table">
            <div class="table-row header">
              <span></span>
              <span>日</span>
              <span>周</span>
              <span>月</span>
              <span>年</span>
            </div>
            <div class="table-row">
              <span>已完成</span>
              <span>2台</span>
              <span>23台</span>
              <span>80台</span>
              <span>140台</span>
            </div>
            <div class="table-row">
              <span>未完成</span>
              <span>0台</span>
              <span>5台</span>
              <span>12台</span>
              <span>20台</span>
            </div>
          </div>
        </div>
        <div class="internal-check">
          <div class="sub-title">● 内检</div>
          <div class="data-table">
            <div class="table-row header">
              <span></span>
              <span>日</span>
              <span>周</span>
              <span>月</span>
              <span>年</span>
            </div>
            <div class="table-row">
              <span>已完成</span>
              <span>5台</span>
              <span>30台</span>
              <span>95台</span>
              <span>180台</span>
            </div>
            <div class="table-row">
              <span>未完成</span>
              <span>1台</span>
              <span>8台</span>
              <span>15台</span>
              <span>25台</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="block right-block-2">
      <div class="block-title">应急板块</div>
      <div class="block-body">
        <div class="warning-mgmt">
          <div class="sub-title">◇ 预警管理</div>
          <div class="warning-buttons">
            <div class="warning-btn">
              <span class="warn-icon">⚡</span>
              <span>5条 安全预警</span>
            </div>
            <div class="warning-btn">
              <span class="warn-icon">⚡</span>
              <span>10条 系统预警</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="right-block-3">
      <div class="right-block-title" v-for="value in sourceData" :key="value.label">
        <div class="label">{{ value.label }}</div>
        <div class="value">{{ value.value }}</div>
        <div class="icon" :style="{ backgroundImage: `url(${value.icon})` }"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import icon16 from '@/assets/images/icon-16.png'
import icon17 from '@/assets/images/icon-17.png'
import icon18 from '@/assets/images/icon-18.png'
import icon19 from '@/assets/images/icon-19.png'
import icon20 from '@/assets/images/icon-20.png'
import icon21 from '@/assets/images/icon-21.png'

import { ref } from 'vue'
// 数据可后续从 props 或 store 接入
const sourceData = ref([
  {
    label: '项目总数',
    value: '12345',
    icon: icon16
  },
  {
    label: '总台数',
    value: '12345',
    icon: icon17
  },
  {
    label: '按需维保数',
    value: '12345',
    icon: icon18
  },
  {
    label: '物联网数',
    value: '12345',
    icon: icon19
  },
  {
    label: 'AI视频数',
    value: '12345',
    icon: icon20
  },
  {
    label: '加装五方对讲',
    value: '12345',
    icon: icon21
  },
])
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.right-block-3 {
  position: absolute;
  left: -195px;
  top: 0;

  .right-block-title {
    position: relative;
    width: 187px;
    height: 64px;
    background: url('@/assets/images/icon-13.png') no-repeat center;
    background-size: 100% 100%;
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ffffff;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    padding-left: 27px;
    .label {
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
    }
    .value {
      color: #95DBFB;
      font-family: YouSheBiaoTiHei;
    }
    .icon {
      position: absolute;
      left: 22px;
      top: 50%;
      transform: translateY(-50%);
      width: 22px;
      height: 24px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

.iot-line {
  height: 1px;
  border: 1px dashed #2064A4;
  margin: 18px 14px 18px 14px;
}
.iot-line-2 {
  height: 1px;
  border: 1px dashed #2064A4;
  margin: 18px 0px 18px 0px;
}
.repair {

  .repair-icon {
    position: relative;
    margin-left: 38px;
    &::before {
      content: '';
      position: absolute;
      left: -37px;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 35px;
      background: url('@/assets/images/icon-22.png') no-repeat center;
      background-size: 100% 100%;
    }
    &::after {
      content: '';
      position: absolute;
      left: -31px;
      top: 44%;
      transform: translateY(-50%);
      width: 15px;
      height: 15px;
      background: url('@/assets/images/icon-23.png') no-repeat center;
      background-size: 100% 100%;
    }
  }
}

.right-block-2 {
  width: 404px;
  height: 193px;
  overflow: hidden;
  background: url('@/assets/images/icon-12.png') no-repeat center;
  background-size: 100% 100%;
}

.right-block-1 {
  width: 404px;
  height: 783px;
  overflow: hidden;
  background: url('@/assets/images/icon-11.png') no-repeat center;
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

.sub-title {
  font-family: 'Microsoft YaHei', sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.maintenance {
  .maintenance-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .weibao-content{
    width: 100%;
    height: 143px;
    background-color: #64748b;
  }
}

.inspection {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.inspection-item {
  width: 187px;
  height: 88px;
  background: url('@/assets/images/icon-14.png') no-repeat center;
  background-size: 100% 100%;
  color: #e5f2ff;
  font-size: 13px;
  font-family: 'Microsoft YaHei', sans-serif;
  padding: 12px 16px;

  .number-1 {
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #FFFFFF;
    background: linear-gradient(0deg, #01ACFB 0%, #FFFFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .number-2 {
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #FFFFFF;
    background: linear-gradient(0deg, #FBD501 0%, #FFFFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .mb-20 {
    margin-bottom: 20px;
  }
}

.inspection-title {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 8px;
}

.inspection-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.inspection-row span:first-child {
  color: #cbd5f5;
}

.inspection-number {
  font-family: 'YouSheBiaoTiHei', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  color: #5de1ff;
}

.inspection-number-warning {
  color: #ffd75e;
}

.date-tabs {
  display: flex;
  gap: 12px;
  background: url('@/assets/images/icon-15.png') no-repeat center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab {
  padding: 6px 16px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
}

.tab.active {
  /* border-bottom: 2px solid #00baff; */
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #FCFDFE;
}

.donut-placeholder {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-img {
  width: 80px;
  height: 80px;
  background: rgba(0, 186, 255, 0.1);
  border-radius: 50%;
  border: 8px solid rgba(0, 186, 255, 0.3);
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}

.data-table {
  font-size: 13px;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.table-row.header {
  color: #7eb8da;
}

.warning-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 186, 255, 0.1);
  border: 1px solid rgba(0, 186, 255, 0.3);
  border-radius: 6px;
}

.warn-icon {
  font-size: 24px;
}
</style>
