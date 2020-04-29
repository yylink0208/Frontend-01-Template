# 每周总结可以写在这里

## JS表达式 类型转换

### Grammar语法
- Expression

   - Member成员访问(返回的是Reference对象)
      - a.b
      - a[b]
      - foo\`string`
      - super.b （super 关键字在class中使用）
      - super['b']
      - new.target (只能在构造函数中使用)？？？
      - new Foo() (优先级比 new Foo 高)
   - New
       - new Foo

   - Call


   - Left Handside & Right Handside


   - Update
        - a++
        - a--
        - ++a
        - --a

    - Unary
        - delete a.b
        - void foo() (void会将之后的表达式生成undefined 可以用于IIFE的使用 void function(){}() ) 
        - typeof a
        - +a
        - -a
        - ~a
        - !a
        - await a
    
    - Boxing&&unBoxing


## JS语句 对象
- 语句
    - 简单语句
        - ExpressionStatement
            - a = 1 + 2
        - EmptyStatement
            - ;
        - DebuggerStatement
            - debugger
        - ThrowSatement
            - throw a
        - ContinueStatement
            - continue label1
        - BreakStatement
            - break label2
        - ReturnStatement
            - renturn 1 + 2

    - 组合语句
        - BlockStatement(将{}括起来来的多条语句当作一条语句执行)
            - [[type]]:normal
            - [[value]]:--
            - [[traget]]:--

        - IterationStatement(可消费break continue)
            - while()
            - do while()
            - for( ; ;)
            - for( in )
            - for( of )

        - try
        ```js
            try{

            }catch(){

            }finally{

            }

        ```

    - 声明(Decalaration)
        - FunctionDecalaration
        - GeneratorDecalaration
        - AsyncFunctionDecalaration
        - AsyncGenertatorDecalaration
        - VariableStatement 变量声明
        - ClassDecalaration
        - LexicalDecalaration

    - Runtime运行时
        - Completion Record
            - [[type]]:normal, break, continue, return, or throw
            - [[value]]:Types
            - [[target]]:label

        - Lexical Enviroment

- Object
    - 三要素
        - identifier 标识 唯一性
        - behavior 行为
        - state 状态

    - Class
        - 归类（C++ 可继承多个父类）
        - 分类 (单继承结构)

    - Prototype
     - 不试图做严谨的分类，而是采用“相似”这样的方式去描述对象
     - 任何对象仅仅需要描述它自己与原型的区别即可