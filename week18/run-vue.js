// import compileTemplate from '@vue/compiler-sfc'
const compiler = require('@vue/compiler-sfc')

const output = compiler.compileTemplate(
  { filename: 'example.vue', source: '<div>Hello world!</div>' }
)

console.log(output)
