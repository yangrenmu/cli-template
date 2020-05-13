const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem') // 将单位转为 rem
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  parallel: false,
  outputDir: 'dist',
  // 修改 webpack 配置
  chainWebpack: config => {
    // 配置 alias
    config.resolve.alias.set('@', resolve('src'))
    // 全局引用less  全局变量/全局函数(flex等)
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 75, // 好像是设计稿的基数  设计稿/10
            propList: ['*'],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ['van-circle__layer', 'van']
          })
        ]
      }
    }
  }
}

// 全局引用less  全局变量/全局函数(flex等)
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/common/layout.less') // 需要全局导入的less
      ]
    })
}
