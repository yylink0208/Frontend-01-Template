const net = require('net')

class Request {
  // method, url = host + port + path
  // body: k/v
  // headers
  constructor (options) {
    const {
      method = 'GET',
      host,
      port = 80,
      body = {},
      headers = {},
      path = '/'
    } = options

    this.method = method
    this.host = host
    this.body = body
    this.headers = headers
    this.path = path
    this.port = port

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }

  toString () {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
  }

  send (connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }

      connection.on('data', (data) => {
        parser.receive(data.toString())
        if (parser.isFinished) {
          resolve(parser.getResponse)
        }
        // resolve(data.toString())
        connection.end()
      })

      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }
}

class ResponseParser {
  constructor () {
    this.WAITTING_STATUS_LINE = 0
    this.WAITTING_STATUS_LINE_END = 1
    this.WAITTING_HEADER_NAME = 2
    this.WAITTING_HEADER_VALUE = 3
    this.WAITTING_HEADER_SPACE = 4
    this.WAITTING_HEADER_LINE_END = 5
    this.WAITTING_HEADER_BLOCK_END = 6
    this.WAITTING_BODY = 7

    this.current = this.WAITTING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
    this.handeMap = {
      0: this.HANDLE_STATUS_LINE,
      1: this.HANDLE_STATUS_LINE_END,
      2: this.HANDLE_HEADER_NAME,
      3: this.HANDLE_HEADER_VALUE,
      4: this.HANDLE_HEADER_SPACE,
      5: this.HANDLE_HEADER_LINE_END,
      6: this.HANDLE_HEADER_BLOCK_END,
      7: this.HANDLE_BODY
    }
  }

  HANDLE_STATUS_LINE (char) {
    if (char === '\r') {
      this.current = this.WAITTING_STATUS_LINE_END
    } else {
      this.statusLine += char
    }
  }

  HANDLE_STATUS_LINE_END (char) {
    if (char === '\n') {
      this.current = this.WAITTING_HEADER_NAME
    }
  }

  HANDLE_HEADER_NAME (char) {
    if (char === ':') {
      this.current = this.WAITTING_HEADER_SPACE
    } else if (char === '\r') {
      this.current = this.WAITTING_HEADER_BLOCK_END
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParser = new TrunkedBodyParser()
      }
    } else {
      this.headerName += char
    }
  }

  HANDLE_HEADER_SPACE (char) {
    if (char === ' ') {
      this.current = this.WAITTING_HEADER_VALUE
    }
  }

  HANDLE_HEADER_VALUE (char) {
    if (char === '\r') {
      this.current = this.WAITTING_HEADER_LINE_END
      this.headers[this.headerName] = this.headerValue
      this.headerValue = ''
      this.headerName = ''
    } else {
      this.headerValue += char
    }
  }

  HANDLE_HEADER_LINE_END (char) {
    if (char === '\n') {
      this.current = this.WAITTING_HEADER_NAME
    }
  }

  HANDLE_HEADER_BLOCK_END (char) {
    if (char === '\n') {
      this.current = this.WAITTING_BODY
    }
  }

  HANDLE_BODY (char) {
    this.bodyParser.receiveChar(char)
  }

  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get getResponse () {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    console.log(this.bodyParser.content)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive (string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  receiveChar (char) {
    this.handeMap[this.current].call(this, char)
  }
}

class TrunkedBodyParser {
  constructor () {
    this.WAITTING_LENGTH = 0
    this.WAITTING_LENGTH_LIEN_END = 1
    this.READING_TRUNK = 2
    this.WAITTING_NEW_LINE = 3
    this.WAITTING_NEW_LINE_END = 4
    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITTING_LENGTH
    this.handleMap = {
      0: this.HANDLE_LENGTH,
      1: this.HANDLE_LENGTH_LIEN_END,
      2: this.HANDLE_READING_TRUNK,
      3: this.HANDLE_NEW_LINE,
      4: this.HANDLE_NEW_LINE_END
    }
  }

  HANDLE_LENGTH (char) {
    if (char === '\r') {
      if (this.length === 0) {
        this.isFinished = true
      }
      this.current = this.WAITTING_LENGTH_LIEN_END
    } else {
      this.length *= 10
      this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
    }
  }

  HANDLE_LENGTH_LIEN_END (char) {
    if (char === '\n') {
      this.current = this.READING_TRUNK
    }
  }

  HANDLE_READING_TRUNK (char) {
    this.content.push(char)
    this.length--
    if (this.length === 0) {
      this.current = this.WAITTING_NEW_LINE
    }
  }

  HANDLE_NEW_LINE (char) {
    if (char === '\r') {
      this.current = this.WAITTING_NEW_LINE_END
    }
  }

  HANDLE_NEW_LINE_END (char) {
    if (char === '\n') {
      this.current = this.WAITTING_LENGTH
    }
  }

  receiveChar (char) {
    if (this.isFinished) return
    this.handleMap[this.current].call(this, char)
  }
}

(async function () {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    body: {
      text: 'hello world'
    }
  })

  const res = await request.send()
  console.log(res)
})()

// const client = net.createConnection({
//     host: '127.0.0.1',
//     port: 8088
// }, () => {
//     // 'connect' 监听器
//     let request = new Request({
//         method: "POST",
//         host: '127.0.0.1',
//         port: 8088,
//         path: "/",
//         body: {
//             text: "hello world"
//         }
//     })
//     console.log(request.toString())
//     client.write(request.toString())
// });
// client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
// });
// client.on('end', () => {
//     console.log('已从服务器断开');
// });
