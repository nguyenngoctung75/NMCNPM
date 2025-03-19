// Định tuyến cho các API liên quan đến người dùng.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile', userController.getUserProfile);
router.put('/update-profile', userController.updateUserProfile);
router.get('/profile/:user_id', userController.getUserProfile);
router.put('/update-profile/:user_id', userController.updateUserProfile);

module.exports = router;