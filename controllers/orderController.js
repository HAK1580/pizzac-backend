const cart = require('../models/cartSchema')
const order = require('../models/orderSchema')

// POST /api/orders  body: { deliveryAddress, paymentMethod, guestInfo }
// POST /api/orders  body: { deliveryAddress, paymentMethod, guestId, guestInfo }
const placeOrder = async (req, res) => {
    const { deliveryAddress, paymentMethod, guestInfo, guestId: bodyGuestId } = req.body
    
    const userId = req.user ? req.user.id : null
    const guestId = req.headers['x-guest-id'] || bodyGuestId

    // Ensure we have either a logged-in user or a guest ID
    if (!userId && !guestId) {
        return res.status(400).json({ message: 'User ID or Guest ID required' })
    }

    try {
        // Build query carefully based on auth status
        const query = userId ? { user: userId } : { guestId: guestId }

        console.log('Searching cart with query:', query) // Debug log

        const cart_items = await cart.find(query)

        if (!cart_items || cart_items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' })
        }

        // Calculate total on server
        const totalAmount = cart_items.reduce((sum, item) => sum + item.price * item.qty, 0)

        const new_order = await order.create({
            user: userId || null,
            guestId: userId ? null : guestId,
            guestInfo: userId ? null : guestInfo,
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

        // Clear cart in DB after order creation
        await cart.deleteMany(query)

        res.status(201).json({ message: 'Order placed successfully', order: new_order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// GET /api/orders
const getMyOrders = async (req, res) => {
    try {
        // Guests cannot view order history via this route unless logged in
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

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
    const userId = req.user ? req.user.id : null
    const guestId = req.headers['x-guest-id']

    try {
        // Allow user to find by user ID OR guest to find by guestId
        const query = userId ? { _id: id, user: userId } : { _id: id, guestId }

        const found_order = await order.findOne(query)
        if (!found_order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json({ message: 'Order fetched successfully', order: found_order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'server error' })
    }
}

// PATCH /api/orders/:id/status  body: { status }
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