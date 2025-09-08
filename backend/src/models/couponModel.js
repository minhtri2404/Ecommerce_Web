const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // mã giảm giá
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, 
    // loại giảm giá: "percentage" (theo phần trăm) hoặc "fixed" (số tiền cố định)
    
    discountValue: { type: Number, required: true },  // giá trị giảm (ví dụ: 10% hoặc 50,000đ)
    minOrderAmount: { type: Number, default: 0 },  // số tiền đơn hàng tối thiểu để áp dụng mã
    startDate: { type: Date, required: true }, // ngày bắt đầu hiệu lực
    endDate: { type: Date, required: true },   // ngày hết hạn
    usageLimit: { type: Number }, // số lần tối đa mã giảm giá này được sử dụng
    usedCount: { type: Number, default: 0 }, // số lần đã sử dụng thực tế
    isActive: { type: Boolean, default: true },   // trạng thái mã (đang hoạt động hay không)
    createdAt: { type: Date, default: Date.now }, // ngày tạo mã
    updatedAt: {type: Date, default: Date.now},
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
