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

// require('./index.css')
// require('./a.less')