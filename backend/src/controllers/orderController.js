const Order = require("../models/orderModel")
const Cart = require('../models/cartModel')
const Product = require("../models/productModel");

class OrderController{
    // Tạo đơn hàng
    createOrder = async (req, res) => {
        try {
            const userId = req.user._id;
            const { shippingAddress, paymentMethod, discountCode } = req.body;

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
            const subtotal  = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
            let discountValue = 0;
            if (discountCode === "SALE20") {
                discountValue = subtotal * 0.2; // giảm 20%
            }
            const totalAmount = subtotal - discountValue;

            // 🔑 Xác định paymentStatus
            const paymentStatus = 'pending';

            const newOrder = new Order({
                user: userId,
                products: orderProducts,
                totalAmount,
                discountCode,
                discountAmount: discountValue,
                shippingAddress,
                paymentMethod,
                paymentStatus,
            });

            await newOrder.save();

            // Xóa giỏ hàng
            await Cart.findOneAndUpdate({ user: userId }, { items: [] });

            return res.status(201).json({ success: true, message: 'Đặt hàng thành công', order: newOrder });
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Lấy tất cả đơn hàng của người dùng
    getAllOrders = async(req, res) => {
        try {
            const orders = await Order.find()
                .populate('user', 'name email') // lấy thông tin user
                .populate('products.product', 'name price images')
                .sort({ createdAt: -1 });
            // Kiểm tra nếu không có đơn hàng nào
            if (!orders || orders.length === 0) {
                return res.status(404).json({ success: false, message: 'Không có đơn hàng nào' });
            }

            return res.status(200).json({ success: true, orders });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    // lấy đơn hàng theo customer
    getMyOrder = async(req, res) => {
        try {
            const userId = req.user._id;
            const orders = await Order.find({user: userId})
                .populate('user', 'name email') // lấy thông tin user
            return res.status(200).json({success: true, orders})
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    // Lấy đơn hàng theo ID
    getOrderById = async(req, res) => {
        try {
            const {id} = req.params
            const order = await Order.findById(id)
                .populate('user', 'name email') // lấy thông tin user
                .populate('products.product', 'name price images');

            if (!order) {
                return res.status(404).json({success: false, message: 'Không có đơn hàng nào'})
            }

            return res.status(200).json({success: true, order})
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }
    
    // Cập nhật trạng thái đơn hàng
    updateOrderStatus = async(req, res) => {
        try {
            const {id} = req.params
            const {status} = req.body

            // Kiểm tra trạng thái hợp lệ
            const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ' });
            }

            // Tạo object update
            const updateFields = { status };
            if (status === 'delivered') {
                updateFields.paymentStatus = 'paid';
            } else if (status === 'cancelled') {
                updateFields.paymentStatus = 'failed';
            } else {
            // các trạng thái còn lại thì để pending
                updateFields.paymentStatus = 'pending';
            }

            const orderStatus = await Order.findByIdAndUpdate(id, updateFields, {new: true})
            if (!orderStatus) {
                return res.status(404).json({success: false, message: 'Không tìm thấy đơn hàng nào'})
            }

            return res.status(200).json({success: true, message: 'Cập nhật trạng thái đơn hàng thành công', orderStatus})
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }
}

module.exports = new OrderController();