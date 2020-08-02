export class Timeline {
  constructor () {
    this.animations = []
    this.requestId = null
    this.state = 'inited'
    this.tick = () => {
      const t = Date.now() - this.startTime
      //   console.log(t)

      const animations = this.animations.filter(animation => !animation.finished)

      for (const animation of animations) {
        const { object, property, start, end, timingFunction, delay, template, duration, addTime } = animation

        let progression = timingFunction((t - delay - addTime) / duration) // 0-1之间的数

        if (t > duration + delay + addTime) {
          progression = 1
          animation.finished = true
        }

        const value = animation.valueFromProgression(progression) // 根据progression算出的当前值

        object[property] = template(value)
      }

      if (animations.length) {
        this.requestId = requestAnimationFrame(this.tick)
      }
    }
  }

  start () {
    if (this.state !== 'inited') return
    this.state = 'playing'
    this.startTime = Date.now()
    this.tick()
  }

  restart () {
    if (this.state === 'playing') {
      this.pause()
    }
    this.animations = []
    this.requestId = null
    this.state = 'inited'
    this.startTime = Date.now()
    this.pauseTime = null
    this.tick()
  }

  pause () {
    if (this.state !== 'playind') return
    this.state = 'paused'
    this.pauseTime = Date.now()
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId)
    }
  }

  resume () {
    if (this.state !== 'paused') return
    this.state = 'playing'
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }

  add (animation, addTime) {
    animation.finished = false
    if (this.state === 'playing') {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0
    }
    this.animations.push(animation)
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
