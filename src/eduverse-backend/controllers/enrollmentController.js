const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// Hàm tạo enrollment_id theo cấu trúc E + số thứ tự
const generateEnrollmentId = (enrollmentCount) => {
    const enrollmentIdNumber = enrollmentCount + 1;
    return `E${enrollmentIdNumber.toString().padStart(3, '0')}`;
};

// Tạo ghi danh 
exports.createEnrollment = async (userId, courseId) => {
    const countEnrollmentsSql = 'SELECT COUNT(*) as count FROM enrollments';
    const countData = await query(countEnrollmentsSql);
    const enrollmentId = generateEnrollmentId(countData[0].count);

    const insertSql = 'INSERT INTO enrollments (enrollment_id, student_id, course_id, enrolled_at, status) VALUES (?, ?, ?, DEFAULT, DEFAULT)';
    const values = [enrollmentId, userId, courseId];
    await query(insertSql, values);
    //await notificationController.sendNotification(userId, 'Đăng ký khóa học thành công', 'courseRegistrationTemplate', { COURSE_TITLE: courseTitle });

    return enrollmentId;
};

// Ghi danh vào khóa học (Chỉ 'Học viên' mới có thể ghi danh)
exports.enrollCourse = async (req, res) => {
    try {
        const { course_id } = req.body;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        if (userRole !== 'Học viên') {
            return res.status(403).json({ message: "Chỉ Học viên mới có thể ghi danh" });
        }

        const checkEnrollmentSql = 'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?';
        const enrollmentExists = await query(checkEnrollmentSql, [userId, course_id]);

        if (enrollmentExists.length > 0) {
            return res.status(400).json({ message: "Bạn đã ghi danh vào khóa học này rồi" });
        }

        const enrollmentId = await exports.createEnrollment(userId, course_id);
        return res.status(201).json({ message: "Ghi danh thành công", enrollmentId });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem danh sách khóa học đã ghi danh
exports.getEnrolledCourses = async (req, res) => {
    try {
        const { student_id } = req.params; // Lấy student_id từ params
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        let sql;
        let values;
        if (userRole === 'Quản trị viên' && student_id) {
            sql = 'SELECT * FROM enrollments WHERE student_id = ?';
            values = [student_id];
        } else {
            sql = 'SELECT * FROM enrollments WHERE student_id = ?';
            values = [userId];
        }

        const enrollments = await query(sql, values);
        return res.status(200).json(enrollments);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};