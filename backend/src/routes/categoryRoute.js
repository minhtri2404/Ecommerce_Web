const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, categoryController.addCategory)
router.get("/", authMiddleware, categoryController.getAllCategories)

module.exports = router;
