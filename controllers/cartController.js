const cart = require('../models/cartSchema')

// Helper function to dynamically construct the ownership query
const getCartQuery = (req) => {
    if (req.user && req.user.id) {
        return { user: req.user.id }
    }
    const guestId = req.headers['x-guest-id'] || req.body.guestId || req.query.guestId
    if (guestId) {
        return { guestId }
    }
    return null
}

// GET /api/cart
const getCartItems = async (req, res) => {
    try {
        const query = getCartQuery(req)
        if (!query) {
            return res.status(200).json({ message: 'Cart fetched successfully', cart_items: [] })
        }

        const cart_items = await cart.find(query)
        res.status(200).json({ message: 'Cart fetched successfully', cart_items })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// POST /api/cart
const createCartItems = async (req, res) => {
    const { name, price, qty, img, guestId } = req.body

    const userId = req.user?.id || null
    const finalGuestId = !userId ? (guestId || req.headers['x-guest-id']) : null

    if (!userId && !finalGuestId) {
        return res.status(400).json({ message: 'User ID or Guest ID is required' })
    }

    try {
        const query = userId ? { user: userId, name } : { guestId: finalGuestId, name }
        const existing_item = await cart.findOne(query)

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
            user: userId,
            guestId: finalGuestId,
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
        const query = getCartQuery(req)
        if (!query) {
            return res.status(400).json({ message: 'User ID or Guest ID is required' })
        }

        const item = await cart.findOne({ _id: id, ...query })
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
        const query = getCartQuery(req)
        if (!query) {
            return res.status(400).json({ message: 'User ID or Guest ID is required' })
        }

        const deleted = await cart.findOneAndDelete({ _id: id, ...query })
        if (!deleted) {
            return res.status(404).json({ message: 'Cart item not found' })
        }

        res.status(200).json({ message: 'Item removed' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// DELETE /api/carta
const clearCart = async (req, res) => {
    try {
        const query = getCartQuery(req)
        if (!query) {
            return res.status(400).json({ message: 'User ID or Guest ID is required' })
        }

        await cart.deleteMany(query)
        res.status(200).json({ message: 'Cart cleared' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// POST /api/cart/merge (Call after user logs in)
const mergeCart = async (req, res) => {
    const { guestId } = req.body
    const userId = req.user?.id

    if (!userId || !guestId) {
        return res.status(400).json({ message: 'Both User authentication and Guest ID are required' })
    }

    try {
        const guestItems = await cart.find({ guestId })

        for (const item of guestItems) {
            const userItem = await cart.findOne({ user: userId, name: item.name })

            if (userItem) {
                userItem.qty += item.qty
                await userItem.save()
                await cart.findByIdAndDelete(item._id)
            } else {
                item.user = userId
                item.guestId = null
                await item.save()
            }
        }

        const updatedCart = await cart.find({ user: userId })
        res.status(200).json({ message: 'Cart merged successfully', cart_items: updatedCart })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

module.exports = {
    getCartItems,
    createCartItems,
    updateCartItem,
    removeCartItem,
    clearCart,
    mergeCart
}