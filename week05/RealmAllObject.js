const set = new Set()

const globalProperties = [
  'Infinity',
  'NaN',
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Array',
  'ArrayBuffer',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'URIError',
  'WeakMap',
  'WeakSet',
  'Atomics',
  'JSON',
  'Math',
  'Reflect'
]

const queue = []

for (const p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p]
  })
}

let current
while (queue.length) {
  current = queue.pop()
  // if(current.path.includes('RegExp')){
  //     console.log(set.has(current.object),current)
  // }
  if (set.has(current.object)) continue
  console.log(current.path.join('.'))

  set.add(current.object)

  const proto = Object.getPrototypeOf(current.object)
  if (proto) {
    queue.push({
      path: current.path.concat('__proto__'),
      object: proto
    })
  }

  for (const p of Object.getOwnPropertyNames(current.object)) {
    const property = Object.getOwnPropertyDescriptor(current.object, p)

    if (property.hasOwnProperty('value') &&
        ((property.value != null && typeof property.value === 'object') || (typeof property.value === 'object')) &&
        property.value instanceof Object) {
      queue.push({
        path: current.path.concat([p]),
        object: property.value
      })
    }

    if (property.hasOwnProperty('get') && typeof property.get === 'function') {
      queue.push({
        path: current.path.concat(`${[p]}(get)`),
        object: property.get
      })
    }

    if (property.hasOwnProperty('set') && typeof property.set === 'function') {
      queue.push({
        path: current.path.concat(`${[p]}(set)`),
        object: property.set
      })
    }
  }
}
