// 匹配abababx
function match (string) {
  let state = start

  for (const s of string) {
    state = state(s)
  }
  return state === end
}

function end () {
  return end
}

function start (s) {
  if (s === 'a') {
    return findA1
  }
  return start
}

function findA1 (s) {
  if (s === 'b') {
    return findB1
  }
  return start(s)
}

function findB1 (s) {
  if (s === 'a') {
    return findA2
  }
  return start(s)
}

function findA2 (s) {
  if (s === 'b') {
    return findB2
  }
  return start(s)
}

function findB2 (s) {
  if (s === 'a') {
    return findA3
  }
  return start(s)
}

function findA3 (s) {
  if (s === 'b') {
    return findB3
  }
  return start(s)
}

function findB3 (s) {
  if (s === 'x') {
    return end
  } else if (s === 'a') {
    return findA3
  }
  return start(s)
}

console.log(match('ababababx')) // true
console.log(match('abababx')) // true
console.log(match('abxababaabx'))// false
