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

    // lấy ra danh sách khách hàng trước khi cập nhật
    getCustomer = async(req, res) => {
        try {
            const { id } = req.params
            const customer = await User.findById(id)
            return res.status(200).json({success: true, customer})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Cập nhật thông tin khách hàng
    updateCustomer = async(req, res) => {
        try {
            const { id } = req.params
            const {name, role} = req.body
            if (!name || !role ) {
                return res.status(400).json({success: false, error: 'Tất cả không được bỏ trống'})
            }

            const updateCustomer = await User.findByIdAndUpdate(id, {name, role}, {new: true})
            return res.status(200).json({success: true, message: 'Cập nhật thành công', customer: updateCustomer})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Xóa khách hàng
    deleteCustomer = async(req, res) => {
        try {
            const { id } = req.params
            const deleteCustomer = await User.findByIdAndDelete(id)
            return res.status(200).json({success: true, message: 'Xóa thành công', deleteCustomer})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}

module.exports = new CustomerController()
