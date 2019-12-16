//模拟插件
module.exports = class P{
    apply(compiler){
        //发射 订阅
        compiler.hooks.emit.tap('emit',()=>{
            console.log('emit事件')
        })
    }
}