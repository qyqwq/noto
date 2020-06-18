//触发更新视图
function updateView() {
    console.log('视图更新')
}
//重新定义数组原型
const oldArrayProperty = Array.prototype
//创建新对象，原型指向oldArrayProperty，在拓展新的方法（这样不会影响原型）
let arrayProto = Array.prototype
let methods = ['pop', 'shift', 'unshift', 'sort', 'reverse', 'splice', 'push']
methods.forEach(methodName => {
    arrayProto[methodName] = function () {
        updateView ()
        oldArrayProperty[methodName].call(this,...arguments)
    }
})
//监听对象属性
function observer(target){
    if(typeof target !=='object' || target === null) {
        //不是对象或者数组
        return target
    }
    //重新定义数组原型
    if (Array.isArray(target)) {
        target.__proto__ = arrProto
    }
    
    //重新定义各个属性（for in 对象/数组都可以遍历）
    for(let key in target) {
        defineReactive(target,key,target[key])
    }
}
//重新定义属性，监听起来
function defineReactive (target, key, value){
    //递归深度监听
    observer(value)
    //核心API 
    Object.defineProperty(target,key,{
        get(){
            return value
        },
        set(newValue){
            if(newValue !== value) {
                 // 深度监听
                observer(newValue)
                //设置新值
                value = newvalue
                //触发更新视图
                updateView()
            }
        }
    })
}
// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '北京' // 需要深度监听
    },
    nums: [10, 20, 30]
}
 data.name = 'lisi' //视图更新
 data.age = 21      //视图更新
 console.log('age', data.age) //age 21
 data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
 delete data.name // 删除属性，监听不到 —— 所以有 Vue.dete
 data.info.address = '上海' // 深度监听
 data.nums.push(4) // 视图更新