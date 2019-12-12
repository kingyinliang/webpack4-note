const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, './dist')
    },
    module:{
        rules:[
            {
                test: /\.less$/,
                use:[
                    path.resolve(__dirname,'loader','style-loader'),
                    path.resolve(__dirname,'loader','less-loader')
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true
        }),
    ]
}