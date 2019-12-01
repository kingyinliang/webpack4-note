const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf.js')

module.exports = merge(base, {
    mode: 'development',
    devServer: { // 开发服务器配置
        hot: true,
        port: 8080,  // 端口号
        progress: true,  // 进度条
        contentBase: path.resolve(__dirname, '../dist'), // 静态服务文件夹
        compress: true, // 压缩
        open: true // 打开浏览器
    },
    plugins: [
        new webpack.NamedModulesPlugin(),  // 打印更新模块的路径
        new webpack.HotModuleReplacementPlugin() // 热更新插件
    ]
})