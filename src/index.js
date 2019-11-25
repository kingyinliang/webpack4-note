let str = require('./a')
console.log(str)
let fn = () => {
    console.log(1)
}
fn()

@log
class A{
    a = 2
}
let a = new A()
console.log(a.a)

function log(target) {
    console.log(target)
}


function * gen(params) {
    yield 1
}

console.log(gen().next())

console.log('aaa'.includes('a'))

// import $ from 'jquery'

// console.log($)

// import $ from 'expose-loader?$!jquery'
// expose-loader 暴露全局的loader import 内联的loader
// pre 前面执行的loader  normal 普通的loader  内联loader post loader 后置
// console.log(window.$)

require('./index.css')
require('./a.less')