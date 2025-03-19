const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '07052004',
    database: 'eduverse_db',
});


// API để lấy tổng số lượng user và khóa học
router.get('/summary', async (req, res) => {
    try {
        const [teacherCount] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'Giáo viên'");
        const [studentCount] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'Học viên'");
        const [courseCount] = await db.query("SELECT COUNT(*) AS count FROM courses");

        res.status(200).json({
            teacherCount: teacherCount[0].count,
            studentCount: studentCount[0].count,
            courseCount: courseCount[0].count,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

const generateUserId = (userCount) => {
    const userIdNumber = userCount + 1;
    return `U${userIdNumber.toString().padStart(3, '0')}`;
};
router.post('/create-teacher', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra xem email đã tồn tại hay chưa
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Lấy tổng số lượng người dùng hiện tại
        const [userCountResult] = await db.query("SELECT COUNT(*) AS count FROM users");
        const userCount = userCountResult[0].count;

        // Tạo user ID dựa trên số lượng người dùng
        const userId = generateUserId(userCount);
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm giáo viên mới vào cơ sở dữ liệu
        await db.query(
            "INSERT INTO users (user_id, name, email, password, role, is_verified, created_at) VALUES (?, ?, ?, ?, 'Giáo viên', 1, NOW())",
            [userId, name, email, hashedPassword]
        );


        res.status(201).json({ message: "Tạo giáo viên thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


module.exports = router;
