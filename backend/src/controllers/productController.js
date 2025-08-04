const Product = require('../models/productModel')
const upload = require('../middleware/uploadProduct')
const fs = require('fs') 
const path = require('path')

class ProductController {
    // Thêm sản phẩm
    addProduct = async(req, res) => {
        upload(req, res, async(err) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Tải hình ảnh không thành công', error: err.message})
            }
            try {
                const {name, description, price, quantity, category, sizes, colors, isFeatured} = req.body;

                if(!name || !price || !category) {
                    return res.status(400).json({ success: false, error: 'Tên, giá và danh mục là bắt buộc' })
                }

                // Kiểm tra xem sản phẩm đã tồn tại chưa
                const existingProduct = await Product.findOne({name, category})
                if(existingProduct) {
                    return res.status(400).json({ success: false, error: 'Sản phẩm đã tồn tại trong danh mục này' })
                }

                // Lấy danh sách tên file ảnh
                const imagePath = req.files?.map(file => file.filename) || [];
                if (imagePath.length === 0) {
                    return res.status(400).json({ success: false, message: 'Vui lòng tải lên ít nhất một ảnh sản phẩm' });
                }

                // Tạo sản phẩm mới
                const newProduct = new Product({
                    name,
                    description,
                    price,
                    quantity,
                    category,
                    sizes: sizes ? sizes.split(',') : [],
                    colors: colors ? colors.split(',') : [],
                    isFeatured: isFeatured === 'true',
                    images: imagePath
                })
                await newProduct.save();
                return res.status(201).json({ success: true, message: 'Sản phẩm đã được thêm thành công', product: newProduct })
            } catch (error) {
                return res.status(500).json({success: false, error: 'Server error'})
            }
        })
    }

    // Lấy tất cả sản phẩm
    getAllProduct = async(req, res) => {
        try {
            const products = await Product.find()
                .populate('category', 'categoryName')
            return res.status(200).json({success: true, products})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Lấy sản phẩm theo ID
    getProduct = async(req, res) =>{
        try {
            const {id} = req.params
            const product = await Product.findById(id)
            return res.status(200).json({success: true, product})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    // Cập nhật sản phẩm
    updateProduct = async(req, res) => {
        upload(req, res, async(err) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Tải hình ảnh không thành công', error: err.message})
            }
            try {
                const {id} = req.params;
                const {name, description, price, quantity, category, sizes, colors, isFeatured} = req.body;

                if(!name || !price || !category) {
                    return res.status(400).json({ success: false, error: 'Tên, giá và danh mục là bắt buộc' })
                }

                // Cập nhật sản phẩm
                const updateData = {
                    name,
                    description,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    category,
                    sizes: sizes ? sizes.split(',') : [],
                    colors: colors ? colors.split(',') : [],
                    isFeatured: isFeatured === 'true'
                };

                // Cập nhật ảnh sản phẩm nếu có
                if (req.files && req.files.length > 0) {
                    const imagePath = req.files.map(file => file.filename);
                    updateData.images = imagePath;
                }

                const updateProduct = await Product.findByIdAndUpdate(id, updateData, {new: true})
                if (!updateProduct) {
                    return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
                }

                return res.status(200).json({ success: true, message: 'Sản phẩm đã được cập nhật thành công', product: updateProduct });
            } catch (error) {
                return res.status(500).json({success: false, error: 'Server error'})
            }
        })
    }

    //Xóa sản phẩm
    deleteProduct = async(req, res) => {
        try {
            const { id } = req.params;

            const productDelete = await Product.findByIdAndDelete(id);
            if (!productDelete) {
                return res.status(400).json({ success: false, error: 'Sản phẩm không tồn tại' });
            }

            // Xóa hình ảnh
            if (productDelete.images && Array.isArray(productDelete.images)) {
                productDelete.images.forEach((filename) => {
                    const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'product', filename);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("Ảnh đã được xóa: ", filename);
                    } else {
                        console.log("Ảnh không tồn tại: ", imagePath);
                    }
                });
            }

            return res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công' });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }
}
module.exports = new ProductController();