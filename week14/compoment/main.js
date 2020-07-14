import { createElement, Text, Wraper } from './creatElement'

class Carousel {
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
    const children = this.data.map(url => {
      const element = <img src={url} />
      element.addEventListener('dragstart', event => event.preventDefault())
      return element
    })

    const root = (
      <div class='carousel'>
        {children}
      </div>
    )

    let position = 0

    const nextPic = () => {
      const nextPosition = (1 + position) % this.data.length

      const current = children[position]
      const next = children[nextPosition]

      current.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'

      current.style.transform = `translateX(${-100 * position}%)`
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

      setTimeout(() => {
        current.style.transition = 'ease 0.5s'
        next.style.transition = 'ease 0.5s'

        current.style.transform = `translateX(${-100 - 100 * position}%)`
        next.style.transform = `translateX(${-100 * nextPosition}%)`

        position = nextPosition
      }, 16)
      // setTimeout(nextPic, 3000)
    }
    setTimeout(nextPic, 3000)

    return root
  }

  mountTo (parent) {
    this.render().mountTo(parent)
  }
}

const compoment = (
  <Carousel data={[
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
  ]}
  />
)

compoment.mountTo(document.body)
