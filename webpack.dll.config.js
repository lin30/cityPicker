var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router'],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  output: {
    path: 'dll/',
    filename: '[name]_dll.js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname, 
      path: 'dll/[name]-manifest.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      name: '[name]' // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
