const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/checkAuth')
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController')

router.post('/', verifyToken, placeOrder)
router.get('/', verifyToken, getMyOrders)
router.get('/:id', verifyToken, getOrderById)
router.patch('/:id/status', verifyToken, updateOrderStatus)

module.exports = router