# 每周总结可以写在这里

## 结构化程序设计

### JS执行粒度（由大至小）
- JS Context => Realm
- 宏任务
- 微任务 (Promise)
- 函数调用 （Execution Context Stack 调用执行栈）
    - code evaluation state (用于async generator函数)

    - Function

    - Script or Module

    - Generator （generator函数特有)

    - Realm

    - LexicalEnvironment (词法环境)
        - this
        - new.target
        - super
        - 变量

    - VariableEnvironment （变量环境）

- 语句/声明
- 表达式
- 直接量/变量/this


### 浏览器工作原理

- Request
    ```
    (Requset line)
    POST / HTTP/1.1      
    (Headers)                         
    Host: 127.0.0.1
    Content-Type: application/x-www-form-urlencoded
    (此处有空行)

    (body)
    field=aaa
    ```

- Response
    ```
    (status line)
    HTTP/1.1 200 OK      
    (Headers)                         
    Content-Type: text/html
    Date: Mon, 23 Dec 2019 06:46:19 GMT
    Connection: keep-alive
    Transfer-Encoding: chunked
    (此处有空行)

    (body)
    26
    <html><body>Hello World</body></html>
    0
    ```