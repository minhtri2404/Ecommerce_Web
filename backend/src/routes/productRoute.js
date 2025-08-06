const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, productController.addProduct)
router.get("/", productController.getAllProduct)
router.get('/featured', productController.getFeaturedProduct)
router.get('/:id', productController.getProduct)
router.put('/:id', authMiddleware, productController.updateProduct)
router.delete('/:id', authMiddleware, productController.deleteProduct)
router.put('/:id/featured', authMiddleware, productController.toggleFeatured)

module.exports = router;
