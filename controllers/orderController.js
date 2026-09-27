const cart = require('../models/cartSchema')
const order = require('../models/orderSchema')

// POST /api/orders   body: { deliveryAddress, paymentMethod }
const placeOrder = async (req, res) => {
    const { deliveryAddress, paymentMethod } = req.body
    try {
        const cart_items = await cart.find({ user: req.user.id })

        if (cart_items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' })
        }

        // calculate total on the server — never trust a total sent from the frontend
        const totalAmount = cart_items.reduce((sum, item) => sum + item.price * item.qty, 0)

        const new_order = await order.create({
            user: req.user.id,
            items: cart_items.map((item) => ({
                name: item.name,
                price: item.price,
                qty: item.qty,
                img: item.img,
            })),
            totalAmount,
            deliveryAddress,
            paymentMethod: paymentMethod || 'COD',
        })

        await cart.deleteMany({ user: req.user.id })

        res.status(201).json({ message: 'Order placed successfully', order: new_order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// GET /api/orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await order.find({ user: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ message: 'Orders fetched successfully', orders })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// GET /api/orders/:id
const getOrderById = async (req, res) => {
    const { id } = req.params
    try {
        const found_order = await order.findOne({ _id: id, user: req.user.id })
        if (!found_order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json({ message: 'Order fetched successfully', order: found_order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// PATCH /api/orders/:id/status   body: { status }
const updateOrderStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
        const updated_order = await order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        if (!updated_order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json({ message: 'Order status updated', order: updated_order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus }