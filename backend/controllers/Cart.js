const Cart = require('./../models/Cart')
const User = require('./../models/User')
const Items = require('./../models/Items')

const AddToCart = async (req, res) => {
    try {
        const { userName, items } = req.body

        const user = await User.findOne({
            where: {
                name: userName
            }
        })

        const findItem = await Items.findAll()

        const arr = []

        items.forEach(e => {
            findItem.forEach(item => {
                if (item.itemName.indexOf(e) > -1) {
                    arr.push(item.id)
                }
            })
        })

        const CheckCart = await Cart.findOne({
            where: {
                UserId: user.id
            }
        })

        if (CheckCart === null) {
            console.log(CheckCart, '////// i am CheckCart /////')
            const CreateCart = await Cart.create({
                UserId: user.id,
                userEmail: user.email,
                userPhone: user.phone,
                orderd: false
            })
            const AddCartItems = await CreateCart.addItems(arr, CreateCart.id)
            res.send(AddCartItems)
        }
        const AddCartItems = await CheckCart.addItems(arr, CheckCart.id)
        console.log(AddCartItems)
        res.send(AddCartItems)
    } catch (error) {
        res.send(error)
    }
}

const GetCart = async (req, res)=>{
    try {
        const { username } = req.params
        const userInfo = await User.findOne({
            where: {
                name: username
            }
        })
        const UserCart = await Cart.findOne({
            where: {
                UserId: userInfo.id
            }
        })
        const UserCartItems = await UserCart.getItems()
        let itemObj = []
        UserCartItems.forEach(e => {
            itemObj.push(e)
        })
        UserCart.items = itemObj
        res.send({cartInfo:UserCart, itemInfo: itemObj})
    } catch (error) {
        res.send(error)
    }
}

module.exports = { AddToCart, GetCart }