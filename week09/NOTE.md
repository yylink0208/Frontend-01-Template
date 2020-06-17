# 每周总结可以写在这里
## 动画与绘制

### 动画

- @keyframes定义
- animation:使用
    - animation-name 时间曲线
    - animation-duration 动画的时长
    - animation-timing-function 动画的时间曲线（贝塞尔曲线）
    - animation-delay 动画开始前的延迟
    - animation-iteration-count 动画播放次数
    - animation-derection 动画的方向

- Transition
    - transition-property 要变换的属性
    - transition-duration 变换的时长
    - transition-delay 延迟
    - transition-timing-function 时间曲线
    
### 渲染与颜色


### 形状
- border
- box-shadow
- border-radius

## 重学HTML
- 整理HTML中的实体(DTD)
- 理解html的标签含义

### HTML语法

#### 合法元素
- Element
- Text
- Comment
- DcumentType
- ProcessingInstruction
- CDATA

#### 字符引用
- &#161;    \&#161;
- &amp;     \&amp;
- &lt;      \&lt;
- &quot;    \&quot;


## 重学DOM

### 导航类操作
- parentNode
- childNodes
- firstNode
- lastNode
- nextSibling
- previousSibling

### 修改操作（会实时修改通过childNode获取到的数组数据）
- appendChild（对一个已存在的元素进行操作时会进行位置的挪移）
- insertBefore
- removeChild 
- replaceChild

#### 高级操作
- compareDocumentPosition 是一个用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同
- isSameNOde 检查两个节点是否是同一个节点，实际上在JavaScript中可以用“===”
- cloneNode复制一个节点，如果传入参数true，则会连同子元素做深拷贝

## 重学DOM
- DOM Tree
- Events
- Range