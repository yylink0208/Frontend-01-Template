
function create (Cls, attributes, ...children) {
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
    console.log(attributes)
    for (const name in attributes) {
      o.setAttribute(name, attributes[name])
    }
  }

  for (let child of children) {
    if (typeof child === 'string') {
      child = new Text(child)
    }
    o.appendChild(child)
  }
  return o
}

class Text {
  constructor (text) {
    this.root = document.createTextNode(text)
  }

  mountTo (parent) {
    parent.appendChild(this.root)
  }
}

class Wraper {
  constructor (type) {
    this.children = []
    this.root = document.createElement(type)
  }

  setAttribute (name, value) {
    this.root.setAttribute(name, value)
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
}

class MyComponent {
  constructor (config) {
    this.children = []
    this.attributes = new Map()
  }

  setAttribute (name, value) {
    this.attributes.set(name, value)
  }

  appendChild (child) {
    this.children.push(child)
  }

  render () {
    return (
      <article>
        <header>i'm header</header>
        {this.slot}
        <footer>i'm header</footer>
      </article>
    )
  }

  mountTo (parent) {
    this.slot = <div />
    for (const child of this.children) {
      this.slot.appendChild(child)
    }

    this.render().mountTo(parent)
  }
}

const compoment = (
  <MyComponent>
    <div>text text</div>
  </MyComponent>
)

compoment.mountTo(document.body)
