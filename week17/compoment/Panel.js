import { createElement } from './creatElement'

export class Panel {
  constructor (config) {
    this.children = []
    this.attributes = new Map()
  }

  setAttribute (name, value) {
    this[name] = value
  }

  appendChild (child) {
    this.children.push(child)
  }

  render () {
    return (
      <div class='panel' style='border:solid 1px lightgreen;width:300px'>
        <h1 style='background-color:lightgreen;width:300px;margin:0;'>{this.title}</h1>
        <div style='width:300px;min-height:300px'>
          {this.children}
        </div>
      </div>
    )
  }

  mountTo (parent) {
    this.render().mountTo(parent)
  }
}
