const OrderModel = require('@models/Order')

async function createOrder(newOrder){
    return OrderModel.create(newOrder)
}

module.exports = {
    createOrder
}