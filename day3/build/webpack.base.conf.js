const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack') // 多线程打包
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'), // 入口
    output: {
        filename: "main.[hash:8].js", // 打包后的文件名
        path: path.resolve(__dirname, '../dist'), // 路径必须是一个绝对路径
        // publicPath: "" // cdn上
    },
    module: {
        noParse: [/jquery/], // 忽略包内的依赖关系
        rules: [
            {
                test: /\.js$/,
                exclude: /node_module/,
                include: path.resolve('src'),
                use: ['HappyPack/loader?id=js']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin('make 2019 by kingyinliang'),
        new CopyWebpackPlugin([
            { from: 'public', to: './' }
        ]),
        new webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略包内部引用的包
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../public', 'manifest.json')
        }),
        new HappyPack({
            id: 'js',
            use: [{
                loader: "babel-loader",
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                    ]
                }
            }]
        })
    ]
}