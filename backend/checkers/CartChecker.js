const Cart = require('./../models/Cart')

const findCart = async (userid)=>{
    try { 
        await Cart.findOne({
            where: {
                UserId: userid
            }
        }) 
    } catch (error) {
        return error
    }
}

module.exports = { findCart }
