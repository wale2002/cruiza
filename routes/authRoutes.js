// routes/authRoutes.js
// ONLY the routes you are currently using (signup + login + Google)

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ====================== ACTIVE ROUTES ======================
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth);

// Phone OTP routes are commented out because the functions are not active in controller
// router.post("/send-otp", authController.sendOtp);
// router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
