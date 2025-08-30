const User = require('../models/userModel');
const Order = require("../models/orderModel")
const Product = require('../models/productModel')

class DashBoardController{
    // Lấy tất cả tổng Customer, Order, Porduct trong cart
    getAllDashboard = async(req, res) => {
        try {
            const totalCustomer = await User.countDocuments({ role: "customer"})
            const totalProduct = await Product.countDocuments()
            const totalOrder = await Order.countDocuments()

            // 4. Doanh thu(chỉ tính đơn hàng đã thanh toán thành công)
            const revenueData = await Order.aggregate([
                {
                    $match: {
                        $or: [
                            // Đơn COD: chỉ tính khi giao thành công
                            { paymentMethod: "cod", paymentStatus: "paid", status: "delivered" },

                            // Đơn online: đã trả tiền thì tính ngay
                            { paymentMethod: { $ne: "cod" }, paymentStatus: "paid" }
                        ]
                    },
                },
                {
                    $group:{
                        _id: null,
                        totalRevenue: {$sum: "$totalAmount"}
                    },
                },
            ])
            const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
            return res.status(200).json({
                success: true,
                data: {
                    customer: totalCustomer,
                    product: totalProduct,
                    order: totalOrder,
                    revenue: totalRevenue
                }
            })

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}

module.exports = new DashBoardController()
