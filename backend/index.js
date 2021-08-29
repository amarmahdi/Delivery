const express = require('express')
const app = express()
const { arr, persons } = require('./new')
const people = require('./routers/people')
const auth = require('./routers/auth')
const { sequelize } = require('./models')
const AuthPolicy = require('./policies/AuthPolicy')
const { LogAuth } = require('./controllers/authController')

app.use(express.static('./public'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api', people)

app.use('/login', auth)

const init = async ()=>{
    const seq = await sequelize.sync()
    app.listen(3000, () => {
        console.log('server is listening on port 3000')
    })
}

init()
