// Importing Dependencies 
const Sequelize = require('sequelize')
const config = require('./../config/config')
// const Items = require('./Items')


// constructing db object 
const db = {}

// initiating sequelizer
const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

db.sequelize = sequelize
db.Sequelize = Sequelize

// exporting db 
module.exports = db