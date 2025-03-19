// Định tuyến cho các API xác thực.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
//router.post('/verify-otp', authController.verifyOTP); // Nếu cần thì bổ sung sau

module.exports = router;