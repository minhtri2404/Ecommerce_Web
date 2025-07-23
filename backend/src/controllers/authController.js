const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    // Chức năng đăng ký
    register = async(req, res) => {
        try {
            const {name, email, password, role} = req.body;

            //Kiểm tra xem người dùng đã tồn tại hay chưa
            const existingUser = await User.findOne({email})
            if (existingUser) {
                return res.status(400).json({success: false, error: "Email đã được đăng ký"});  
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = new User({name, email, password:hashedPassword, role})
            await newUser.save();

            // Tạo Token
            const token =  jwt.sign({id: newUser._id, role: newUser.role},
                process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}
            )

            return res.status(201).json({success: true, token, user: {id: newUser._id, name: newUser.name, role: newUser.role}});

        } catch (error) {
            return res.status(500).json({success: false, error: error.message});

        }
    }


    // Chức năng đăng nhập
    login = async (req, res) => {
       try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(404).json({success: false, error: "Người dùng không tồn tại"});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(404).json({success: false, error: "Sai mật khẩu"});
            }

            const token = jwt.sign({id: user.id, role:user.role},
                process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}
            );
            return res.status(200).json({success: true, token, user: {id: user.id, name: user.name, role: user.role}});
        } catch (error) {
            return res.status(500).json({success: false, error: error.message});
        }
    }

    // chức năng xác thực người dùng
    verify = async(req, res) => {
        return res.status(200).json({ success: true, user: req.user}) 
    }
}

module.exports = new AuthController()
