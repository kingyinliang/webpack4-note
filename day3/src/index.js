// import 在生产环境下会自动去除掉没用的代码 叫做tree-shaking  把没用到的代码删除掉，
// es6模块会把结果放到 defalut 上 let a = require('./a.js')  a.defalut.a  并且不会删除没用到的代码
// scope hosting 作用域提升  会自动省略声明变量直接完成计算
import $ from 'jquery'
console.log($)

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
let r = moment().endOf('day').fromNow()
console.log(r)

import React from 'react'
import { render } from 'react-dom'

render(<h1>jsx</h1>, window.root)

let button = document.createElement('button')
button.innerHTML = 'aa'
button.addEventListener('click', () => {
    // es6草案中的语法 jsonp实现动态加载文件
    import('./a.js').then(data => {
        console.log(data.default)
    })
})
document.body.appendChild(button)

import b from './b'
if (module.hot) {
    module.hot.accept('./b.js', () => {
        let str = require('./b.js')
        console.log(str.default)
    })
}
console.log(b)