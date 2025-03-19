const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware'); 

// Gửi thông báo (Gọi từ các controller khác)
// router.post('/send-notification', authenticate, notificationController.sendNotification); // Nếu cần endpoint riêng

router.put('/notifications/:notification_id/read', authenticate, notificationController.markAsRead);
router.get('/notifications', authenticate, notificationController.getUserNotifications);
router.get('/notifications/unread-count', authenticate, notificationController.countUnreadNotifications); 
router.put('/notifications/mark-all-read', authenticate, notificationController.markAllAsRead); 

module.exports = router;