const express = require('express')
const router = express.Router()
const optionalAuth = require('../middleware/optionalAuth')
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController')

router.post('/', optionalAuth, placeOrder)
router.get('/', optionalAuth, getMyOrders)
router.get('/:id', optionalAuth, getOrderById)
router.patch('/:id/status', updateOrderStatus) // keep protected by admin middleware if required

module.exports = router