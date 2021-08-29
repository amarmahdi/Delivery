const express = require('express')
const app = express()
const config = require('./config/config')
const Auths = require('./routes/Auths')
const { sequelize } = require('./models')
const Items = require('./models/Items')
const Cart = require('./models/Cart')
const Relations = require('./models/Relations')
const Carts = require('./routes/Carts')
const Cors = require('cors')

Cart
Items
Relations

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(Cors())

app.use('/', Auths)
app.use('/cart', Carts)

const init = async ()=>{
    await sequelize.sync({alter: true})
    app.listen(config.port, ()=>{
        console.log(`Server listening on ${config.port}`)
    })
}

init()
