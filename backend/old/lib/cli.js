const readline = require('readline')
const util = require('util')
const debug = util.debuglog('cli')
const events = require('events')
const internal = require('stream')
class _events extends events {}
const e = new _events()
const foods = require('./foods')
const _data = require('./crud')


let cli = {}


cli.init = ()=>{
    console.log("cli started")
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    })
    _interface.prompt()

    _interface.on('line', (str)=>{
        cli.inputProcessor(str)
        _interface.prompt()
    })

}
cli.inputProcessor = (str)=>{
    str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false
    if(str){
        let inputs = [
            'help',
            'man',
            'exit',
            'current menu items',
            'all recent orders',
            'order detail',
            'view users',
            'view user detail'
        ]
        let matchfound = false
        let counter = 0
        inputs.some((inp)=>{
            if(str.toLowerCase().indexOf(inp) > -1){
                matchfound = true
                e.emit(inp,str)
            }
        })
        if(!matchfound){
            console.log('no mathch found. please try again')
        }
    }
}

e.on('man',()=>{
    cli.handlers.help()
})

e.on('help',()=>{
    cli.handlers.help()
})

e.on('exit', ()=>{
    cli.handlers.exit()
})

e.on('current menu items', ()=>{
    cli.handlers.menu()
})

e.on('all recent orders', ()=>{
    cli.handlers.orders()
})

e.on('order detail', (id)=>{
    cli.handlers.orderDetail(id)
})

e.on('view users', ()=>{
    cli.handlers.listAllUsers()
})

e.on('view user detail', (email)=>{
    cli.handlers.userDetail(email)
})

cli.handlers = {}

cli.handlers.help = ()=>{
    console.log('you have askend for help')
}

cli.handlers.exit = ()=>{
    process.exit(0)
}

cli.handlers.menu = ()=>{
    foods.menuItems.forEach(e=>{
        for(let i in e){
            console.log(`${i} \t\t\t ${e[i]}`)
        }
        console.log('\n')
    })
}

cli.handlers.orders = ()=>{
    let cou = 0
    _data.list('orders', (err, data)=>{
        data.forEach((e)=>{
            _data.read('orders', e, (err, orderData)=>{
                console.log(`${orderData.orderedBy} - ${e}`)
            })
            cou++
        })
    })
}

cli.handlers.orderDetail = (id)=>{
    let arr = id.split('--')
    let userId = typeof arr[1] === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false
    if(userId){
        _data.read('orders', userId, (err, data)=>{
            console.log(data)
        })
    }
}

cli.handlers.listAllUsers = ()=>{
    let cou = 1
    _data.list('users', (err, data)=>{
        data.forEach((e)=>{
            console.log(`user ${cou} - ${e}`)
            cou++
        })
    })
}

cli.handlers.userDetail = (email)=>{
    let arr = email.split('--')
    let userEmail = typeof arr[1] === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false
    if(userEmail){
        _data.read('users', userEmail, (err, data)=>{
            delete data.password
            console.log(data)
        })
    }
}

module.exports = cli
