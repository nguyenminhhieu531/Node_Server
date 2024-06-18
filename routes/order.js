const express = require("express")
const router = express.Router()
const {createOrder} = require('@services/order')
const {updateQuantityListProduct} = require('@services/product')


router.post('/', async (req, res, next)=>{
    try {
        const {customer, listProduct, status} = req.body;
        await updateQuantityListProduct(listProduct)
        let data = await createOrder({customer, listProduct, status})

        return res.json(data)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = router