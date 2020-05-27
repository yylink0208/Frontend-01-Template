function getStyle (element) {
  if (!element.style) {
    element.style = {}
  }

  for (const prop of Object.keys(element.computedStyle)) {
    const p = element.computedStyle.value
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }

    if (element.style[prop].toString().match(/^[0-9'.']+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }

  return element.style
}

function layout (element) {
  if (!element.computedStyle) return

  const style = getStyle(element)

  if (element.display !== 'flex') return

  // 过滤网文本节点
  const items = element.children.filter(e => e.type === 'element')
  items.sort((a, b) => ((a.order || 0) - (b.order || 0)))

  const sizeList = ['width', 'height']
  sizeList.forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  // 设置默认值
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.flexDirection = 'stretch'
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'noWrap'
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.flexDirection = 'stretch'
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    { [crossStart, crossEnd] = [crossEnd, crossStart] }
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  let isAutoMainSize = false
  if (!style[mainSize]) {
    style[mainSize] = 0
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined) {
        // 此处如果多层嵌套且只有最内层元素设置了宽度的话 需要递归处理获取mainSize
        style[mainSize] += itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  /** ================================ */
  let flexLine = []
  const flexLines = [flexLine]
  let mainSpace = style[mainSize]
  let crossSpace = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'noWrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        // 设置单行高度
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      // 处理换行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
    }

    if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
      crossSpace = Math.max(crossSpace, itemStyle[crossSize])
    }
    mainSpace -= itemStyle[mainSize]
  }
  flexLine.mainSpace = mainSpace

  // 计算主轴
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    // 发生在单行 overflow状态下

    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      itemStyle[mainSize] *= scale

      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(items => {
      const mainSpace = items.mainSpace
      let flexTotal = 0
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemStyle = getStyle(item)

        if ((itemStyle.flex !== null) && (itemStyle.flex !== undefined)) {
          flexTotal += itemStyle.flexWrap
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const itemStyle = getStyle(item)

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flexWrap
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        // 没有flex属性的元素
        let currentMain
        let step
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          step = 0
        }

        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        }

        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          step = 0
        }

        if (style.justifyContent === 'space-between') {
          currentMain = mainBase
          step = mainSpace / (items.length - 1) * mainSign
        }

        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign
          currentMain = step / 2 + mainBase
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const itemStyle = getStyle(item)

          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }
}

module.exports = layout
