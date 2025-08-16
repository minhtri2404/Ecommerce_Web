const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/create', authMiddleware, orderController.createOrder)

module.exports = router;
