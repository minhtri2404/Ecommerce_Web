const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController")
const authMiddleware = require("../middleware/authMiddleware")

router.get('/', authMiddleware, customerController.getAllCustomer)
router.get('/:id', authMiddleware, customerController.getCustomer)

module.exports = router;
