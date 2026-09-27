const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    name: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    price: Number,
    qty: Number,
    img: String,
})
const cart = mongoose.model("cart", cartSchema);

module.exports = cart