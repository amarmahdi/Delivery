const Items = require('./../models/Items')

const findAllItems = async ()=>{
    try {
        let ItemObj;
        const ItemList = await Items.findAll()
        ItemObj = ItemList
        return ItemObj
    } catch (error) {
        return error
    }
}

module.exports = { findAllItems }
