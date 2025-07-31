const multer = require('multer')
const path = require('path')

// Cấu hình lưu ảnh ở product
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/product")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage }).array('images', 5);
module.exports = upload