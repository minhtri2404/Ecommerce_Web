const Coupon = require('../models/couponModel')

class CouponController{
    // Thêm mã giảm giá
    addCoupon = async(req, res) => {
        try {
            const {code, discountType, discountValue, minOrderAmount, startDate, endDate, usageLimit, isActive} = req.body
            // Kiểm tra xem code có tồn tại chưa
            const existingCoupon  = await Coupon.findOne({ code })
            if (existingCoupon) {
                return res.status(400).json({success: false, message: 'Mã giảm giá đã tồn tại'})
            }

            // Kiểm tra ngày bắt đầu < ngày kết thúc
            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({success: false, message: 'Ngày bắt đầu phải trước ngày kết thúc'})
            }
            // Kiểm tra giá trị giảm phải  > 0
            if (discountValue <= 0) {
                return res.status(400).json({success: false, message: 'Giá trị giảm giá phải lớn hơn 0'})
            }

            // Tạo mã giảm giá mới
            const newCoupon = new Coupon({
                code, discountType, discountValue, minOrderAmount, startDate, endDate, usageLimit, isActive
            })

            await newCoupon.save()
            return res.status(201).json({success: true, message: 'Tạo mã giảm giá thành công', coupon: newCoupon})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }

    // Hiển thị tất cả mã giảm giá
    getAllCoupon = async(req, res) => {
        try {
            const coupon = await Coupon.find()
            return res.status(200).json({success: true, coupon})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }

    // HIển thị mã giảm giá thei ID
    getCoupon = async(req, res) => {
        try {
            const {id} = req.params
            const coupon = await Coupon.findById(id)
            return res.status(200).json({success: true, coupon})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }

    // Cập nhật mã giảm giá
    updateCoupon = async(req, res) => {
        try {
            const {id} = req.params
            const {code, discountType, discountValue, minOrderAmount, startDate, endDate, usageLimit, isActive} = req.body

            // Kiểm tra xem code có tồn tại chưa
            const existingCoupon  = await Coupon.findOne({ code, _id: { $ne: id } })
            if (existingCoupon) {
                return res.status(400).json({success: false, message: 'Mã giảm giá đã tồn tại'})
            }

            // Kiểm tra ngày bắt đầu < ngày kết thúc
            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({success: false, message: 'Ngày bắt đầu phải trước ngày kết thúc'})
            }
            // Kiểm tra giá trị giảm phải  > 0
            if (discountValue <= 0) {
                return res.status(400).json({success: false, message: 'Giá trị giảm giá phải lớn hơn 0'})
            }

            const updateData = {
                code, discountType, discountValue, minOrderAmount, startDate, endDate, usageLimit, isActive
            }

            const updateCoupon = await Coupon.findByIdAndUpdate(id, updateData, {new: true})
            return res.status(200).json({success: true, message: 'Cập nhật mã giảm giá thành công', coupon: updateCoupon})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }

    // Xóa mã giảm giá
    deleteCoupon = async(req, res) => {
        try {
            const {id} = req.params
            const deleteCoupon = await Coupon.findByIdAndDelete(id)
            return res.status(200).json({success: true, message: 'Xóa mã giảm giá thành công', coupon: deleteCoupon})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }   
}


module.exports = new CouponController()
