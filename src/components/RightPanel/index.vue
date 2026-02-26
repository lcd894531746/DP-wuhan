<template>
  <section class="panel right-panel">
    <div class="right-block-3">
      <div
        class="right-block-title"
        v-for="value in sourceData"
        :key="value.label"
      >
        <div class="label">{{ value.label }}</div>
        <div class="value">{{ value.value }}</div>
        <div
          class="icon"
          :style="{ backgroundImage: `url(${value.icon})` }"
        ></div>
      </div>
    </div>
    <div class="block right-block-1">
      <div class="block-title">质量板块</div>
      <div class="block-body">
        <div class="quality-control">
          <div class="safe-days-label">
            <div class="safe-days-label-icon">
              <img
                style="width: 28px; height: 20px"
                src="@/assets/images/sub-icon.png"
                alt="质量管控"
              />
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
                <span
                  class="inspection-number inspection-number-warning number-2"
                  >21</span
                >
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
                <span
                  class="inspection-number inspection-number-warning number-2"
                  >12</span
                >
              </div>
            </div>
            <div class="inspection-item">
              <div class="inspection-title mb-20">一次性检验合格率</div>
              <div class="inspection-row">
                <span class="inspection-number number-1" style="font-size: 16px"
                  >156</span
                >
                <span class="inspection-number number-1" style="font-size: 16px"
                  >90%</span
                >
              </div>
            </div>
            <div class="inspection-item">
              <div class="inspection-title mb-20">超期未检测统计</div>
              <div class="inspection-row">
                <span></span>
                <span
                  class="inspection-number inspection-number-warning number-2"
                  style="font-size: 16px"
                  >1260</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="iot-line"></div>
        <div class="maintenance">
          <div class="maintenance-header">
            <div class="safe-days-label">
              <div class="safe-days-label-icon">
                <img
                  style="width: 28px; height: 20px"
                  src="@/assets/images/sub-icon.png"
                  alt="维保"
                />
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
            <div class="weibao-chart-wrap">
              <div ref="weibaoChartRef" class="weibao-chart"></div>
              <div class="weibao-center">
                <span class="weibao-total">{{ weibaoStats.total }}</span>
                <span class="weibao-unit">件</span>
              </div>
              <div class="weibao-legend">
                <div class="weibao-legend-item">
                  <span class="weibao-dot weibao-dot-blue"></span>
                  <span>已完成 {{ weibaoStats.completed }}件</span>
                </div>
                <div class="weibao-legend-item">
                  <span class="weibao-dot weibao-dot-yellow"></span>
                  <span>未完成 {{ weibaoStats.uncompleted }}件</span>
                </div>
              </div>
            </div>
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
            <div class="table-row finished-row">
              <span>已完成</span>
              <span>2台</span>
              <span>23台</span>
              <span>80台</span>
              <span>140台</span>
            </div>
            <div class="table-row unfinished-row">
              <span>未完成</span>
              <span>0台</span>
              <span>5台</span>
              <span>12台</span>
              <span>20台</span>
            </div>
          </div>
        </div>
        <div class="iot-line-2"></div>
        <div class="internal-check">
          <div class="sub-title repair-icon">内检</div>
          <div class="data-table">
            <div class="table-row header">
              <span></span>
              <span>日</span>
              <span>周</span>
              <span>月</span>
              <span>年</span>
            </div>
            <div class="table-row finished-row">
              <span>已完成</span>
              <span>5台</span>
              <span>30台</span>
              <span>95台</span>
              <span>180台</span>
            </div>
            <div class="table-row unfinished-row">
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
          <div class="safe-days-label">
            <div class="safe-days-label-icon">
              <img
                style="width: 28px; height: 20px"
                src="@/assets/images/sub-icon.png"
                alt="质量管控"
              />
            </div>
            <div class="safe-days-label-text">预警管理</div>
          </div>

          <div class="safe-days-label warning-type">
            <div class="safe-days-label-icon">
              <img
                style="width: 38px; height: 30px"
                src="@/assets/images/icon-24.png"
                alt="预警类型"
              />
            </div>
            <div class="safe-days-label-text">预警类型</div>
          </div>
        </div>
        <div class="warning-content">
          <div class="left"></div>
          <div class="right">
            <div class="block1">
              <div class="number">5条</div>
              <div class="text">安全预警</div>
            </div>
            <div class="block2">
              <div class="number">10条</div>
              <div class="text">系统预警</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import icon16 from "@/assets/images/icon-16.png";
import icon17 from "@/assets/images/icon-17.png";
import icon18 from "@/assets/images/icon-18.png";
import icon19 from "@/assets/images/icon-19.png";
import icon20 from "@/assets/images/icon-20.png";
import icon21 from "@/assets/images/icon-21.png";

import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

// 数据可后续从 props 或 store 接入
const sourceData = ref([
  {
    label: "项目总数",
    value: "12345",
    icon: icon16,
  },
  {
    label: "总台数",
    value: "12345",
    icon: icon17,
  },
  {
    label: "按需维保数",
    value: "12345",
    icon: icon18,
  },
  {
    label: "物联网数",
    value: "12345",
    icon: icon19,
  },
  {
    label: "AI视频数",
    value: "12345",
    icon: icon20,
  },
  {
    label: "加装五方对讲",
    value: "12345",
    icon: icon21,
  },
]);

// 维保环形图
const weibaoChartRef = ref(null);
let weibaoChartInstance = null;
const weibaoStats = ref({
  total: 100,
  completed: 60,
  uncompleted: 40,
});

function initWeibaoChart() {
  if (!weibaoChartRef.value) return;
  weibaoChartInstance = echarts.init(weibaoChartRef.value);
  const { completed, uncompleted } = weibaoStats.value;
  const pieData = [
    { name: "已完成", value: completed },
    { name: "未完成", value: uncompleted },
  ];
  weibaoChartInstance.setOption({
    color: ["#01ACFB", "#FBD501"],
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}件 ({d}%)",
    },
    grid: {
      top: "10%",
      left: "10%",
      right: "10%",
      bottom: "10%",
    },
    series: [
      // 内层：稍暗的扇形，从圆心一直延续到外层环内边
      {
        type: "pie",
        radius: ["0%", "55%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: pieData,
        itemStyle: {
          borderColor: "rgba(0,0,0,0.25)",
          borderWidth: 1,
          color: (params) =>
            params.dataIndex === 0 ? "#01608a" : "#b8960a",
        },
      },
      // 外层：亮色扇形环
      {
        type: "pie",
        radius: ["55%", "80%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: pieData,
        itemStyle: {
          borderColor: "rgba(0,0,0,0.2)",
          borderWidth: 1,
        },
      },
    ],
  });
}

function handleWeibaoResize() {
  if (weibaoChartInstance) weibaoChartInstance.resize();
}

onMounted(() => {
  initWeibaoChart();
  window.addEventListener("resize", handleWeibaoResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWeibaoResize);
  if (weibaoChartInstance) {
    weibaoChartInstance.dispose();
    weibaoChartInstance = null;
  }
});
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
    background: url("@/assets/images/icon-13.png") no-repeat center;
    background-size: 100% 100%;
    margin-top: 18px;
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
      color: #ffffff;
    }
    .value {
      color: #95dbfb;
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
  border: 1px dashed #2064a4;
  margin: 18px 14px 18px 14px;
}
.iot-line-2 {
  height: 1px;
  border: 1px dashed #2064a4;
  margin: 18px 0px 18px 0px;
}
.repair-icon {
  position: relative;
  margin-left: 38px;
  &::before {
    content: "";
    position: absolute;
    left: -37px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 35px;
    background: url("@/assets/images/icon-22.png") no-repeat center;
    background-size: 100% 100%;
  }
  &::after {
    content: "";
    position: absolute;
    left: -31px;
    top: 44%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    background: url("@/assets/images/icon-23.png") no-repeat center;
    background-size: 100% 100%;
  }
}

.right-block-2 {
  width: 404px;
  height: 193px;
  overflow: hidden;
  background: url("@/assets/images/icon-12.png") no-repeat center;
  background-size: 100% 100%;
  .warning-content {
    display: flex;
    align-items: center;
    .left {
      width: 107px;
      height: 92px;

      position: relative;
      background: url("@/assets/images/icon-2.png") no-repeat center center;
      background-size: 100% 100%;

      &::after {
        content: "";
        display: block;
        width: 40px;
        height: 39px;
        position: absolute;
        left: 45%;
        transform: translateX(-50%);
        background: url("@/assets/images/icon-25.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }
    .right{
      display: flex;
      gap: 10px;
      .block1 {
        width: 135px;
        height: 68px;
        background: url("@/assets/images/icon-26.png") no-repeat  center center;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .text {
          margin-top: 14px;
          font-family: Adobe Heiti Std;
          font-weight: normal;
          font-size: 16px;
          color: #00E4FF;
        }
      }
      .block2 {
        width: 135px;
        height: 68px;
        background: url("@/assets/images/icon-26.png") no-repeat  center center;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .text {
          margin-top: 14px;
          font-family: Adobe Heiti Std;
          font-weight: normal;
          font-size: 16px;
          color: #00E4FF;
        }
      }
    }
  }
}

.right-block-1 {
  width: 404px;
  height: 783px;
  overflow: hidden;
  background: url("@/assets/images/icon-11.png") no-repeat center;
  background-size: 100% 100%;
}

.block-title {
  font-family: FZCuHeiSongS-B-GB, "Microsoft YaHei", sans-serif;
  font-weight: 400;
  font-size: 26px;
  color: #ffffff;
  line-height: 48px;
  margin-left: 50px;
  /* text-shadow: 0px 10px 3px rgba(27, 29, 31, 0.64); */
  background: linear-gradient(0deg, #ffffff 17.26%, #01befc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.block-body {
  padding: 0 9px 0px;
}

.safe-days-label {
  font-family: "Microsoft YaHei", sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  /* margin: 10px 0; */
  display: flex;
  align-items: center;
  gap: 10px;
}

.sub-title {
  font-family: "Microsoft YaHei", sans-serif;
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
  .weibao-content {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.weibao-chart-wrap {
  position: relative;
  width: 100%;
  height: 104px;
  display: flex;
  align-items: center;
  padding:0 40px;
  box-sizing: border-box;
}

.weibao-chart {
  width: 140px;
  height: 104px;
  flex-shrink: 0;
  background: url("@/assets/images/icon-30.png") no-repeat center center;
  background-size: 100% 100%;
  margin-right: 50px;
}

.weibao-center {
  position: absolute;
  left: 28%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: baseline;
  gap: 2px;
  pointer-events: none;
}

.weibao-total {
  font-family: "Microsoft YaHei", sans-serif;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
}

.weibao-unit {
  font-size: 10px;
  color: #e5f2ff;
}

.weibao-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 8px;
  font-size: 12px;
  color: #e5f2ff;
}

.weibao-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.weibao-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.weibao-dot-blue {
  background: #01acfb;
}

.weibao-dot-yellow {
  background: #fbd501;
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
  background: url("@/assets/images/icon-14.png") no-repeat center;
  background-size: 100% 100%;
  color: #e5f2ff;
  font-size: 13px;
  font-family: "Microsoft YaHei", sans-serif;
  padding: 12px 16px;

  .number-1 {
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    background: linear-gradient(0deg, #01acfb 0%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .number-2 {
    font-family: Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    background: linear-gradient(0deg, #fbd501 0%, #ffffff 100%);
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
  font-family: "YouSheBiaoTiHei", "Microsoft YaHei", sans-serif;
  font-size: 18px;
  color: #5de1ff;
}

.inspection-number-warning {
  color: #ffd75e;
}

.date-tabs {
  display: flex;
  gap: 12px;
  background: url("@/assets/images/icon-15.png") no-repeat center;
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
  color: #fcfdfe;
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
  width: auto;
  margin: 0 24px;
  border: 1px solid rgba(74, 160, 255, 0.8);
  border-collapse: collapse;
  background: rgba(0, 64, 64, 0.45);
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr 1fr;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid rgba(74, 160, 255, 0.8);
}

.table-row.header {
  color: #ffffff;
  font-family: "Microsoft YaHei", sans-serif;
  font-weight: 500;
}

.table-row span {
  padding: 6px 0;
  text-align: center;
  border-right: 1px solid rgba(74, 160, 255, 0.8);
}

.table-row span:first-child {
  padding-left: 0;
}

.table-row span:last-child {
  border-right: none;
}

.finished-row span {
  color: #5ad68a;
}

.finished-row span:first-child {
  font-family: "Microsoft YaHei", sans-serif;
  font-weight: 500;
}

.unfinished-row span {
  color: #f6c94c;
}

.unfinished-row span:first-child {
  font-family: "Microsoft YaHei", sans-serif;
  font-weight: 500;
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
.warning-mgmt {
  display: flex;
  align-items: center;
  .warning-type {
    margin-left: 60px;
  }
}
</style>
