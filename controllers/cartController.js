const cart = require('../models/cartSchema')

// GET /api/cart
const getCartItems = async (req, res) => {
    try {
        const cart_items = await cart.find({ user: req.user.id })
        res.status(200).json({ message: 'Cart fetched successfully', cart_items })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

const createCartItems = async (req, res) => {
    const { name, price, qty, img } = req.body
    try {
        const existing_item = await cart.findOne({ user: req.user.id, name })

        if (existing_item) {
            existing_item.qty += qty || 1
            await existing_item.save()
            return res.status(200).json({ message: 'Quantity updated', cart_item: existing_item })
        }

        const new_cart_item = await cart.create({
            name,
            price,
            qty: qty || 1,
            img,
            user: req.user.id,
        })
        res.status(201).json({ message: 'Item added to cart', cart_item: new_cart_item })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// PATCH /api/cart/:id   body: { qty }
const updateCartItem = async (req, res) => {
    const { id } = req.params
    const { qty } = req.body
    try {
        const item = await cart.findOne({ _id: id, user: req.user.id })
        if (!item) {
            return res.status(404).json({ message: 'Cart item not found' })
        }

        item.qty = Math.max(1, qty)
        await item.save()

        res.status(200).json({ message: 'Quantity updated', cart_item: item })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// DELETE /api/cart/:id
const removeCartItem = async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await cart.findOneAndDelete({ _id: id, user: req.user.id })
        if (!deleted) {
            return res.status(404).json({ message: 'Cart item not found' })
        }

        res.status(200).json({ message: 'Item removed' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// DELETE /api/cart
const clearCart = async (req, res) => {
    try {
        await cart.deleteMany({ user: req.user.id })
        res.status(200).json({ message: 'Cart cleared' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

module.exports = { getCartItems, createCartItems, updateCartItem, removeCartItem, clearCart }