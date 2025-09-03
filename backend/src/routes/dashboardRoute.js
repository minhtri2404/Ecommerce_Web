const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController")
const authMiddleware = require("../middleware/authMiddleware")

router.get('/dashboard', authMiddleware, dashboardController.getAllDashboard)
router.get('/revenue-by-month', authMiddleware, dashboardController.getRevenue)
router.get('/payment-stats', authMiddleware, dashboardController.getPaymentStart)
module.exports = router;
