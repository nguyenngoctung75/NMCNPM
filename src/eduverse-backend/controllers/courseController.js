const db = require('../config/db');
//const notificationController = require('./notificationController');

// Hàm tạo course_id theo cấu trúc C + số thứ tự
const generateCourseId = (courseCount) => {
    const courseIdNumber = courseCount + 1;
    return `C${courseIdNumber.toString().padStart(3, '0')}`;
};

// Tạo khóa học mới (Chỉ 'Giáo viên' mới được tạo course)
exports.createCourse = (req, res) => {
    const { title, description, price, duration, category, cover_image, status } = req.body;
    const userRole = req.user.role; // req.user chứa thông tin người dùng đã xác thực
    const teacher_id = req.user.user_id; 
    console.log(teacher_id);

    if (userRole !== 'Giáo viên') {
        return res.status(403).json({ message: "Chỉ Giáo viên mới được tạo khóa học" });
    }

    // Đếm số lượng khóa học hiện có để tạo course_id
    const countCoursesSql = 'SELECT COUNT(*) as count FROM courses';
    db.query(countCoursesSql, (countErr, countData) => {
        if (countErr) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        const courseId = generateCourseId(countData[0].count);
        const insertSql = 'INSERT INTO courses (course_id, title, description, teacher_id, price, duration, category, cover_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [courseId, title, description, teacher_id, price, duration, category, cover_image || 'http://example.com/coverimage.jpg', status || 'Đang hoạt động'];
        //await notificationController.sendNotification(teacher_id, `Khóa học "${title}" đã được tạo thành công.`);
        db.query(insertSql, values, (insertErr, result) => {
            if (insertErr) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            return res.status(201).json({ message: "Khóa học đã được tạo", courseId });
        });
    });
};

//Lay ra danh sach khoa hoc ma nguoi GV da dang tai
exports.listMeCourses = (req, res) => {
    const userId = req.user.user_id;
    const sql = 'SELECT * FROM courses WHERE teacher_id = ?';
    db.query(sql, userId, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        return res.status(200).json(results);
    });
};

// Lấy danh sách khóa học
exports.listCourses = (req, res) => {
    const sql = 'SELECT * FROM courses ORDER BY course_id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        return res.status(200).json(results);
    });
};

// Lấy thông tin khóa học theo ID
exports.getCourseById = (req, res) => {
    const { course_id } = req.params;
    const sql = 'SELECT * FROM courses WHERE course_id = ?';
    db.query(sql, [course_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        return res.status(200).json(result);
    });
};

// Cập nhật khóa học (Chỉ người tạo course mới có thể cập nhật course)
exports.updateCourse = (req, res) => {
    const { course_id } = req.params;
    const { title, description, price, duration, category, cover_image, status } = req.body;
    const userId = req.user.user_id; // req.user chứa thông tin người dùng đã xác thực

    // Kiểm tra quyền cập nhật
    const checkTeacherSql = 'SELECT teacher_id FROM courses WHERE course_id = ?';
    db.query(checkTeacherSql, [course_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }
        if (result[0].teacher_id !== userId) {
            return res.status(403).json({ message: "Chỉ người tạo khóa học mới có thể cập nhật khóa học" });
        }

        const sql = 'UPDATE courses SET title = ?, description = ?, price = ?, duration = ?, category = ?, cover_image = ?, status = ? WHERE course_id = ?';
        db.query(sql, [title, description, price, duration, category, cover_image, status, course_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            return res.status(200).json({ message: "Khóa học đã được cập nhật" });
        });
    });
};

// Xóa khóa học (Chỉ người tạo course mới được xóa course và 'Quản trị viên' có thể xóa mọi course)
exports.deleteCourse = (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
    const userRole = req.user.role;

    // Kiểm tra quyền xóa
    const checkTeacherSql = 'SELECT teacher_id FROM courses WHERE course_id = ?';
    db.query(checkTeacherSql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }
        if (result[0].teacher_id !== userId && userRole !== 'Quản trị viên') {
            return res.status(403).json({ message: "Chỉ người tạo khóa học hoặc Quản trị viên mới có thể xóa khóa học" });
        }

        const sql = 'DELETE FROM courses WHERE course_id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            return res.status(200).json({ message: "Khóa học đã được xóa" });
        });
    });
};