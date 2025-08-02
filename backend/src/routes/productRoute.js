const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, productController.addProduct)
router.get("/", authMiddleware, productController.getAllProduct)
router.get('/:id', authMiddleware, productController.getProduct)
router.put('/:id', authMiddleware, productController.updateProduct)

module.exports = router;
