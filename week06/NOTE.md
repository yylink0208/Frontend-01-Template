# 每周总结可以写在这里

### 有限状态机
- 每一个状态都是一个机器
    - 在每一个机器里，我们可以做计算，存储，输出。。。
    - 所有的这些机器接受的输入是一致的

- 每一个机器知道下一个状态


### JS中的有限状态机(Mealy)



### HTML的解析


### CSS解析

#### 第一步
- 遇到style标签时，将css规则保存起来
- 调用CSS Parser来分析CSS规则
- 必须仔细研究CSS库分析CSS规则的格式

#### 第二步 添加调用
- 当创建一个元素后，立即计算CSS
- 理论上，当我们分析一个元素时，所有CSS规则已经收集完毕
- 在真实浏览器中，可能遇到写在body的style标签，需要重新CSS计算的情况，这里我们忽略

#### 第三步 获取父元素序列
- 在computeCSS函数中，我们必须知道元素的所以父元素才能判断元素与规则是否匹配
- 可以从元素的parent属性逐级寻找父元素
- 因为我们首先获取的是'当前元素'，所以我们获得和计算父元素匹配的顺序是从内向外

#### 第四步 拆分选择器
- 选择器也要从当前元素向外排列
- 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

#### 第五步 匹配选择器
- 根据选择器的类型和元素属性计算是否与当前元素匹配
- 这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器

#### 第六步 设置选择器
- 一旦选择匹配，就应用选择器到元素上，形成computedStyle