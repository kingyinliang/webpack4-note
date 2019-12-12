const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default // 是Babel的代码生成器。它需要一个AST并将其转换为带有源映射的代码。
const ejs = require('ejs')

class Compiler {
    constructor (config) {
        this.config = config
        this.entryId
        // 模块依赖
        this.modules = {}
        // 入口路径
        this.entry = config.entry
        // 工作路径
        this.root = process.cwd()
        //可能输出多个文件
        this.assets = {}
    }
    // 得到文件内容
    getSource (modulePath) {
        let content = fs.readFileSync(modulePath,'utf-8')
        //处理 rules
        let rules = this.config.module.rules
        rules.forEach(rule=>{
            let {test,use} = rule
            let len = use.length - 1
            if(test.test(modulePath)){
                (function normalLoader() {
                    //后边是一个绝对路径 递归处理code
                    let loader = require(use[len--])
                    content = loader(content)
                    if(len>=0){
                        normalLoader()
                    }
                })()
            }
        })
        return content
    }
    // 解析源码
    parse(source,parentPath) { //主要靠AST解析语法树
        let ast = babylon.parse(source) // 将提供的 code 解析为完整的 ECMAScript 程序
        let dependencies =  []//数组依赖
        traverse(ast,{
            // 调用表达式  a执行  require执行
            /**
              CallExpression(p) {
                // 对语法树中特定的节点进行操作 参考@babel/types （特定节点类型）
                // CallExpression 特定节点
              },
              FunctionDeclaration: function(path) {
                // 对语法树中特定的节点进行操作 参考@babel/types （特定节点类型）
                // FunctionDeclaration 特定节点
              }
              enter(path) {
                // 进入节点
                if (path.node.type === "ThisExpression") {
                  // 对所有的操作
                };
              }
              exit(path) {
                // 退出节点
                console.log(`  exit ${path.type}(${path.key})`)
              }
            */
            CallExpression(p){
                let node = p.node //对应的节点
                if(node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__'
                    let moduleName = node.arguments[0].value
                    moduleName = moduleName + (path.extname(moduleName)? '':'.js')
                    moduleName = './' + path.join(parentPath,moduleName) //'src\a.js'
                    dependencies.push(moduleName)
                    //节点替换
                    node.arguments = [types.StringLiteral(moduleName)]
                }
            }
        })
        let sourceCode = generator(ast).code
        return {sourceCode,dependencies}
    }
    // 打包
    buildModule (modulePath, isEntry) {
        let source = this.getSource(modulePath)
        let moduleName = './' + path.relative(this.root,modulePath)
        if(isEntry) {
            this.entryId = moduleName // 保存入口名字
        }
        let {sourceCode, dependencies} = this.parse(source,path.dirname(moduleName))
        this.modules[moduleName] = sourceCode
        // 副模块的加载  递归加载
        dependencies.forEach(dep => {
            this.buildModule(path.join(this.root, dep), false)
        })
    }
    emitFile() { //发射文件
        //数据渲染
        //看的是webpack.config.js中的output
        let main = path.join(this.config.output.path,this.config.output.filename)
        //读取模板
        let templateStr = this.getSource(path.join(__dirname,'main.ejs'))
        //渲染
        let code = ejs.render(templateStr,{entryId:this.entryId,modules:this.modules})
        //拿到输出到哪个目录下
        //资源中 路径对应的代码
        this.assets[main] = code
        fs.readdir(this.root, (err,files) => {
            if(!err){
                let arr = files.filter(it => path.join(this.root, it) === this.config.output.path)
                if (arr.length) {
                    fs.writeFileSync(main, this.assets[main])
                } else {
                    fs.mkdirSync(this.config.output.path);
                    fs.writeFileSync(main, this.assets[main])
                }
            }else{
                console.log(err);
            }
        })
    }
    run () {
        // 执行 并且创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true)
        // 发射一个文件 打包后的文件
        this.emitFile()
    }
}

module.exports = Compiler