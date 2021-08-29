const db = require('./index')

const User = db.sequelize.define('Users', {
    id: {
        type: db.Sequelize.DataTypes.UUID,
        defaultValue: db.Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
    },
    name: {
        type: db.Sequelize.DataTypes.STRING
    },
    email: {
        type: db.Sequelize.DataTypes.STRING,
        unique: true
    },
    password: {
        type: db.Sequelize.DataTypes.STRING
    },
    phone: {
        type: db.Sequelize.DataTypes.STRING
    },
    streetAddress: {
        type: db.Sequelize.DataTypes.STRING
    }
})

module.exports = User