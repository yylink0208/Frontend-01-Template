export class Timeline {
  constructor () {
    this.animations = new Set()
    this.finishedAnimations = new Set()
    this.requestId = null
    this.addTimes = new Map()
    this.state = 'inited'
    this.tick = () => {
      const t = Date.now() - this.startTime
      //   console.log(t)

      for (const animation of this.animations) {
        const { object, property, start, end, timingFunction, delay, template, duration } = animation

        const addTime = this.addTimes.get(animation)

        if (t < delay + addTime) {
          continue
        }

        let progression = timingFunction((t - delay - addTime) / duration) // 0-1之间的数

        if (t > duration + delay + addTime) {
          progression = 1
          this.animations.delete(animation)
          this.finishedAnimations.add(animation)
        }

        const value = animation.valueFromProgression(progression) // 根据progression算出的当前值
        object[property] = template(value)
      }

      if (this.animations.size) {
        this.requestId = requestAnimationFrame(this.tick)
      } else {
        this.requestId = null
      }
    }
  }

  start () {
    if (this.state !== 'inited') return
    this.state = 'playing'
    this.startTime = Date.now()
    this.tick()
  }

  reset () {
    if (this.state === 'playing') {
      this.pause()
    }
    this.animations = new Set()
    this.finishedAnimations = new Set()
    this.addTimes = new Map()
    this.requestId = null
    this.state = 'playing'
    this.startTime = Date.now()
    this.pauseTime = null
    this.state = 'inited'
  }

  restart () {
    if (this.state === 'playing') {
      this.pause()
    }

    for (const animation of this.finishedAnimations) {
      this.animations.add(animation)
    }

    this.finishedAnimations = new Set()
    this.requestId = null
    this.state = 'playing'
    this.startTime = Date.now()
    this.pauseTime = null
    this.tick()
  }

  pause () {
    if (this.state !== 'playing') return
    this.state = 'paused'
    this.pauseTime = Date.now()
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId)
      this.requestId = null
    }
  }

  resume () {
    if (this.state !== 'paused') return
    this.state = 'playing'
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }

  add (animation, addTime) {
    this.animations.add(animation)

    if (this.state === 'playing' && this.requestId === null) {
      this.tick()
    }

    if (this.state === 'playing') {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime)
    } else {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0)
    }
  }
}

export class Animation {
  constructor (object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.template = template
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay || 0
    this.timingFunction = timingFunction
  }

  valueFromProgression (progression) {
    return this.start + progression * (this.end - this.start)
  }
}

export class ColorAnimation {
  constructor (object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`)
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay || 0
    this.timingFunction = timingFunction
  }

  valueFromProgression (progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a)
    }
  }
}

/**
let animation = new Animiation(object,property,start,end,duration,delay,timingFunction)
let animation2 = new Animiation(object,property,start,end,duration,delay,timingFunction)

let timeline = new Timeline

timeline.add(animation)
timeline.add(animation2)

timeline.start()
timeline.pause()
timeline.resume()
timeline.stop()
 */
