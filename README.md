# daping

基于 Vue 3 + Vite + autofit.js 的数据可视化大屏项目，适配各种分辨率屏幕。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **autofit.js** - 大屏自适应适配方案（设计稿 1920×1080）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## autofit.js 配置

项目在 `src/main.js` 中初始化 autofit.js：

```js
autofit.init({
  designHeight: 1080,
  designWidth: 1920,
  el: '#app',
  resize: true,
})
```

- `designWidth` / `designHeight`：设计稿尺寸，按 1920×1080 开发即可
- `el`：需要适配的根元素
- `resize`：窗口变化时自动重新计算

## 项目结构

```
daping/
├── src/
│   ├── App.vue      # 大屏主页面
│   ├── main.js      # 入口 + autofit 初始化
│   └── style.css    # 全局样式
├── index.html
├── package.json
└── vite.config.js
```

## 开发说明

- 按 **1920×1080** 设计稿尺寸进行开发，autofit.js 会自动缩放适配
- 使用 `px` 单位即可，无需手动换算
- 避免在 `body` 或根元素上使用 `!important` 强制覆盖宽高、缩放、变形原点
# daping
