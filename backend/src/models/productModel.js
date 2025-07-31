const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    images: [{ type: String }], // hỗ trợ nhiều ảnh
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    sizes: [{ type: String }], // ["S", "M", "L", "XL"]
    colors: [{ type: String }], // ["Red", "Blue", "Black"]
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
