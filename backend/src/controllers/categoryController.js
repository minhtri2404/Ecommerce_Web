const Category = require("../models/categoryModel")
const upload = require('../middleware/uploadMiddleware')

class CategoryController {
    // Thêm danh mục
    addCategory = async(req, res) =>{
        upload(req, res, async(err) =>{
            if (err) {
                return res.status(500).json({success: false, message: 'Tải hình ảnh không thành công', error: err.message})
            }
            try {
                const {categoryName, categoryDescription} = req.body;
                if (!categoryName || !categoryDescription || !req.file) {
                    return res.status(400).json({ success: false, error: 'Tất cả trường không được bỏ trống' })
                }

                // Kiểm tra xem danh mục đã tồn tại chưa
                const existingCategory = await Category.findOne({categoryName})
                if(existingCategory){
                    return res.status(400).json({ success: false, error: 'Danh mục đã tồn tại' })
                }

                const imagePath = req.file.filename;

                const newCategory = new Category({categoryName, categoryDescription, categoryImage: imagePath})
                await newCategory.save()

                return res.status(201).json({success: true, message: 'Thêm danh mục thành công', category: newCategory})
            } catch (error) {
                return res.status(500).json({success: false, error: 'Server error'})
            }
        })
    }

    // Lấy tất cả danh mục
    getAllCategories = async(req, res) =>{
        try {
            const categories = await Category.find()
            return res.status(200).json({success: true, categories})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}

module.exports = new CategoryController();