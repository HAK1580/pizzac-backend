const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  // Make user optional so guest orders can be saved without a userId
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false, default: null },
  guestId: { type: String, default: null },
  guestInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      img: String,
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    phone: String,
  },
  paymentMethod: { type: String, enum: ['COD', 'card'], default: 'COD' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })

const order = mongoose.model("order", orderSchema)

module.exports = order