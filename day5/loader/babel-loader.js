let babel = require('@babel/core')
//loaderUtils 拿到预设  便于后期转化代码
let loaderUtils = require("loader-utils");
function loader(source) {
    // console.log(Object.keys(this))
    let options = loaderUtils.getOptions(this);
    let cb = this.async() // loader上下文 默认有async这个方法 异步执行 在哪执行调用cb就可以
    //babel的transform有三个参数  第一个 转换哪些代码  第二个 转换选项  第三个 异步回调函数
    babel.transform(source,{
        ...options, //对象展开
        sourceMap: true, //调试工具 需要webpack.config.js 也要配置 source-map
        filename:  this.resourcePath.split('/').pop()//文件名  不然运行时 webpack下边是unkown
    },function(err,result){
        //异步回调  return source就不起作用了
        cb(err,result.code,result.map)  // 异步 cb(123) 会错误 必须严格按照参数来
        // 第一个 错误  第二个  代码  第三个 sourceMap
    })

}
module.exports = loader