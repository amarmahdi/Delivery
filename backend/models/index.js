const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const User = require('./User')
const db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options,
)

db.sequelize = sequelize
db.Sequelize = Sequelize

// console.log(db.model)

module.exports = db