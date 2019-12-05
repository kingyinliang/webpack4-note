// // 异步实现 并行
// class AsyncParallelHook {
//     constructor (args) {
//         this.tasks = []
//     }
//     tapAsync (name, callback) {
//         this.tasks.push(callback)
//     }
//     callAsync (...args) {
//         let finalCallback = args.pop() // 拿出最终的函数
//         let index = 0
//         let done = () => {
//             index ++
//             if (index == this.tasks.length) {
//                 finalCallback()
//             }
//         }
//         this.tasks.forEach(callback => {
//             callback(...args, done)
//         })
//     }
// }
// let hook1 = new AsyncParallelHook(['name'])
// hook1.tapAsync('name1', (name, callback) => {
//     setTimeout(() => {
//         console.log('name1', name)
//         callback()
//     }, 1000)
// })
// hook1.tapAsync('name2', (name, callback) => {
//     setTimeout(() => {
//         console.log('name2', name)
//         callback()
//     }, 1500)
// })
// hook1.callAsync('aa', () => {
//     console.log('aa end')
// })
// // 异步实现 并
// class AsyncParallelHook1 {
//     constructor (args) {
//         this.tasks = []
//     }
//     tapPromise (name, callback) {
//         this.tasks.push(callback)
//     }
//     promise (...args) {
//         let tasks = this.tasks.map(callback => callback(...args))
//         return Promise.all(tasks)
//     }
// }
// let hook2 = new AsyncParallelHook1(['name'])
// hook2.tapPromise('name1', (name) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('name1', name)
//             resolve()
//         }, 1000)
//     })
// })
// hook2.tapPromise('name2', (name) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('name2', name)
//             resolve()
//         }, 1000)
//     })
// })
// hook2.promise('bb').then(() => {
//     console.log('bb end')
// })
// 异步串行 AsyncSeriesHook
// class AsyncSeriesHook {
//     constructor (args) {
//         this.tasks = []
//     }
//     tapAsync (name, callback) {
//         this.tasks.push(callback)
//     }
//     callAsync (...args) {
//         let finalCallback = args.pop()
//         let index = 0
//         let next = () => {
//             if (this.tasks.length === index) return finalCallback()
//             let task = this.tasks[index++]
//             task(...args, next)
//         }
//         next()
//     }
// }
// let hook3 = new AsyncSeriesHook(['name'])
// hook3.tapAsync('name1', (name, callback) => {
//     setTimeout(() => {
//         console.log('name1', name)
//         callback()
//     }, 1500)
// })
// hook3.tapAsync('name2', (name, callback) => {
//     setTimeout(() => {
//         console.log('name2', name)
//         callback()
//     }, 1000)
// })
// hook3.callAsync('aa', () => {
//     console.log('aa end')
// })
//
// class AsyncSeriesHook1 {
//     constructor (args) {
//         this.tasks = []
//     }
//     tapPromise (name, callback) {
//         this.tasks.push(callback)
//     }
//     promise (...args) {
//         let [first, ...others] = this.tasks
//         return others.reduce((p, n)=>{ // redux的源码
//             return p.then(() => n(...args))
//         }, first(...args))
//     }
// }
// let hook4 = new AsyncSeriesHook1(['name'])
// hook4.tapPromise('name1', (name) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('name1', name)
//             resolve()
//         }, 1500)
//     })
// })
// hook4.tapPromise('name2', (name) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('name2', name)
//             resolve()
//         }, 1000)
//     })
// })
// hook4.promise('bb').then(() => {
//     console.log('bb end')
// })


class AsyncSeriesWaterfallHook {
    constructor (args) {
        this.tasks = []
    }
    tapAsync (name, callback) {
        this.tasks.push(callback)
    }
    callAsync (...args) {
        let finalCallback = args.pop()
        let index = 0
        let next = (err, data) => {
            let task = this.tasks[index]
            if (!task) return finalCallback()
            if (index === 0) {
                task(...args, next)
            } else {
                task(data, next)
            }
            index++
        }
        next()
    }
}
let hook5 = new AsyncSeriesWaterfallHook(['name'])
hook5.tapAsync('name1', (name, callback) => {
    setTimeout(() => {
        console.log('name1', name)
        callback(null, 'no')
    }, 1500)
})
hook5.tapAsync('name2', (name, callback) => {
    setTimeout(() => {
        console.log('name2', name)
        callback()
    }, 1000)
})
hook5.callAsync('cc', () => {
    console.log('cc end')
})


