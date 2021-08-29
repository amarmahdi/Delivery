const db = require('./index')
const Items = require('./Items')
const User = require('./User')

const Cart = db.sequelize.define('Carts', {
    id: {
        type: db.Sequelize.DataTypes.UUID,
        defaultValue: db.Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
    },
    userEmail: {
        type: db.Sequelize.DataTypes.STRING,
    },
    userPhone: {
        type: db.Sequelize.DataTypes.STRING
    },
    orderd: {
        type: db.Sequelize.DataTypes.BOOLEAN
    }
})


module.exports = Cart