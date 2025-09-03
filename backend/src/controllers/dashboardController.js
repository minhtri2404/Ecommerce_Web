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

    // Biểu đồ doanh thu theo tháng
    getRevenue = async(req, res) => {
        try {
            const revenue = await Order.aggregate([
                {
                    $match:{
                        $or: [
                            // Đơn COD: chỉ tính khi giao thành công
                            { paymentMethod: "cod", paymentStatus: "paid", status: "delivered" },

                            // Đơn online: đã trả tiền thì tính ngay
                            { paymentMethod: { $ne: "cod" }, paymentStatus: "paid" }
                        ]
                    },
                },
                {
                    $group: {
                        _id: {$month: "$createdAt"},
                        totalRevenue: { $sum: "$totalAmount" }
                    },
                },
                {
                    $sort: { "_id": 1 }
                }
            ])

            // Tạo mảng 12 tháng mặc định = 0
            let fullYearRevenue = Array.from({ length: 12 }, (_, i) => ({
                _id: i + 1,
                totalRevenue: 0
            }));

            // Gán dữ liệu thật vào mảng 12 tháng
            revenue.forEach(item => {
                const monthIndex = item._id - 1; // tháng 1 -> index 0
                fullYearRevenue[monthIndex].totalRevenue = item.totalRevenue;
            });

            return res.status(200).json({success: true, data: fullYearRevenue})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Biểu đồ cho thống kê thanh toán
    getPaymentStart = async(req, res) => {
        try {
            const paymentStart = await Order.aggregate([
                {
                    $match: { paymentStatus: "paid" } // chỉnh tính đơn hàng nào trạng thái paid
                },
                {
                    $group: {
                        _id: "$paymentMethod",
                        count: { $sum: 1 },
                        totalAmount: { $sum: "$totalAmount"}
                    }
                }
            ])

            return res.status(200).json({success: true, data: paymentStart})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}

module.exports = new DashBoardController()
