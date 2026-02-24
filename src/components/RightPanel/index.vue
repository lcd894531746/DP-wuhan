<template>
  <section class="panel right-panel">
    <div class="block">
      <div class="block-title">>> 质量板块</div>
      <div class="block-body">
        <div class="quality-control">
          <div class="sub-title">◇ 质量管控</div>
          <div class="inspection">
            <div class="inspection-item">
              <span>检验检测</span>
              <span>总台数 12345</span>
              <span>合格 56</span>
              <span>不合格 21</span>
            </div>
            <div class="inspection-item">
              <span>三方抽检</span>
              <span>合格 62</span>
              <span>不合格 12</span>
            </div>
            <div class="inspection-item">
              <span>一次性检验合格率</span>
              <span>156 90%</span>
            </div>
            <div class="inspection-item">
              <span>超期未检测统计</span>
              <span>1260</span>
            </div>
          </div>
        </div>
        <div class="maintenance">
          <div class="sub-title">◇ 维保</div>
          <div class="date-tabs">
            <span class="tab active">日</span>
            <span class="tab">周</span>
            <span class="tab">月</span>
            <span class="tab">年</span>
          </div>
          <div class="donut-placeholder">
            <div class="donut-img"></div>
            <div class="donut-legend">
              <span>■ 已完成 60件</span>
              <span>■ 未完成 40件</span>
            </div>
          </div>
        </div>
        <div class="repair">
          <div class="sub-title">● 修理</div>
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

    <div class="block">
      <div class="block-title">>> 应急板块</div>
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
  </section>
</template>

<script setup>
// 数据可后续从 props 或 store 接入
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
}

.right-panel {
  width: 340px;
  flex-shrink: 0;
}

.block {
  background: rgba(8, 35, 65, 0.7);
  border: 1px solid rgba(0, 186, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.block-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #00baff;
  border-bottom: 1px solid rgba(0, 186, 255, 0.2);
}

.block-body {
  padding: 16px;
}

.sub-title {
  font-size: 14px;
  color: #7eb8da;
  margin-bottom: 12px;
}

.quality-control,
.maintenance,
.repair,
.internal-check {
  margin-bottom: 20px;
}

.internal-check {
  margin-bottom: 0;
}

.inspection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.inspection-item {
  font-size: 13px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.inspection-item span:first-child {
  color: #94a3b8;
  min-width: 120px;
}

.date-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.tab {
  padding: 6px 16px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
}

.tab.active {
  color: #00baff;
  border-bottom: 2px solid #00baff;
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
