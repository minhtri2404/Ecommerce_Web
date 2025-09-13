const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/orderModel")

class PaymentController{
    createMoMo = async(req, res) => {
        try {
           const {id} = req.params;

           // Lấy thông tin đơn hàng từ cơ sở dữ liệu
           const order = await Order.findById(id)
           if (!order) {
                return res.status(404).json({success: false, message: 'Không tìm thấy đơn hàng'})
           }

           // Thông tin MoMo test
           const partnerCode = process.env.MOMO_PARTNER_CODE;
           const accessKey = process.env.MOMO_ACCESS_KEY;
           const secretKey = process.env.MOMO_SECRET_KEY;
           const requestId = partnerCode + new Date().getTime();
           const orderId = order._id.toString();
           const orderInfo = `Thanh toán đơn hàng ${order._id}`; 
           const redirectUrl = `${process.env.FRONTEND_URL}/payment/success`;
           const ipnUrl = `${process.env.BACKEND_URL}/api/payment/notify`;
           const amount = order.totalAmount.toString();
           const requestType = "payWithMethod";
           const extraData = "";
           const lang = 'vi';

           // Tạo raw signature
           const rawSignature =
            `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
            `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
            `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}&requestType=${requestType}`;

           // Mã hóa SHA256
           const signature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

           // Body gửi qua MoMo
           const requestBody = {
                partnerCode,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                lang,
                requestType,
                extraData,
                signature,
            };

            // Gọi MoMo API
            const response = await axios.post(
                "https://test-payment.momo.vn/v2/gateway/api/create",
                requestBody,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("MoMo API response:", response.data); // 👈 log nguyên dữ liệu

            return res.status(200).json({
                success: true,
                payUrl: response.data.payUrl,  // lấy đúng payUrl
                data: response.data             // gửi thêm data cho dễ debug
            });
        } catch (error) {
            console.error("MoMo Error:", error.response?.data || error.message);
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Xử lý IPN từ MoMo
    notifyPayment = async(req, res) => {
        try {
            const { orderId, resultCode } = req.body;

            // Tìm order theo _id (orderId chính là _id đã gửi cho MoMo)
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
            }

            // Cập nhật trạng thái theo resultCode
            if (parseInt(resultCode) === 0) {
                order.paymentStatus = "paid";
                order.status = "confirmed";
            } else {
                order.paymentStatus = "failed";
            }
            await order.save();

            return res.status(200).json({ success: true, message: "Cập nhật trạng thái thanh toán thành công" });
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}


module.exports = new PaymentController();