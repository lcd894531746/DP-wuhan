/**
 * autofit-responsive.js v1.0.0（ES 模块版）
 * 响应式自适应解决方案 - 使用 CSS 变量和 viewport 单位
 */

export function autofitResponsive(config) {
  config = config || {}

  const designWidth = config.dw || 1920
  const designHeight = config.dh || 1080
  const renderDom = config.el || 'body'
  const resize = config.resize !== false
  let mode = config.mode || 'fit' // 'fit' 等比例适配, 'fill' 填满屏幕

  const dom = document.querySelector(renderDom)
  if (!dom) {
    console.error('autofit-responsive: 找不到渲染的dom,请检查传入的 el')
    return
  }

  function getScale() {
    const scaleX = window.innerWidth / designWidth
    const scaleY = window.innerHeight / designHeight

    if (mode === 'fit') {
      const scale = Math.min(scaleX, scaleY)
      return { x: scale, y: scale }
    } else {
      return { x: scaleX, y: scaleY }
    }
  }

  function setScale() {
    const scale = getScale()

    document.documentElement.style.setProperty('--scale-x', scale.x)
    document.documentElement.style.setProperty('--scale-y', scale.y)
    document.documentElement.style.setProperty('--design-width', designWidth + 'px')
    document.documentElement.style.setProperty('--design-height', designHeight + 'px')
    document.documentElement.style.setProperty('--window-width', window.innerWidth + 'px')
    document.documentElement.style.setProperty('--window-height', window.innerHeight + 'px')

    if (mode === 'fit') {
      dom.style.transform = `scale(${scale.x})`
      dom.style.transformOrigin = '0 0'
      dom.style.width = `${designWidth}px`
      dom.style.height = `${designHeight}px`

      const actualWidth = designWidth * scale.x
      const actualHeight = designHeight * scale.x
      const offsetX = (window.innerWidth - actualWidth) / 2
      const offsetY = (window.innerHeight - actualHeight) / 2

      dom.style.position = 'fixed'
      dom.style.left = `${offsetX}px`
      dom.style.top = `${offsetY}px`
      dom.style.margin = '0'
    } else {
      dom.style.transform = `scaleX(${scale.x}) scaleY(${scale.y})`
      dom.style.transformOrigin = '0 0'
      dom.style.width = `${designWidth}px`
      dom.style.height = `${designHeight}px`
      dom.style.position = 'fixed'
      dom.style.left = '0'
      dom.style.top = '0'
      dom.style.margin = '0'
    }

    dom.style.overflow = 'hidden'
  }

  function init() {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflow = 'hidden'

    setScale()
    if (resize) {
      window.addEventListener('resize', setScale)
    }
  }

  init()

  return {
    init,
    getScale,
    setMode(newMode) {
      mode = newMode
      setScale()
    },
    off() {
      window.removeEventListener('resize', setScale)
      dom.style.transform = ''
      dom.style.transformOrigin = ''
      dom.style.width = ''
      dom.style.height = ''
      dom.style.overflow = ''
      dom.style.position = ''
      dom.style.left = ''
      dom.style.top = ''
      dom.style.margin = ''

      document.documentElement.style.removeProperty('--scale-x')
      document.documentElement.style.removeProperty('--scale-y')
      document.documentElement.style.removeProperty('--design-width')
      document.documentElement.style.removeProperty('--design-height')
      document.documentElement.style.removeProperty('--window-width')
      document.documentElement.style.removeProperty('--window-height')
    },
  }
}

export default autofitResponsive;
/**
 * autofit-responsive.js v1.0.0
 * 响应式自适应解决方案 - 使用CSS变量和viewport单位
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.autofitResponsive = factory());
  }(this, (function () { 'use strict';
  
    var autofitResponsive = function autofitResponsive(config) {
      config = config || {};
      
      var designWidth = config.dw || 1920;
      var designHeight = config.dh || 1080;
      var renderDom = config.el || 'body';
      var resize = config.resize !== false;
      var mode = config.mode || 'fit'; // 'fit' 等比例适配, 'fill' 填满屏幕
      
      var dom = document.querySelector(renderDom);
      if (!dom) {
        console.error('autofit-responsive: 找不到渲染的dom,请检查传入的 el');
        return;
      }
  
      function getScale() {
        var scaleX = window.innerWidth / designWidth;
        var scaleY = window.innerHeight / designHeight;
        
        if (mode === 'fit') {
          // 等比例适配：取最小缩放比例
          var scale = Math.min(scaleX, scaleY);
          return { x: scale, y: scale };
        } else {
          // 填满屏幕：分别计算宽高缩放比例
          return { x: scaleX, y: scaleY };
        }
      }
  
      function setScale() {
        var scale = getScale();
        
        // 设置CSS变量，供CSS使用
        document.documentElement.style.setProperty('--scale-x', scale.x);
        document.documentElement.style.setProperty('--scale-y', scale.y);
        document.documentElement.style.setProperty('--design-width', designWidth + 'px');
        document.documentElement.style.setProperty('--design-height', designHeight + 'px');
        document.documentElement.style.setProperty('--window-width', window.innerWidth + 'px');
        document.documentElement.style.setProperty('--window-height', window.innerHeight + 'px');
        
        if (mode === 'fit') {
          // 等比例模式
          dom.style.transform = "scale(" + scale.x + ")";
          dom.style.transformOrigin = "0 0";
          dom.style.width = designWidth + "px";
          dom.style.height = designHeight + "px";
          
          // 居中显示
          var actualWidth = designWidth * scale.x;
          var actualHeight = designHeight * scale.x;
          var offsetX = (window.innerWidth - actualWidth) / 2;
          var offsetY = (window.innerHeight - actualHeight) / 2;
          
          dom.style.position = "fixed";
          dom.style.left = offsetX + "px";
          dom.style.top = offsetY + "px";
          dom.style.margin = "0";
        } else {
          // 填满模式
          dom.style.transform = "scaleX(" + scale.x + ") scaleY(" + scale.y + ")";
          dom.style.transformOrigin = "0 0";
          dom.style.width = designWidth + "px";
          dom.style.height = designHeight + "px";
          dom.style.position = "fixed";
          dom.style.left = "0";
          dom.style.top = "0";
          dom.style.margin = "0";
        }
        
        dom.style.overflow = "hidden";
      }
  
      function init() {
        // 确保body没有margin和padding
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        
        setScale();
        if (resize) {
          window.addEventListener('resize', setScale);
        }
      }
  
      init();
  
      return {
        init: init,
        getScale: getScale,
        setMode: function(newMode) {
          mode = newMode;
          setScale();
        },
        off: function() {
          window.removeEventListener('resize', setScale);
          dom.style.transform = "";
          dom.style.transformOrigin = "";
          dom.style.width = "";
          dom.style.height = "";
          dom.style.overflow = "";
          dom.style.position = "";
          dom.style.left = "";
          dom.style.top = "";
          dom.style.margin = "";
          
          // 清除CSS变量
          document.documentElement.style.removeProperty('--scale-x');
          document.documentElement.style.removeProperty('--scale-y');
          document.documentElement.style.removeProperty('--design-width');
          document.documentElement.style.removeProperty('--design-height');
          document.documentElement.style.removeProperty('--window-width');
          document.documentElement.style.removeProperty('--window-height');
        }
      };
    };
  
    return autofitResponsive;
  
  })));