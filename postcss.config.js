module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 需要转换的单位
      viewportWidth: 750, // 设计稿宽度
      unitPrecision: 5, // 转换后的精度
      propList: ['*'], // 需要转换的属性，['*'] 代表所有
      viewportUnit: 'vw', // 目标单位
      fontViewportUnit: 'vw', // 字体使用的单位
      selectorBlackList: [], // 忽略的样式类
      minPixelValue: 1, // 小于 1px 不转换
      mediaQuery: false, // 允许在媒体查询中转换
      replace: true // 替换而不是添加备用单位
      // exclude: [/node_modules/] // 忽略的文件或文件夹
    }
  }
}
