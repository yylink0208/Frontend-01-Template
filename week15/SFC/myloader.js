const parser = require('./parser')

module.exports = function (source, map) {
  const tree = parser.parseHTML(source)

  let template = null
  let script = null

  for (const node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type !== 'text')[0]
    }
    if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }

  const visit = (node) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content)
    }

    const attrs = {}
    for (const attribute of node.attributes || []) {
      attrs[attribute.name] = attribute.value
    }

    const children = node.children.map(node => visit(node))
    return ` createElement("${node.tagName}",${JSON.stringify(attrs)},${children})`
  }

  const r = `
    import { createElement, Text, Wraper } from './creatElement'
    export class Carousel {
      setAttribute (name, value) {
        this[name] = value
      }

      mountTo (parent) {
        this.render().mountTo(parent)
      }
      
      render(){
        return ${visit(template)}
      }
    }
  `
  console.log(r)

  return r
}
