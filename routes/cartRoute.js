const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const { getCartItems, createCartItems, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController')

router.get('/', checkAuth, getCartItems)
router.post('/', checkAuth, createCartItems)
router.patch('/:id', checkAuth, updateCartItem)
router.delete('/:id', checkAuth, removeCartItem)
router.delete('/', checkAuth, clearCart)

module.exports = router