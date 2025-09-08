const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, couponController.addCoupon)
router.get("/", couponController.getAllCoupon)
router.get("/:id", couponController.getCoupon)
router.put("/:id", authMiddleware, couponController.updateCoupon)
module.exports = router;
