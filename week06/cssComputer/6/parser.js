// 解析标签
const css = require('css')
const EOF = Symbol('EOF')
let currentToken = null
let currentAttribute = null

const stack = [{ type: 'document', children: [] }]
let currentTextNode = null

const rules = []
function addCSSRules(text) {
  const ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function findParents(element) {
  const elements = []
  let el = element
  while (el.parent) {
    elements.push(el.parent)
    el = el.parent
  }
  return elements

}

function computeCSS(element) {
  // const elements = stack.slice().reverse()
  const elements = findParents(element)
  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    // 与elements 顺序规则一致
    const selectorParts = rule.selectors[0].split(' ').reverse()

    if (!match(element, selectorParts[0])) continue

    let matched = false

    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }

      if (j >= selectorParts.length) {
        matched = true
      }

      if (matched) {
        // 如果匹配成功则加入规则
        const computedStyle = element.computedStyle
        for(const declaration of rule.declarations){
          if(!computedStyle[declaration.property]){
            computedStyle[declaration.property]={}
          }
          computedStyle[declaration.property].value = declaration.value
        }
        console.log(element.computedStyle)
        break
      }
    }
  }
}

function match(element,selector) {
  if(!selector||!element.attributes){
    return false
  }

  if(selector.charAt(0)==='#'){
    const attr = element.attributes.filter(attr=>attr.name==='id')[0]
    if(attr&&attr.value===selector.replace('#',''))return true
  }else if(selector.charAt(0)==='.'){
    // TODO 此处目前只考虑了一个class的情况ß
    const attr = element.attributes.filter(attr=>attr.name==='class')[0]
    if(attr&&attr.value===selector.replace('.',''))return true
  }else{
    if(element.tagName===selector){
      return true
    }
  }
 }

function emit(token) {
  const top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    const element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (const p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    element.parent = top
    computeCSS(element)

    top.children.push(element)
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end dosen't match!")
    } else {
      // 遇到style标签时执行添加css规则的操作
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }

      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    emit({
      type: 'text',
      content: c
    })
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {

  } else if (c === EOF) {

  } else { }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c // .toLowerCase()
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }

    return attributeName(c)
  }
}

function afterAttributeName(c) {
  if (c === '/') {
    if (currentAttribute) {
      currentToken[currentAttribute.name] = currentAttribute.value
    }
    return selfClosingStartTag
  } else if (c === '>') {
    if (currentAttribute) {
      currentToken[currentAttribute.name] = currentAttribute.value
    }
    emit(currentToken)
    return data
  } else if (c === EOF) {

  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === "'" || c === '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue(c)
  } else if (c === '\"') {
    return doubleQuotedAtrributeValue
  } else if (c === "\'") {
    return singleQuotedAtrributeValue
  } else if (c === '>') {

  } else {
    return UnquotedAtrributeValue(c)
  }
}

function doubleQuotedAtrributeValue(c) {
  if (c === '\"') {
    if (currentAttribute) {
      currentToken[currentAttribute.name] = currentAttribute.value
    }
    return afterQuotedAtrributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAtrributeValue
  }
}

function singleQuotedAtrributeValue(c) {
  if (c === "\'") {
    if (currentAttribute) {
      currentToken[currentAttribute.name] = currentAttribute.value
    }
    return afterQuotedAtrributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAtrributeValue
  }
}

function afterQuotedAtrributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    if (currentAttribute) {
      currentToken[currentAttribute.name] = currentAttribute.value
    }
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAtrributeValue
  }
}

function UnquotedAtrributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === "'" || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return UnquotedAtrributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    currentAttribute = null
    return data
  } else if (c === 'EOF') {

  } else { }
}

module.exports.parseHTML = async function parseHTML(html) {
  let state = data
  for (const c of html) {
    await new Promise(resolve => {
      setTimeout(() => resolve(), 0)
    })
    // 不知道为什么不等待一下 信息就打印不全 可能我mac有问题
    state = state(c)
  }
  state = state(EOF)
  // console.log(stack[0])
}
