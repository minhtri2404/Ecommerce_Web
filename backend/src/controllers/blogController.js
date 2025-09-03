const Blog = require('../models/blogModel')
const slugify = require('slugify')
const upload = require('../middleware/uploadBlog')

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
}

module.exports = new BlogController();