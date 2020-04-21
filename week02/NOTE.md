# 每周总结可以写在这里



## 相关资料
- ECMA-262 Grammar Summary 部分
- 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句
- 终结符：(最终在代码中出现的字符 https://zh.wikipedia.org/wiki/終結符與非終結符)
- 关于元编程： https://www.zhihu.com/question/23856985
- 协变与逆变： https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html
- Yacc 与 Lex 快速入门： https://www.ibm.com/developerworks/cn/linux/sdk/lex/index.html

## 编程语言通识

### 语言按语法分类
- 非形式语言
   - 中文，英文

- 形式语言（乔姆斯基谱系）
   - 0型 无限制文法 ?::=?  例 \<a> <b> ::= "c" \<d>  \<a> <b> ::= "c"
   - 1型 上下文相关文法 ?\<A>?::=\<B>? 例 "a" <b> "c"::="a" "x" "c 
   - 2型 上下文无关文法 \<A>::=?
   - 3型 正则文法 \<A>:=\<A>?

 ### 产生式(BNF)
 - 用尖括号括起来的名称来表示语法结构
 - 语法结构分成基础结构和需要用其他语法结构定义的复合结构
    - 基础结构称终结符
    - 复合结构称非终结符
 - 引号和中间的字符表示终结符
 - 可以有括号
 - *表示重复或多次
 - |表示或
 - +表示至少一次
 
 ```
如何定义一个加法的表达式

定义数字型
<Number> ::= "0" | "1" | "2" |......| "9"

定义十进制数
<DecimalNumber> ::= "0" | (("0" | "1" | "2" |......| "9")<Number>*)

定义一个支持一个数字或两个十进制数相加的加法表达式
<AdditiveExpression> ::= <DecimalNumber> | <DecimalNumber> “+” <DecimalNumber>

定义支持连加的加法表达式
<AdditiveExpression> ::= <AdditiveExpression> “+” <DecimalNumber>

最终加法表达式可以则定义为
<AdditiveExpression> ::= <DecimalNumber> | <AdditiveExpression> “+” <DecimalNumber>

======================

如何定义一个四则运算

1.首先根据上述的加法定义可以定义一个乘法表达式
<MultiplicativeExpression> ::= <DecimalNumber> | <MultiplicativeExpression> “*” <DecimalNumber>

2.定义一个加法和乘法混合的表达式 例如1+2*3
分析1+2*3 可以拆分为左项1 和 右项 2*3 <MultiplicativeExpression>
而1也可以表示为 为一个 <MultiplicativeExpression>
所以加法表达式可以重新定义为
<AdditiveExpression> ::= <MultiplicativeExpression> | <AdditiveExpression> “+” <MultiplicativeExpression>

3.加上除法和减法运算
<MultiplicativeExpression> ::= <DecimalNumber> | 
   <MultiplicativeExpression> “*” <DecimalNumber> |
   <MultiplicativeExpression> “/” <DecimalNumber> 

<AdditiveExpression> ::= <MultiplicativeExpression> | 
   <AdditiveExpression> “+” <MultiplicativeExpression> |
   <AdditiveExpression> “-” <MultiplicativeExpression>

4.那么四则运算表达式则为
<LogicalExpression>::= <AdditiveExpression> | 
   <LogicalExpression> "||" <AdditiveExpression> |
   <LogicalExpression> "&&" <AdditiveExpression>


5.加入括号的运算表达式
<PrimaryExpression> = <DecimalNumber> | 
   "(" <LogicalExpression> ")"
   则乘法表达式可改为
   <MultiplicativeExpression> ::= <PrimaryExpression> | 
      <MultiplicativeExpression> “*” <PrimaryExpression> |
      <MultiplicativeExpression> “/” <PrimaryExpression>


 最终结果为
   <Number> ::= "0" | "1" | "2" |......| "9" 

   <DecimalNumber> ::= "0" | (("0" | "1" | "2" |......| "9")<Number>*) 

   <PrimaryExpression> = <DecimalNumber> | 
   "(" <LogicalExpression> ")"

   <MultiplicativeExpression> ::= <PrimaryExpression> | 
      <MultiplicativeExpression> “*” <PrimaryExpression> |
      <MultiplicativeExpression> “/” <PrimaryExpression>

   <AdditiveExpression> ::= <MultiplicativeExpression> | 
      <AdditiveExpression> “+” <MultiplicativeExpression> |
      <AdditiveExpression> “-” <MultiplicativeExpression>   

   <LogicalExpression>::= <AdditiveExpression> | 
      <LogicalExpression> "||" <AdditiveExpression> |
      <LogicalExpression> "&&" <AdditiveExpression>
 ```

 ### 图灵完备性？？
 - 命令式——————图灵机
    - goto
    - if和while

 - 声明式——————lambda
    - 递归


### 动态与静态

- 动态：
   - 在用户的设备/在线服务器上
   - 产品实际运行时
   - Runtime

- 静态：
   - 在程序员的设备上
   - 产品开发时
   - Compiletime


### 类型系统
- 动态类型系统与静态类型系统

- 强类型与弱类型
   - String + Number
   - String == Boolean

- 复合类型
   - 结构体（对象）
   - 函数签名 （T1,T2）=>T3

- 子类型
   - 逆变/协变

### 一般命令式编程语言结构（小——>大）
- Atom
   - Identifier
   - Literal

- Expression
   - Atom
   - Operator
   - Punctuator

- Statement
   - Expression
   - Keyword
   - Punctuator

- Structure
   - Function
   - Class
   - Processs
   - Namespace
   - ...

- Program
   - Program
   - Module
   - Package
   - Library




## JavaScript

- Atom
   - InputElement
      - WhiteSpace
         - Tab：制表符（打字机时代：制表时隔开数字很方便）
         - VT：纵向制表符
         - FF: FormFeed
         - SP: Space
         - NBSP: NO-BREAK SPACE（和 SP 的区别在于不会断开、不会合并)
         - ZWNBSP: ZERO WIDTH NO-BREAK SPACE 零宽空格 U-FEFF

   - LineTerminator 换行符
      - LF: Line Feed \n
      - CR: Carriage Return \r

   - Comment 注释

   - Token 记号 一切有效的东西
      - Punctuator

      - IdentifierName 标识符
         - Keywords
         - Identifier
         - Future reserved Keywords: enum

      - Literal
         - Number
            - 存储 Uint8Array、Float64Array
            - 各种进制的写法
               - 二进制0b
               - 八进制0o
               - 十进制0x

         - String
            - Character
            - Code Point
            - Encoding
               - unicode编码 - utf
                  - utf-8 可变长度 （控制位的用处）
            - Grammar
               - ''、""、``` `

         - Bolean
         - Null
         - Undefined
```
