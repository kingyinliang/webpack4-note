class DonePlugin {
    apply(compiler) {
        compiler.hooks.done.tap('DonePlugin', (stats) => {
            console.log('done')
        })
    }
}
module.exports = DonePlugin