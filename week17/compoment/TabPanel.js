import { createElement } from './creatElement'

export class TabPanel {
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

  select (i) {
    for (const view of this.childViews) {
      view.style.display = 'none'
    }

    this.childViews[i].style.display = ''

    for (const view of this.titleViews) {
      view.classList.remove('selected')
    }
    this.titleViews[i].classList.add('selected')
    // this.titleView.innerText = this.childViews[i].title
  }

  render () {
    this.childViews = this.children.map(child => (
      <div style='width:300px;min-height:300px'>{child}</div>
    ))

    this.titleViews = this.children.map((child, i) => (
      <span
        onClick={() => this.select(i)}
        style='background-color:lightgreen;margin:5px 5px 0px 5px;font-size:24px;width:300px;min-height:300px'
      >
        {child.getAttribute('title')}
      </span>
    ))

    setTimeout(() => this.select(0), 16)
    return (
      <div class='panel' style='width:300px'>
        <h1 style='width:300px;margin:0;'>{this.titleViews}</h1>
        <div style='border:solid 1px lightgreen'>
          {this.childViews}
        </div>
      </div>
    )
  }

  mountTo (parent) {
    this.render().mountTo(parent)
  }
}
