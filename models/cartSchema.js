const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    guestId: { type: String, default: null },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    img: String,
}, { timestamps: true });

const cart = mongoose.model("cart", cartSchema);

module.exports = cart