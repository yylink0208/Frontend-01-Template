
import { enableGesture } from './gusture'

export function createElement (Cls, attributes, ...children) {
  console.log(Cls, children)
  let o
  // 处理原生标签
  if (typeof Cls === 'string') {
    o = new Wraper(Cls)
  } else {
    o = new Cls({
      timer: {}
    })
  }

  if (attributes) {
    for (const name in attributes) {
      o.setAttribute(name, attributes[name])
    }
  }

  const visit = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new Text(child)
      }

      if (child instanceof Array && typeof child === 'object') {
        visit(child)
        continue
      }
      o.appendChild(child)
    }
  }
  visit(children)
  return o
}

export class Text {
  constructor (text) {
    this.root = document.createTextNode(text)
  }

  mountTo (parent) {
    parent.appendChild(this.root)
  }
}

export class Wraper {
  constructor (type) {
    this.children = []
    this.root = document.createElement(type)
  }

  get style () {
    return this.root.style
  }

  get classList () {
    return this.root.classList
  }

  set innerText (text) {
    this.root.innerText = text
  }

  setAttribute (name, value) {
    this.root.setAttribute(name, value)

    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase())
      this.addEventListener(eventName, value)
    }

    if (name === 'enableGesture') {
      enableGesture(this.root)
    }
  }

  getAttribute (name) {
    return this.root.getAttribute(name)
  }

  appendChild (child) {
    this.children.push(child)
  }

  mountTo (parent) {
    parent.appendChild(this.root)
    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }

  addEventListener () {
    this.root.addEventListener(...arguments)
  }
}
