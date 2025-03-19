const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// Hàm tạo lesson_id theo cấu trúc L + số thứ tự
const generateLessonId = (lessonCount) => {
    const lessonIdNumber = lessonCount + 1;
    return `L${lessonIdNumber.toString().padStart(3, '0')}`;
};

// Thêm bài học mới vào khóa học (Chỉ có chủ khóa học mới có thể tạo bài học)
exports.createLesson = async (req, res) => {
    try {
        const { course_id, title, content, lesson_order } = req.body;
        const userId = req.user.user_id; // req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        // Kiểm tra xem người dùng có phải là chủ khóa học không
        const checkCourseSql = 'SELECT * FROM courses WHERE course_id = ? AND teacher_id = ?';
        const courseData = await query(checkCourseSql, [course_id, userId]);

        if (courseData.length === 0) {
            return res.status(403).json({ message: "Chỉ chủ khóa học mới có thể tạo bài học" });
        }

        // Đếm số lượng bài học hiện có để tạo lesson_id
        const countLessonsSql = 'SELECT COUNT(*) as count FROM lessons';
        const countData = await query(countLessonsSql);
        const lessonId = generateLessonId(countData[0].count);

        const insertSql = 'INSERT INTO lessons (lesson_id, course_id, title, content, lesson_order) VALUES (?, ?, ?, ?, ?)';
        const values = [lessonId, course_id, title, content, lesson_order];
        await query(insertSql, values);

        return res.status(201).json({ message: "Bài học đã được tạo", lessonId });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

//Dem tong so luong lessons cua 1 course
exports.getTotalLesson = async (req, res) => {
    try {
        const courseId = req.query.course_id; // Lấy course_id từ query string

        if (!courseId) {
            return res.status(400).json({ message: 'course_id không được để trống' });
        }

        const sql = `SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?`;

        // Truy vấn cơ sở dữ liệu
        db.query(sql, [courseId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi server', error: err.message });
            }

            const totalLessons = results[0]?.total || 0; // Lấy số lượng bài học
            res.status(200).json({ totalLessons });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xem danh sách bài học của một khóa học
exports.getLessonsByCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const sql = 'SELECT * FROM lessons WHERE course_id = ? AND lesson_order > 0 ORDER BY lesson_order ASC';
        const lessons = await query(sql, [course_id]);

        return res.status(200).json(lessons);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật bài học (Chỉ chủ khóa học mới có thể cập nhật bài học)
exports.updateLesson = async (req, res) => {
    try {
        const { lesson_id } = req.params;
        const { title, content, lesson_order } = req.body;
        const userId = req.user.user_id;

        // Kiểm tra xem người dùng có phải là chủ khóa học không
        const checkLessonSql = `
            SELECT l.course_id, c.teacher_id
            FROM lessons l
            JOIN courses c ON l.course_id = c.course_id
            WHERE l.lesson_id = ? AND c.teacher_id = ?`;
        const lessonData = await query(checkLessonSql, [lesson_id, userId]);

        if (lessonData.length === 0) {
            return res.status(403).json({ message: "Chỉ chủ khóa học mới có thể cập nhật bài học" });
        }

        const updateSql = 'UPDATE lessons SET title = ?, content = ?, lesson_order = ? WHERE lesson_id = ?';
        const values = [title, content, lesson_order, lesson_id];
        await query(updateSql, values);

        return res.status(200).json({ message: "Bài học đã được cập nhật" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa bài học (Chỉ chủ khóa học hoặc 'Quản trị viên' mới có thể xóa bài học)
exports.deleteLesson = async (req, res) => {
    try {
        const { lesson_id } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        // Kiểm tra quyền xóa bài học
        const checkLessonSql = `
            SELECT l.course_id, c.teacher_id
            FROM lessons l
            JOIN courses c ON l.course_id = c.course_id
            WHERE l.lesson_id = ?`;
        const lessonData = await query(checkLessonSql, [lesson_id]);

        if (lessonData.length === 0) {
            return res.status(404).json({ message: "Bài học không tồn tại" });
        }

        if (lessonData[0].teacher_id !== userId && userRole !== 'Quản trị viên') {
            return res.status(403).json({ message: "Chỉ chủ khóa học hoặc Quản trị viên mới có thể xóa bài học" });
        }

        const updateSql = 'UPDATE lessons SET lesson_order = 0 WHERE lesson_id = ?';
        await query(updateSql, [lesson_id]);

        return res.status(200).json({ message: "Bài học đã được xóa (ẩn)" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};