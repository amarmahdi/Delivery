const foods = {}

foods.menuItems = [
    { 'type': 'food', 'name': "burger", 'price': 2000, 'desc': "something something", 'available': true },
    { 'type': 'food', 'name': 'pizza', 'price': 2000 , 'desc': "something something" , 'available': true },
    { 'type': 'drink', 'name': "water", 'price': 2000 , 'desc': "something something" , 'available': true },
    { 'type': 'drink', 'name': "cocacola", 'price': 2000 , 'desc': "something something" , 'available': true },
    { 'type': 'drink', 'name': "sprite", 'price': 2000 , 'desc': "something something" , 'available': true },
]

foods.searcher = (val) => {
    if (val) {
        let item = []
        let totalPrice = 0
        val.forEach(q => {
            foods.menuItems.forEach(e => {
                if (q == e.name) {
                    let items = {}
                    items.type = e.type
                    items.name = e.name
                    items.price = e.price
                    items.desc = e.desc
                    items.available = e.available
                    totalPrice += items.price
                    item.push(items)
                }
            })
        })
        let total = {}
        total.totalPrice = totalPrice
        item.push(total)
        return item
    } else {
        return false
    }
}

module.exports = foods