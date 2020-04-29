# JS中内置的特殊对象

## 绑定函数
    通过bind call apply new等操作创建的对象
    Function通过调用bind call apply通过传入一个对象A和参数列表将会返回一个新的Function funA，当funA作为函数调用时funA的this指向的将会时A,当funA被当作构造函数也是就是 new 调用时会返回一个新的实例对象B此时B中的this指向的将会时它自己

## 数组对象
    数组length的最大值是2^32-1，即32位无符号整型数的最大值。
    当length超出范围时,抛出错误

    数组index最大值是2^32-2
    使用不合法的index并不会抛出错误，这是因为数组本身是一个对象，向对象设置任意的key都是合法的
    在控制台输入
    var a = []
    a.c = 100
    console.log(a)
    会输出 [a:100]

## 字符串对象
    字符串长度是不可变的 length属性不可修改
    字符串一旦创建便不能被修改,对字符串进行拼接或修改操作都将返回一个新的字符串

## Arguments对象    