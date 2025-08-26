const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/create', authMiddleware, orderController.createOrder)
router.get('/', authMiddleware, orderController.getAllOrders)
router.get('/my-order', authMiddleware, orderController.getMyOrder)
router.get('/:id', authMiddleware, orderController.getOrderById)
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus)
module.exports = router;
