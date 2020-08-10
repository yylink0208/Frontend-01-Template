import { createElement } from './creatElement'
import { Timeline, Animation } from './animation'
import { ease } from './cubicBezier.js'
import { enableGesture } from './gusture'

export class Carousel {
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
    const timeline = new Timeline()
    timeline.start()

    let position = 0

    let nextPicStopHandler = null

    const children = this.data.map((url, currentPosition) => {
      const nextPosition = (currentPosition + 1) % this.data.length
      const lastPostion = (currentPosition - 1 + this.data.length) % this.data.length

      let offset = 0

      const onStart = () => {
        timeline.pause()
        clearTimeout(nextPicStopHandler)
        const currentElement = children[currentPosition]
        const currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])
        offset = currentTransformValue + 500 * currentPosition
      }

      const onPan = event => {
        const lastElement = children[lastPostion]
        const currentElement = children[currentPosition]
        const nextElement = children[nextPosition]
        const dx = event.clientX - event.startX

        const currentTransformValue = -500 * currentPosition + offset + dx
        const lastTransformValue = -500 - 500 * lastPostion + offset + dx
        const nextTransformValue = 500 - 500 * nextPosition + offset + dx

        lastElement.style.transform = `translateX(${lastTransformValue}px)`
        currentElement.style.transform = `translateX(${currentTransformValue}px)`
        nextElement.style.transform = `translateX(${nextTransformValue}px)`
      }

      const onPanend = event => {
        let direction = 0
        const dx = event.clientX - event.startX

        if (dx + offset > 250) {
          direction = 1
        } else if (dx - offset < -250) {
          direction = -1
        }

        timeline.reset()
        timeline.start()

        const lastElement = children[lastPostion]
        const currentElement = children[currentPosition]
        const nextElement = children[nextPosition]

        const lastTransformValue = -500 - 500 * lastPostion + offset + dx
        const currentTransformValue = -500 * currentPosition + offset + dx
        const nextTransformValue = 500 - 500 * nextPosition + offset + dx

        const lastAnimation = new Animation(lastElement.style, 'transform',
          lastTransformValue, -500 - 500 * lastPostion + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)

        const currentAnimation = new Animation(currentElement.style, 'transform',
          currentTransformValue, -500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)

        const nextAnimation = new Animation(nextElement.style, 'transform',
          nextTransformValue, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)

        timeline.add(lastAnimation)
        timeline.add(currentAnimation)
        timeline.add(nextAnimation)

        position = (position - direction + this.data.length) % this.data.length
        nextPicStopHandler = setTimeout(nextPic, 3000)
      }

      const element = <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture />
      element.style.transform = 'translateX(0px)'
      element.addEventListener('dragstart', event => event.preventDefault())
      return element
    })

    const root = (
      <div class='carousel'>
        {children}
      </div>
    )

    const nextPic = () => {
      const nextPosition = (1 + position) % this.data.length

      const current = children[position]
      const next = children[nextPosition]

      const currentAnimation = new Animation(current.style, 'transform',
        -100 * position, -100 - 100 * position, 500, 0, ease, v => `translateX(${5 * v}px)`)

      const nextAnimation = new Animation(next.style, 'transform',
        100 - 100 * nextPosition, -100 * nextPosition, 500, 0, ease, v => `translateX(${5 * v}px)`)

      timeline.add(currentAnimation)
      timeline.add(nextAnimation)
      timeline.start()

      position = nextPosition

      nextPicStopHandler = setTimeout(nextPic, 3000)
    }
    nextPicStopHandler = setTimeout(nextPic, 3000)

    return root
  }

  mountTo (parent) {
    this.render().mountTo(parent)
  }
}
