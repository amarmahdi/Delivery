const db = require('./index')
const Carts = require('./Cart')
const User = require('./User')

const Items = db.sequelize.define('Items', {
    id: {
        type: db.Sequelize.DataTypes.UUID,
        defaultValue: db.Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
    },
    itemName: {
        type: db.Sequelize.DataTypes.STRING
    },
    itemType: {
        type: db.Sequelize.DataTypes.STRING
    },
    itemPrice: {
        type: db.Sequelize.DataTypes.STRING
    },
    itemDescription: {
        type: db.Sequelize.DataTypes.TEXT
    },
    available: {
        type: db.Sequelize.DataTypes.BOOLEAN
    }
})

const createFood = async (num) => {
    const food1 = {
        itemName: "burgur" + num,
        itemType: 'food',
        itemPrice: "2000",
        itemDescription: "something something ",
        available: true
    }
    try {
        const create = await Items.create(food1)
        console.log(create, '/////////////// created ////////////////////')
    } catch (error) {
        console.log(error, '/////////////////////////////////')
    }
}
// for(let i = 1; i < 6; i++){
//     createFood(i)
// }
// createFood(1)

module.exports = Items