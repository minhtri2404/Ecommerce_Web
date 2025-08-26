const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController")
const authMiddleware = require("../middleware/authMiddleware")

router.get('/', authMiddleware, customerController.getAllCustomer)

module.exports = router;
