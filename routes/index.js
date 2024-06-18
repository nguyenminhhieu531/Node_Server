var express = require('express');
var router = express.Router();
var authRouter = require('./auth')
var uploadRouter = require('./upload')
var userRouter = require('./user')
var productRouter = require('./product')
var orderRouter = require('./order')
const {checkAuth, checkAdmin} = require('@middlewares/authen')
/* GET home page. */
router.use('/auth', authRouter)
router.use('/user', checkAuth, checkAdmin, userRouter)
router.use('/products', productRouter)
router.use('/orders', orderRouter)
router.use('/upload', uploadRouter)

module.exports = router;
