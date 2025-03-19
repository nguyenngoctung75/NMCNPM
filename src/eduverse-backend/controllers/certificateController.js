const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// Hàm tạo certificate_id theo cấu trúc CT + số thứ tự
const generateCertificateId = (certificateCount) => {
    const certificateIdNumber = certificateCount + 1;
    return `CT${certificateIdNumber.toString().padStart(3, '0')}`;
};

// Phát hành chứng chỉ (Chỉ 'Giáo viên' chủ khóa học mới có thể cấp chứng chỉ)
exports.issueCertificate = async (req, res) => {
    try {
        const { enrollment_id } = req.body;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        // Kiểm tra xem enrollment có tồn tại không và lấy thông tin teacher_id
        const checkEnrollmentSql = `
            SELECT e.course_id, c.teacher_id
            FROM enrollments e
            JOIN courses c ON e.course_id = c.course_id
            WHERE e.enrollment_id = ?`;
        const enrollmentData = await query(checkEnrollmentSql, [enrollment_id]);

        if (enrollmentData.length === 0) {
            return res.status(404).json({ message: "Ghi danh không tồn tại" });
        }

        if (enrollmentData[0].teacher_id !== userId || userRole !== 'Giáo viên') {
            return res.status(403).json({ message: "Chỉ giáo viên chủ khóa học mới có thể cấp chứng chỉ" });
        }

        // Đếm số lượng chứng chỉ hiện có để tạo certificate_id
        const countCertificatesSql = 'SELECT COUNT(*) as count FROM certificates';
        const countData = await query(countCertificatesSql);
        const certificateId = generateCertificateId(countData[0].count);

        const insertSql = 'INSERT INTO certificates (certificate_id, enrollment_id, issued_at) VALUES (?, ?, DEFAULT)';
        await query(insertSql, [certificateId, enrollment_id]);

        return res.status(201).json({ message: "Chứng chỉ đã được cấp", certificateId });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem danh sách chứng chỉ
exports.listCertificates = async (req, res) => {
    try {
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;
        const { user_id } = req.params; // lấy user_id từ params (nếu có)

        let sql;
        let values;
        if (userRole === 'Quản trị viên' && user_id) {
            sql = 'SELECT * FROM certificates WHERE enrollment_id IN (SELECT enrollment_id FROM enrollments WHERE student_id = ?)';
            values = [user_id];
        } else if (userRole === 'Quản trị viên') {
            sql = 'SELECT * FROM certificates';
            values = [];
        } else if (userRole === 'Giáo viên') {
            sql = 'SELECT * FROM certificates WHERE enrollment_id IN (SELECT enrollment_id FROM enrollments WHERE course_id IN (SELECT course_id FROM courses WHERE teacher_id = ?))';
            values = [userId];
        } else {
            sql = 'SELECT * FROM certificates WHERE enrollment_id IN (SELECT enrollment_id FROM enrollments WHERE student_id = ?)';
            values = [userId];
        }

        const certificates = await query(sql, values);
        return res.status(200).json(certificates);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa chứng chỉ (Chỉ 'Giáo viên' chủ khóa học hoặc 'Quản trị viên' mới có thể xóa chứng chỉ)
exports.deleteCertificate = async (req, res) => {
    try {
        const { certificate_id } = req.params;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        // Kiểm tra quyền xóa
        const checkCertificateSql = `
            SELECT c.enrollment_id, e.course_id, co.teacher_id
            FROM certificates c
            JOIN enrollments e ON c.enrollment_id = e.enrollment_id
            JOIN courses co ON e.course_id = co.course_id
            WHERE c.certificate_id = ?`;
        const certificateData = await query(checkCertificateSql, [certificate_id]);

        if (certificateData.length === 0) {
            return res.status(404).json({ message: "Chứng chỉ không tồn tại" });
        }

        if (certificateData[0].teacher_id !== userId && userRole !== 'Quản trị viên') {
            return res.status(403).json({ message: "Chỉ giáo viên chủ khóa học hoặc quản trị viên mới có thể xóa chứng chỉ" });
        }

        const deleteSql = 'DELETE FROM certificates WHERE certificate_id = ?';
        await query(deleteSql, [certificate_id]);

        return res.status(200).json({ message: "Chứng chỉ đã được xóa" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};