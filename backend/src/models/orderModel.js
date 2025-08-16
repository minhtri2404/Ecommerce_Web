const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' }, // tham chiếu gốc
      name: { type: String, required: true },   // tên sản phẩm lúc đặt
      price: { type: Number, required: true },  // giá lúc đặt
      quantity: { type: Number, required: true },
      size: { type: String },
      color: { type: String },
      image: { type: String }, // hình ảnh tại thời điểm đặt
    }
  ],
  totalAmount: { type: Number, required: true },

  // Giảm giá
  discountCode: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },

  // Địa chỉ giao hàng chi tiết
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
  },

  // Thanh toán
  paymentMethod: { type: String, enum: ['cod', 'momo'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },

  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
