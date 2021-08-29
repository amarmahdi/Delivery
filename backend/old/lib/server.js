const http = require('http')
const url = require('url')
const config = require('./config')
const StringDecoder = require('string_decoder').StringDecoder
const handler = require('./handler')
const helpers = require('./helpers')

const server = {}

server.listenerCallback = () => {
    console.log('Server is listening to port: ', config.port)
}

server.httpServer = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true)
    let path = parsedUrl.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g, '')
    let queryStringObject = parsedUrl.query
    let method = req.method.toLowerCase()
    let headers = req.headers

    let decoder = new StringDecoder('utf-8')
    let buffer = ''

    req.on('data', (data) => {
        buffer += decoder.write(data)
    })
    req.on('end', () => {
        buffer += decoder.end()
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        }
        let chosenRouter = typeof (server.routes[trimmedPath]) !== 'undefined' ? server.routes[trimmedPath] : handler.notFound
        chosenRouter(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200
            payload = typeof (payload) == 'object' ? payload : {}

            console.log(statusCode)

            let payloadString = JSON.stringify(payload)
            res.setHeader('Content-Type', 'application/json')
            if(req.method === 'OPTIONS'){
                console.log('this is from req server', req.method)
                res.setHeader('Content-Type', 'application/json')
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Access-Control-Allow-Headers', '*')
                res.setHeader('Access-Control-Allow-Methods', '*')
            }
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Headers', '*')
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH')
            res.writeHead(statusCode)
            res.end(payloadString)
            console.log(req.method)
            console.log('The server responded with this response: ', statusCode, payloadString)
        })
    })
})

server.init = () => {
    server.serverListener = server.httpServer.listen(config.port, server.listenerCallback)
}

server.routes = {
    'ping': handler.ping,
    'users': handler.users,
    'token': handler.token,
    'cart': handler.cart,
    'order': handler.order,
    'pay': handler.pay,
    'foods': handler.foods,
    'login': handler.login,
    'logout': handler.logout,
}

module.exports = server