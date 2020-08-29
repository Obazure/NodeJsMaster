

(function (require, module, exports, __filename, __direname){
    const obj = require('./user')

    console.log(obj.user)

    obj.sayHello()
})()