const npm = require('npm')

const config = {
  name: 'npm-dome',
  version: '1.0.0',
  description: '',
  main: 'index.js',
  scripts: {
    test: 'echo "Error: no test specified" && exit 1'
  },
  author: '',
  license: 'ISC',
  dependencies: {
    npm: '^6.14.8'
  }
}

npm.load(config, (err) => {
  console.log(err)
  npm.install('webpack', (e) => {
    console.log(e)
  })
})
