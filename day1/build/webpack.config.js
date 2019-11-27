const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin') // 压缩js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devServer: { // 开发服务器配置
        port: 3000,  // 端口号
        progress: true,  // 进度条
        contentBase: './dist', // 静态服务文件夹
        compress: true, // 压缩
        open: true // 打开浏览器
    },
    mode: 'development', // 模式  默认两种  production development
    entry: path.resolve(__dirname, '../src/index.js'), // 入口
    output: {
        filename: "main.[hash:8].js", // 打包后的文件名
        path: path.resolve(__dirname, '../dist'), // 路径必须是一个绝对路径
        // publicPath: "" // cdn上
    },
    plugins: [ // 数组 所有webpack插件
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: 'static', to: './' }
        ]),
        new webpack.BannerPlugin('make 2019 by kingyinliang'),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new webpack.ProvidePlugin({
            $: "jquery" // 在每个模块中都注入 $
        })
    ],
    // externals: {
    //     // 不需要打包
    //     jquery: '$'
    // },
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
            },
            // @babel/core babel核心
            // @babel/preset-env babel预设
            // babel-loader babel桥梁
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                '@babel/plugin-transform-runtime'  // 高级内置函数
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, '../src/'), // 包括
                exclude: /node_modules/ // 排除
            },
            // {
            //     test: require.resolve('jquery'),
            //     use: 'expose-loader?$' // 暴露全局loader
            // },
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: "eslint-loader",
            //         options: {
            //             enforce: "pre" // 前面 post 之后
            //         }
            //     },
            //     include: path.resolve(__dirname, '../src'), // 包括
            //     exclude: /node_modules/ // 排除
            // },
            // file-loader require('./logo.png) 默认生成一张图片到build目录下返回回哈希地址
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 200 * 1024, //小于多少k时用url-loader处理成base64 否则用file-loader生成真实图片
                        outputpath: '/img/', // 输出目录
                        // publicpath: '' // cdn
                    }
                }
            },
            {
                // 处理html中的路径生成一张图片到build目录下返回回哈希地址
                test: /\.html$/,
                use: "html-withimg-loader"
            }
        ]
    },
    watch: false, // 实时编译监控打包
    watchOptions: { // 监控选项
        poll: 1000, // 每秒多少次
        aggregateTimeout: 500, // 防抖作用：500毫秒内一直输入不打包
        ignored: /node_modules/, // 不需要哪个文件
    },
    devtool: "source-map", // source-map生成map文件源码映射
    // devtool: "eval-source-map", // 不会生成map文件的源码映射
    // devtool: "cheap-source-map", // 不会产生列 是一个单独的映射文件
    // devtool: "cheap-module-eval-source-map", // 不会产生列和生成文件，集成在打包后的文件中
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