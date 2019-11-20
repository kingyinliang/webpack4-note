const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin') // 压缩js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css

module.exports = {
    devServer: { // 开发服务器配置
        port: 3000,  // 端口号
        progress: true,  // 进度条
        contentBase: './dist', // 静态服务文件夹
        compress: true, // 压缩
        open: true // 打开浏览器
    },
    mode: 'production', // 模式  默认两种  production development
    entry: path.resolve(__dirname, '../src/index.js'), // 入口
    output: {
        filename: "main.[hash:8].js", // 打包后的文件名
        path: path.resolve(__dirname, '../dist') // 路径必须是一个绝对路径
    },
    plugins: [ // 数组 所有webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css'
        })
    ],
    module: {
        rules: [ // 规则
            // loader特点单一 字符串用一个 数组用多个 顺序从后往前执行
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,// 抽离出文件引入
                    'css-loader', // css-loader 连接@import这种语法的
                    'postcss-loader'
                ]
            },
            {
                test: /\.less/,
                use: [
                    // style-loader 把css插入到head标签中
                    {
                        loader: "style-loader",
                        options: {
                            insert: 'head'
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'less-loader', // less解析成css
                ]
            }
        ]
    },
    optimization: { // 优化项
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new UglifyjsPlugin({
                cache: true, // 缓存
                parallel: true, // 并发打包
                sourceMap: true // map
            })
        ]
    }
}