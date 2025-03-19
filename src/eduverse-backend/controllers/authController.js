// Xử lý logic cho các yêu cầu xác thực.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const sendEmail = require('../utils/emailService');
const {getUserByEmail} = require('../models/UserModel')

// Hàm tạo user_id theo cấu trúc U + số thứ tự
const generateUserId = (userCount) => {
    const userIdNumber = userCount + 1;
    return `U${userIdNumber.toString().padStart(3, '0')}`;
};

// Đăng ký người dùng mới
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(req.body)
    try {
        // Kiểm tra xem email đã tồn tại chưa
        const checkEmailSql = 'SELECT * FROM users WHERE `email` = ?';
        db.query(checkEmailSql, [email], async (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            if (data.length > 0) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }
       
            // Đếm số lượng người dùng hiện có để tạo user_id
            const countUsersSql = 'SELECT COUNT(*) as count FROM users';
            db.query(countUsersSql, async (countErr, countData) => {
                if (countErr) {
                    return res.status(500).json({ message: "Lỗi server" });
                }
                const userId = generateUserId(countData[0].count);
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertSql = 'INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`) VALUES (?)';
                const values = [userId, name, email, hashedPassword, role || 'Học viên'];
                db.query(insertSql, [values], (insertErr, insertData) => {
                    if (insertErr) {
                        return res.status(500).json({ message: "Lỗi server" });
                    }
                    return res.status(201).json({ message: "Đăng ký thành công" });
                });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT * FROM users WHERE `email` = ?';
        db.query(sql, [email], async (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            if (data.length === 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const user = data[0];
            console.log(user);
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Mật khẩu không đúng" });
            }
            const token = jwt.sign({ id: user.user_id }, 'secret', { expiresIn: '1h' });
            // Lấy tất cả thông tin của user để lưu trữ vào LocalStorage
            userId = user.user_id;
            // Lấy các coursese đã đăng ký
            const getCoursesEnrolled = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM enrollments WHERE `student_id` = ?';
                db.query(query, [userId], (err, data) => {
                    if (err) {
                        reject("undefined error while getting courses enrolled");
                    } else {
                        resolve(data);
                    }
                });
            });

            const getNotifications = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM notifications WHERE `user_id` = ? LIMIT 20';
                db.query(query, [userId], (err, data) => {
                    if (err) {
                        reject("undefined error while getting notifications");
                    } else {
                        resolve(data);
                    }
                });
            });

            const getPayments = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM payments WHERE `student_id` = ?';
                db.query(query, [userId], (err, data) => {
                    if (err) {
                        reject("undefined error while getting payment infos");
                    } else {
                        resolve(data);
                    }
                });
            });

            const getPersonalInfo = new Promise((resolve, reject) => {
                const query = 'SELECT * FROM personal WHERE `user_id` = ?';
                db.query(query, [userId], (err, data) => {
                    if (err) {
                        reject("undefined error while getting personal info");
                    } else {
                        resolve(data);
                    }
                });
            });

            try {
                const [coursesEnrolled, notifications, payments, personalInfo] = await Promise.all([
                    getCoursesEnrolled,
                    getNotifications,
                    getPayments,
                    getPersonalInfo
                ]);

                const userData = {
                    coursesEnrolled,
                    notifications,
                    payments,
                    personalInfo
                };
                console.log(userData);
                // Cập nhật last_login
                const updateLastLoginSql = 'UPDATE users SET last_login = ? WHERE user_id = ?';
                db.query(updateLastLoginSql, [new Date(), user.user_id], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ message: "Lỗi server khi cập nhật thông tin đăng nhập" });
                    }
                    // Trả về dữ liệu người dùng và token sau khi đăng nhập thành công
                    return res.status(200).json({ message: "Đăng nhập thành công", token, user, userData });
                });

            } catch (error) {
                return res.status(500).json({ message: error });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// Xác minh OTP
exports.verifyOTP = async (req, res) => {
    // Logic xác minh OTP
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], async (err, data) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).json({ message: "Lỗi server" });
            }
            if (data.length === 0) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
                //return res.status(200).json({ message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.' });
            }
            const user = data[0];
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
            
            // Lưu token vào cơ sở dữ liệu
            const updateTokenSql = 'UPDATE users SET token_reset = ? WHERE user_id = ?';
            db.query(updateTokenSql, [token, user.user_id], async (updateErr) => {
                if (updateErr) {
                    console.error('Error updating the database:', updateErr);
                    return res.status(500).json({ message: "Lỗi server" });
                }
                await sendEmail(user.email, 'Đặt lại mật khẩu', 'forgotPasswordTemplate', { RESET_LINK: resetLink });
                return res.json({ message: 'Đã gửi liên kết đặt lại mật khẩu đến email của bạn' });
                //return res.json({ message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.' });
            });
        });
    } catch (error) {
        console.error('Lỗi khi quên mật khẩu:', error.message);
        return res.status(500).json({ message: "Lỗi server" });
    }
};


// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Yêu cầu không hợp lệ." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        db.query(sql, [decoded.id], async (err, data) => {
            if (err) {
                console.error('Error querying the database:', err);
                //return res.status(500).json({ message: "Lỗi server" });
                return res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
            }
            if (data.length === 0 || data[0].token_reset !== token) {
                //return res.status(404).json({ message: "Người dùng không tồn tại" });
                return res.status(400).json({ message: 'Yêu cầu không hợp lệ.' });
            }
            const user = data[0];
            const hashedPassword = await bcrypt.hash(password, 10);
            const updateSql = 'UPDATE users SET password = ?, token_reset = NULL WHERE user_id = ?';
            db.query(updateSql, [hashedPassword, user.user_id], async (updateErr) => {
                if (updateErr) {
                    console.error('Error updating the database:', updateErr);
                    //return res.status(500).json({ message: "Lỗi server" });
                    return res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
                }
                // Tạo token mới sau khi đặt lại mật khẩu thành công
                const newToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                await sendEmail(user.email, 'Thành công đặt lại mật khẩu', 'resetPasswordTemplate', {});
                return res.json({ message: 'Đặt lại mật khẩu thành công', token: newToken });
            });
        });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error.message);
        //return res.status(500).json({ message: "Lỗi server" });
        return res.status(400).json({ message: "Yêu cầu không hợp lệ." });
    }
};