const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/momo/:id", authMiddleware, paymentController.createMoMo)
router.post("/notify",  paymentController.notifyPayment)
module.exports = router;
