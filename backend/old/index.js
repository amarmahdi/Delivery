const server = require('./lib/server')
const cli = require('./lib/cli')

const app = {}

app.init = ()=>{
    server.init()
    setTimeout(() => {
        cli.init()
    }, 50);
}

app.init()

module.exports = app
//hello

