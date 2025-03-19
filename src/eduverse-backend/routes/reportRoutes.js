// Định tuyến cho các API liên quan đến báo cáo.

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/activity', reportController.getActivityReport);
router.get('/progress', reportController.getProgressReport);
router.get('/activity/:user_id', reportController.getActivityReport);
router.get('/progress/:user_id', reportController.getProgressReport);

module.exports = router;