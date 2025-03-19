const db = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const fs = require('fs');

// Hàm tạo assignment_id theo cấu trúc A + số thứ tự
const generateAssignmentId = (assignmentCount) => {
    const assignmentIdNumber = assignmentCount + 1;
    return `A${assignmentIdNumber.toString().padStart(3, '0')}`;
};

// Thêm bài tập mới (Chỉ 'Giáo viên' làm chủ khóa học có chứa bài học này mới được thêm bài tập)
exports.createAssignment = async (req, res) => {
    try {
        const { lesson_id, title, description, due_date, points, max_attemps } = req.body;
        const userId = req.user.user_id;
        const userRole = req.user.role;
        const files = req.files;

        // Kiểm tra xem người dùng có phải là chủ khóa học không
        const checkLessonSql = `
            SELECT l.course_id, c.teacher_id
            FROM lessons l
            JOIN courses c ON l.course_id = c.course_id
            WHERE l.lesson_id = ? AND c.teacher_id = ?`;
        const lessonData = await query(checkLessonSql, [lesson_id, userId]);

        if (lessonData.length === 0) {
            if (files) files.forEach(file => fs.unlinkSync(file.path)); // Xóa file đã upload tạm thời nếu có
            return res.status(403).json({ message: "Chỉ chủ khóa học mới có thể thêm bài tập" });
        }

        // Tải lên file lên Cloudinary nếu có
        const attachments = await Promise.all(files.map(async file => {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto',
                folder: 'eduverse/assignments'
            });
            fs.unlinkSync(file.path); // Xóa file sau khi upload
            return result.secure_url;
        }));

        // Đếm số lượng bài tập hiện có để tạo assignment_id
        const countAssignmentsSql = 'SELECT COUNT(*) as count FROM assignments';
        const countData = await query(countAssignmentsSql);
        const assignmentId = generateAssignmentId(countData[0].count);

        const insertSql = `
            INSERT INTO assignments (assignment_id, lesson_id, title, description, attachment1, attachment2, due_date, points, max_attemps)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            assignmentId, lesson_id, title, description,
            attachments[0] || null, attachments[1] || null,
            due_date || '9999-12-31', points, max_attemps || 9999
        ];
        await query(insertSql, values);

        return res.status(201).json({ message: "Bài tập đã được tạo", assignmentId });
    } catch (error) {
        if (req.files) req.files.forEach(file => fs.unlinkSync(file.path)); // Xóa file nếu có lỗi
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem bài tập (Giáo viên chỉ xem bài tập trong khóa học của bản thân, Quản trị viên xem tất cả bài tập, học viên đã đăng ký mới được xem bài tập)
exports.getAssignmentsByLesson = async (req, res) => {
    try {
        const { lesson_id } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        let sql;
        let values;
        if (userRole === 'Quản trị viên') {
            sql = 'SELECT * FROM assignments WHERE lesson_id = ?';
            values = [lesson_id];
        } else if (userRole === 'Giáo viên') {
            sql = `
                SELECT a.*
                FROM assignments a
                JOIN lessons l ON a.lesson_id = l.lesson_id
                JOIN courses c ON l.course_id = c.course_id
                WHERE a.lesson_id = ? AND c.teacher_id = ?`;
            values = [lesson_id, userId];
        } else {
            // sql = `
            //     SELECT a.*
            //     FROM assignments a
            //     JOIN lessons l ON a.lesson_id = l.lesson_id
            //     JOIN enrollments e ON l.course_id = e.course_id
            //     WHERE a.lesson_id = ? AND e.student_id = ?`;
            // values = [lesson_id, userId];
            sql = `
                SELECT * FROM assignments WHERE lesson_id = ?`;
            values = [lesson_id, userId];
        }

        const assignments = await query(sql, values);
        return res.status(200).json(assignments);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

//Lay ra Assignment khi da biet lesson_id
exports.getAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const sql = 'SELECT * FROM assignments WHERE assignment_id = ?';
        db.query(sql, [assignment_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// Cập nhật bài tập (Chỉ 'Giáo viên' làm chủ khóa học có chứa bài học này mới được cập nhật bài tập)
exports.updateAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const { title, description, due_date, point, max_attemps } = req.body;
        const userId = req.user.user_id;
        const userRole = req.user.role;
        const files = req.files;

        // Kiểm tra xem người dùng có phải là chủ khóa học không
        const checkAssignmentSql = `
            SELECT l.course_id, c.teacher_id
            FROM assignments a
            JOIN lessons l ON a.lesson_id = l.lesson_id
            JOIN courses c ON l.course_id = c.course_id
            WHERE a.assignment_id = ? AND c.teacher_id = ?`;
        const assignmentData = await query(checkAssignmentSql, [assignment_id, userId]);

        if (assignmentData.length === 0) {
            if (files) files.forEach(file => fs.unlinkSync(file.path));
            return res.status(403).json({ message: "Chỉ chủ khóa học mới có thể cập nhật bài tập" });
        }

        let attachments = [null, null];
        if (files) {
            attachments = await Promise.all(files.map(async file => {
                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: 'auto',
                    folder: 'eduverse/assignments'
                });
                fs.unlinkSync(file.path);
                return result.secure_url;
            }));
        }

        const updateSql = `
            UPDATE assignments
            SET title = ?, description = ?, attachment1 = COALESCE(?, attachment1), attachment2 = COALESCE(?, attachment2),
                due_date = ?, point = ?, max_attemps = ?            --, updated_at = CURRENT_TIMESTAMP
            WHERE assignment_id = ?`;
        const values = [title, description, attachments[0], attachments[1], due_date, point, max_attemps, assignment_id];
        await query(updateSql, values);

        return res.status(200).json({ message: "Bài tập đã được cập nhật" });
    } catch (error) {
        if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa bài tập (Chỉ 'Giáo viên' làm chủ khóa học hoặc 'Quản trị viên' mới được xóa bài tập)
exports.deleteAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        const checkAssignmentSql = `
            SELECT l.course_id, c.teacher_id
            FROM assignments a
            JOIN lessons l ON a.lesson_id = l.lesson_id
            JOIN courses c ON l.course_id = c.course_id
            WHERE a.assignment_id = ?`;
        const assignmentData = await query(checkAssignmentSql, [assignment_id]);

        if (assignmentData.length === 0) {
            return res.status(404).json({ message: "Bài tập không tồn tại" });
        }

        if (assignmentData[0].teacher_id !== userId && userRole !== 'Quản trị viên') {
            return res.status(403).json({ message: "Chỉ chủ khóa học hoặc Quản trị viên mới có thể xóa bài tập" });
        }

        const deleteSql = 'DELETE FROM assignments WHERE assignment_id = ?';
        await query(deleteSql, [assignment_id]);

        return res.status(200).json({ message: "Bài tập đã được xóa" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};