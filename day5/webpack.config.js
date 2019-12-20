const path = require('path')
const DonePlugin = require('./plugins/DonePlugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FileListPlugin = require('./plugins/FileListPlugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let InlineSourcePlugin = require('./plugins/InlineSourcePlugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loader')],
        // alias:{
        //     loader1: path.resolve(__dirname, 'loader', 'loader1.js')
        // }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader']
            },
            {
                test: /.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                // 目的 根据图片生成一个 md5串 发射到dist目录下 file-loader还会返回当前路径
                /*    use:{
                     loader: 'file-loader',
                   } */
                use:{  //符号中文  会报Invalid or unexpected token
                    loader: 'url-loader', //url-loader会处理路径并且交给file-loader
                    options:{
                        limit: 500*1024
                    }
                }
            },
            {
                // loader分为两部分  pitch 和 normal  pitch中有返回值直接执行上一个
                test: /\.js/,
                use: [{
                    loader: 'loader1'
                },{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    },
                },{
                    loader: 'banner-loader',
                    options:{
                        text: 'ooooo',
                        //如果没有给text的时候
                        filename: path.resolve(__dirname,'banner.js')
                    }
                }],
                enforce: 'pre', // pre  -> normal -> inline -> post  loader顺序  inline let str = requiere(inline-loader!./a.js) -!不会让pre和normal处理 !!是只让inline处理
            }
        ]
    },
    plugins: [
        new DonePlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        /*  new FileListPlugin({
           filename: 'list.md'
         }), */
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
        new InlineSourcePlugin({
            test: /(\.js|css)/
        })
    ]
}