const path = require('path')
const webpack = require('webpack')
let dependencies = Object.keys(require('../package.json').dependencies) || []
console.log(dependencies)
module.exports = {
    mode: 'development',
    entry: {
        vendor: dependencies
    }, // 入口
    output: {
        filename: "dll_[name].js",
        path: path.resolve(__dirname, '../public'),
        library: "dll_[name]",
        libraryTarget: "var" // commonjs var umb this
    },
    plugins: [
        new webpack.DllPlugin({
            name: 'dll_[name]',
            path: path.resolve(__dirname, '../public', 'manifest.json')
        })
    ]
}