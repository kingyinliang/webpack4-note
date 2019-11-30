const merge = require('webpack-merge')
const base = require('./webpack.base.conf.js')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin') // 压缩js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css

module.exports = merge(base, {
    mode: 'production',
    optimization: { // 优化项
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new UglifyjsPlugin({
                cache: true, // 缓存
                parallel: true, // 并发打包
                sourceMap: true // map
            })
        ],
        splitChunks: {  // 分割代码块
            cacheGroup: { // 缓存组
                common: {  // 共公模块
                    chunks: 'initial', // 从入口开始
                    minSize: 0,  // 大小
                    minChunks: 2, // 用到的次数
                },
                vendor: {  // 第三方模块抽离
                    priority: 1, // 权重
                    test: /node_modules/,
                    chunks: 'initial', // 从入口开始
                    minSize: 0,  // 大小
                    minChunks: 2, // 用到的次数
                }
            }
        }
    }
})