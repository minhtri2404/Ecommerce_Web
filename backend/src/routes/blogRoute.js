const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, blogController.addBlog)


module.exports = router;
