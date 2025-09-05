const Blog = require('../models/blogModel')
const slugify = require('slugify')
const upload = require('../middleware/uploadBlog')
const fs = require('fs')
const path = require('path')

class BlogController{
    // Thêm bài viết
    addBlog = async(req, res) => {
        upload(req, res, async(err) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Tải hình ảnh không thành công', error: err.message})
            }
            try {
                const {title, content} = req.body
                // Kiểm tra 2 trường bắt buộc
                if (!title || !content) {
                    return res.status(400).json({success: false, message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung'})
                }
                
                //Tạo slug từ tiêu đề
                const slug = slugify(title, { lower: true, strict: true })
                // Kiểm tra slug có trùng không
                const existSlug = await Blog.findOne({ slug })
                if (existSlug) {
                    return res.status(400).json({success: false, message: 'Bài viết đã tồn tại'})
                }

                const imagePath = req.file.filename;

                const newBlog = new Blog({ title, slug, content, image: imagePath })
                await newBlog.save()

                return res.status(201).json({success: true, message: 'Thêm bài viết thành công', blog: newBlog})
            } catch (error) {
                return res.status(500).json({success: false, error: 'Server Error'})
            }
        })
    }

    // Hiển thị tất cả bài viết
    getAllBlog = async(req, res) => {
        try {
            const blog = await Blog.find()
            return res.status(200).json({success: true, blog})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }

    // Lấy thông tin bài viết theo id
    getBlogById = async(req, res) => {
        try {
            const { id } = req.params
            const blogById = await Blog.findById(id)
            return res.status(200).json({success: true, blogById})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }

    // Cập nhật bài viết
    updateBlog = async(req, res) => {
        upload(req, res, async(err) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Tải hình ảnh không thành công', error: err.message})
            }
            try {
                const { id } = req.params
                const {title, content} = req.body
                // Kiểm tra 2 trường bắt buộc
                if (!title || !content) {
                    return res.status(400).json({success: false, message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung'})
                }

                // Kiểm tra bài viết cũ trước khi update
                const oldBlog = await Blog.findById(id)
                if (!oldBlog) {
                    return res.status(404).json({success: false, message: 'Không tìm thấy bài viết'})
                }

                //Tạo slug từ tiêu đề
                const slug = slugify(title, { lower: true, strict: true })

                const updateData = {title, content, slug}
                // Nếu có ảnh mới thì update
                if (req.file && req.file.filename) {
                    //Xóa ảnh cũ nếu tồn tại
                    if (oldBlog.image) {
                        const oldPath = path.join(__dirname, '..', '..', 'public', 'uploads/blog', oldBlog.image )
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath)
                        }
                    }
                    updateData.image = req.file.filename
                }

                const updateBlog = await Blog.findByIdAndUpdate(id, updateData, {new: true})
                return res.status(200).json({success: true, message: 'Cập nhật thành công', blog: updateBlog})

            } catch (error) {
                return res.status(500).json({success: false, error: 'Server Error'})
            }
        })
    }

    // Xóa bài viết
    deleteBlog = async(req, res) => {
        try {
            const { id } = req.params

            const deleteBlog = await Blog.findByIdAndDelete(id)
            if (!deleteBlog) {
                return res.status(404).json({success: false, message: 'Không tìm thấy bài viết'})
            }

            //Nếu có hình ảnh thì xóa
            if (deleteBlog.image) {
                const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads/blog', deleteBlog.image )
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }
    
            return res.status(200).json({success: true, message: 'Xóa thành công'})
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server Error'})
        }
    }
}

module.exports = new BlogController();