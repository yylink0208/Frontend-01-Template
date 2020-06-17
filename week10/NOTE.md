<!-- # 每周总结可以写在这里 -->
# 重学DOM

## Range API
- var range = new Range()
- range.setStart(element,9)
- range.setEnd(element,4)
- var range = document.getSelection().getRangeAt(0)

    ---
- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents

    ---
- var fragment = range,extractContents()
- range.insertNode(document.createTextNode('aaa'))

## CSSOM
- document.styleSheets

- Rules
    - document.styleSheets[0].cssRules
    - document.styleSheets[0].insertRule('p{color:pink}',0)
    - document.styleSheets[0].removeRule(0)

        ---
    - CSSStyleRule
        - selectorText String
        - style K-V结构

    - CSSCharsetRule
    - CSSImportRule
    - CSSMediaRule
    - CSSFontFaceRule
    - CSSPageRule
    - CSSNamespaceRule
    - CSSKeyframesRule
    - CSSSupportsRule
    - ...

- getComputedStyle
    - window.getComputedStyle(elt,pseudoElt)
        - elt想要获取的元素
        - pseudoElt 可选，伪元素

- 元素
    - getBoundingClientRect
    - getClientRects
