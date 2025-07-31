const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, productController.addProduct)
router.get("/", authMiddleware, productController.getAllProduct)


module.exports = router;
