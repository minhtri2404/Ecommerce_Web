const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, blogController.addBlog)
router.get('/', blogController.getAllBlog)
router.get('/:id', blogController.getBlogById)
router.put('/:id', authMiddleware, blogController.updateBlog)
module.exports = router;
