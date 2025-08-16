const Order = require("../models/orderModel")
const Cart = require('../models/cartModel')
const Product = require("../models/productModel");

class OrderController{
    // Tạo đơn hàng
    createOrder = async (req, res) => {
        try {
            const userId = req.user._id;
            const { shippingAddress, paymentMethod, discountCode, discountAmount } = req.body;

            const cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
            }

            const orderProducts = [];

            for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) return res.status(400).json({ error: `Sản phẩm không tồn tại` });

            if (product.quantity < item.quantity) {
                return res.status(400).json({ error: `Sản phẩm ${product.name} không đủ số lượng (còn ${product.quantity})` });
            }

            // Trừ quantity trực tiếp
            product.quantity -= item.quantity;
            await product.save();

            orderProducts.push({
                product: product._id,
                name: product.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.image || product.images?.[0] || "",
            });
            }

            const totalAmount = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) - (discountAmount || 0);

            const newOrder = new Order({
            user: userId,
            products: orderProducts,
            totalAmount,
            discountCode,
            discountAmount,
            shippingAddress,
            paymentMethod,
            });

            await newOrder.save();

            // Xóa giỏ hàng
            await Cart.findOneAndUpdate({ user: userId }, { items: [] });

            return res.status(201).json({ success: true, message: 'Đặt hàng thành công', order: newOrder });
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}

module.exports = new OrderController();