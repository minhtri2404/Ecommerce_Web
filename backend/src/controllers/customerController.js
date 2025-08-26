const User = require('../models/userModel');

class CustomerController{
    // Lấy tất cả danh sách của khách hàng
    getAllCustomer = async(req, res) => {
        try {
            const customer = await User.find()
            return res.status(200).json({success: true, customer})
        } catch (error) {
           return res.status(500).json({success: false, error: 'Server error'}) 
        }
    }
}

module.exports = new CustomerController()
