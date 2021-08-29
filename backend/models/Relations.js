const User = require('./User')
const Cart = require('./Cart')
const Items = require('./Items')

Cart.belongsToMany(Items, { through: 'CartItems' })
Items.belongsToMany(Cart, { through: 'CartItems' })
User.hasOne(Cart)
Cart.belongsTo(User)

async function a() {
    try {
        const car = await Cart.create()
        await car.addItems(['burgur1', 'burgur2', 'burgur3'])
        console.log(car)
    } catch (error) {
        console.log(error)
    }
}
// a()

