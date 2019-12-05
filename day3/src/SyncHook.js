class SyncHook {
    constructor (args) {
        this.tasks = []
    }
    tap (name, callback) {
        this.tasks.push(callback)
    }
    call (...args) {
        this.tasks.forEach((callback) => { callback(...args) })
    }
}
// 同步钩子
let hook = new SyncHook(['name'])
hook.tap('name1', (name) => {
    console.log('name1', name)
})
hook.tap('name2', (name) => {
    console.log('name2', name)
})
hook.call('aa')


class SyncBailHook {
    constructor (args) {
        this.tasks = []
    }
    tap (name, callback) {
        this.tasks.push(callback)
    }
    call (...args) {
        let ret
        let index = 0
        do {
            ret = this.tasks[index++](...args)
        } while (ret === undefined && index < this.tasks.length)
    }
}
// 同步钩子
let hook1 = new SyncBailHook(['name'])
hook1.tap('name1', (name) => {
    console.log('name1', name)
    return 'stop'
})
hook1.tap('name2', (name) => {
    console.log('name2', name)
})
hook1.call('aa')


class SyncWaterfallHook {
    constructor (args) {
        this.tasks = []
    }
    tap (name, callback) {
        this.tasks.push(callback)
    }
    call (...args) {
        let [first, ...others] = this.tasks
        let ret = first(...args)
        others.reduce((a, b) => { // 数组的高阶函数reduce 参数fn和初始值 fn中第一个为初始值 第二个是当前值
            return b(a)
        }, ret)
    }
}
// 同步钩子 传值给下一个
let hook2 = new SyncWaterfallHook(['name'])
hook2.tap('name1', (name) => {
    console.log('name1', name)
    return 'stop'
})
hook2.tap('name2', (name) => {
    console.log('name2', name)
})
hook2.call('aa')

class SyncLoopHook {
    constructor (args) {
        this.tasks = []
    }
    tap (name, callback) {
        this.tasks.push(callback)
    }
    call (...args) {
        this.tasks.forEach((callback) => {
            let ret
            do {
                ret = callback(...args)
            } while (ret !== undefined)
        })
    }
}
// 同步遇到不是undefined的执行多次
// let hook3 = new SyncLoopHook(['name'])
// hook3.index = 0
// hook3.tap('name1', (name) => {
//     console.log('name1', name)
//     return ++this.index ===2 ?  undefined : 'go'
// })
// hook3.tap('name2', (name) => {
//     console.log('name2', name)
// })
// hook3.call('aa')
