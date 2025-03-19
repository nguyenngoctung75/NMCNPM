const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const enrollmentController = require('./enrollmentController'); // Import EnrollmentController

const generatePaymentId = (paymentCount) => {
    const paymentIdNumber = paymentCount + 1;
    return `P${paymentIdNumber.toString().padStart(3, '0')}`;
};

// Tạo hóa đơn (Nếu 'Học viên' chưa ghi danh khóa học này)
exports.createInvoice = async (req, res) => {
    try {
        const { course_id, amount } = req.body;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        if (userRole !== 'Học viên') {
            return res.status(403).json({ message: "Chỉ học viên mới có thể tạo hóa đơn" });
        }

        // Kiểm tra xem học viên đã ghi danh khóa học này chưa
        const checkEnrollmentSql = 'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?';
        const enrollmentExists = await query(checkEnrollmentSql, [userId, course_id]);

        if (enrollmentExists.length > 0) {
            return res.status(400).json({ message: "Bạn đã ghi danh khóa học này rồi" });
        }

        // Đếm số lượng thanh toán hiện có để tạo payment_id
        const countPaymentsSql = 'SELECT COUNT(*) as count FROM payments';
        const countData = await query(countPaymentsSql);
        const paymentId = generatePaymentId(countData[0].count);

        const insertSql = 'INSERT INTO payments (payment_id, student_id, course_id, amount, payment_date) VALUES (?, ?, ?, ?, DEFAULT)';
        const values = [paymentId, userId, course_id, amount];
        await query(insertSql, values);

        return res.status(201).json({ message: "Hóa đơn đã được tạo", paymentId });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Thực hiện thanh toán
exports.processPayment = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        if (userRole !== 'Học viên') {
            return res.status(403).json({ message: "Chỉ học viên mới có thể thực hiện thanh toán" });
        }

        // Kiểm tra xem hóa đơn có tồn tại và thuộc về học viên không
        const checkPaymentSql = 'SELECT * FROM payments WHERE payment_id = ? AND student_id = ?';
        const paymentData = await query(checkPaymentSql, [payment_id, userId]);

        if (paymentData.length === 0) {
            return res.status(404).json({ message: "Hóa đơn không tồn tại hoặc không thuộc về bạn" });
        }

        const { course_id } = paymentData[0];

        // Kiểm tra xem học viên đã ghi danh khóa học này chưa
        const checkEnrollmentSql = 'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?';
        const enrollmentExists = await query(checkEnrollmentSql, [userId, course_id]);

        if (enrollmentExists.length > 0) {
            return res.status(400).json({ message: "Bạn đã ghi danh khóa học này rồi" });
        }

        const enrollmentId = await enrollmentController.createEnrollment(userId, course_id);
        return res.status(201).json({ message: "Thanh toán thành công, bạn đã được ghi danh", enrollmentId });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem lại tất cả hóa đơn của bản thân (hoặc tất cả giao dịch cho Quản trị viên)
exports.listPayments = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const userRole = req.user.role;

        let sql;
        let values;
        if (userRole === 'Quản trị viên') {
            sql = 'SELECT * FROM payments';
            values = [];
        } else {
            sql = 'SELECT * FROM payments WHERE student_id = ?';
            values = [userId];
        }

        const payments = await query(sql, values);
        return res.status(200).json(payments);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};