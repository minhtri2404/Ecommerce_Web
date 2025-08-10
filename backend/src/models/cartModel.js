const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min: 1 },
            size: { type: String },
            color: { type: String },
            price: { type: Number, required: true },
            image: { type: String }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
