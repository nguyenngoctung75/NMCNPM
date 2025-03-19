const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// Hàm tạo notification_id theo cấu trúc N + số thứ tự
const generateNotificationId = (notificationCount) => {
    const notificationIdNumber = notificationCount + 1;
    return `N${notificationIdNumber.toString().padStart(3, '0')}`;
};

// Gửi thông báo (Có thể gọi từ các controller khác)
exports.sendNotification = async (userId, message) => {
    try {
        // Đếm số lượng thông báo hiện có để tạo notification_id
        const countNotificationsSql = 'SELECT COUNT(*) as count FROM notifications';
        const countData = await query(countNotificationsSql);
        const notificationId = generateNotificationId(countData[0].count);

        const insertSql = 'INSERT INTO notifications (notification_id, user_id, message, is_read, sent_at) VALUES (?, ?, ?, DEFAULT, DEFAULT)';
        const values = [notificationId, userId, message];
        await query(insertSql, values);

        return notificationId;
    } catch (error) {
        throw new Error('Lỗi khi gửi thông báo: ' + error.message);
    }
};

// Đánh dấu thông báo là đã đọc
exports.markAsRead = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực

        const updateSql = 'UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?';
        const values = [notification_id, userId];
        await query(updateSql, values);

        return res.status(200).json({ message: "Thông báo đã được đánh dấu là đã đọc" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem tất cả thông báo của người dùng hiện tại
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực

        const sql = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC';
        const notifications = await query(sql, [userId]);

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Đếm số thông báo chưa đọc
exports.countUnreadNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực

        const querySql = 'SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = 0';
        const values = [userId];
        const result = await query(querySql, values);

        return res.status(200).json({ unreadCount: result[0].unreadCount });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực

        const updateSql = 'UPDATE notifications SET is_read = TRUE WHERE user_id = ?';
        const values = [userId];
        await query(updateSql, values);

        return res.status(200).json({ message: "Tất cả thông báo đã được đánh dấu là đã đọc" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};