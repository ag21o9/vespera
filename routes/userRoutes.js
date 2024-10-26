const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User signup and login
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Auth middleware
const auth = require("../middleware/auth");

// Stock routes (buy, sell, marketplace)
router.post("/buy", auth, userController.buyStock);
router.post("/sell", auth, userController.sellStock);
router.get("/marketplace", userController.marketplace);

module.exports = router;
