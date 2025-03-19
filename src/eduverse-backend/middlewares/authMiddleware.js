// Middleware xử lý xác thực người dùng.

const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: "Không có token" });
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        db.query(sql, [decoded.id], (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            if (data.length === 0) {
                return res.status(401).json({ message: "Người dùng không tồn tại" });
            }
            req.user = data[0];
            next();
        });
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};