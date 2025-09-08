const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, couponController.addCoupon)


module.exports = router;
