
let { SyncHook, SyncBailHook, AsyncSeriesWaterfallHook } = require('tapable')
class Lesson {
    constructor () {
        this.hooks = {
            arch: new SyncHook(['name'])
        }
    }
    tap () {
        this.hooks.arch.tap('node', (name) => {
            console.log('node', name)
        })
        this.hooks.arch.tap('react', (name) => {
            console.log('react', name)
        })
    }
    start () {
        this.hooks.arch.call('aa')
    }
}
let l = new Lesson()
l.tap()
l.start()


class Lesson2 {
    constructor () {
        this.hooks = {
            arch: new SyncBailHook(['name'])
        }
    }
    tap () {
        this.hooks.arch.tap('node', (name) => {
            console.log('node', name)
            return 'aa'
        })
        this.hooks.arch.tap('react', (name) => {
            console.log('react', name)
        })
    }
    start () {
        this.hooks.arch.call('aa')
    }
}
let l2 = new Lesson2()
l2.tap()
l2.start()