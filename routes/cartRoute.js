const express = require('express')
const router = express.Router()
const optionalAuth = require('../middleware/optionalAuth') // Use optionalAuth instead of checkAuth
const { getCartItems, createCartItems, updateCartItem, removeCartItem, clearCart, mergeCart } = require('../controllers/cartController')

router.get('/', optionalAuth, getCartItems)
router.post('/', optionalAuth, createCartItems)
router.patch('/:id', optionalAuth, updateCartItem)
router.delete('/:id', optionalAuth, removeCartItem)
router.delete('/', optionalAuth, clearCart)
router.post('/merge', optionalAuth, mergeCart)

module.exports = router