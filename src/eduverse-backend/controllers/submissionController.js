const db = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const fs = require('fs');
const notificationController = require('./notificationController'); // Import NotificationController

// Hàm tạo submission_id theo cấu trúc S + số thứ tự
const generateSubmissionId = (submissionCount) => {
    const submissionIdNumber = submissionCount + 1;
    return `S${submissionIdNumber.toString().padStart(3, '0')}`;
};

// Nộp bài (Chỉ 'học viên' đã đăng ký khóa học có chứa bài tập này mới được nộp bài)
exports.submitAssignment = async (req, res) => {
    try {
        const { assignment_id, note } = req.body;
        const userId = req.user.user_id;
        const userRole = req.user.role;
        const files = req.files;

        if (userRole !== 'Học viên') {
            if (files) files.forEach(file => fs.unlinkSync(file.path));
            return res.status(403).json({ message: "Chỉ học viên mới được nộp bài" });
        }

        // Kiểm tra xem học viên đã đăng ký khóa học chứa bài tập này chưa
        const checkEnrollmentSql = `
            SELECT e.*
            FROM assignments a
            JOIN lessons l ON a.lesson_id = l.lesson_id
            JOIN enrollments e ON l.course_id = e.course_id
            WHERE a.assignment_id = ? AND e.student_id = ?`;
        const enrollmentData = await query(checkEnrollmentSql, [assignment_id, userId]);

        if (enrollmentData.length === 0) {
            if (files) files.forEach(file => fs.unlinkSync(file.path));
            return res.status(403).json({ message: "Bạn phải đăng ký khóa học chứa bài tập này" });
        }

        // Kiểm tra hạn nộp bài
        const checkDueDateSql = 'SELECT due_date FROM assignments WHERE assignment_id = ?';
        const dueDateData = await query(checkDueDateSql, [assignment_id]);
        const dueDate = new Date(dueDateData[0].due_date);
        const now = new Date();

        if (now > dueDate) {
            if (files) files.forEach(file => fs.unlinkSync(file.path));
            return res.status(400).json({ message: "Hạn nộp bài đã qua" });
        }

        // Kiểm tra xem note và attachment_url1 có cùng để trống không
        if (!note && !files.length) {
            return res.status(400).json({ message: "Cả trường note và attachment_url1 không được để trống cùng lúc" });
        }

        // Tải lên file lên Cloudinary nếu có
        const attachments = await Promise.all(files.map(async file => {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto',
                folder: 'eduverse/submissions'
            });
            fs.unlinkSync(file.path); // Xóa file sau khi upload
            return result.secure_url;
        }));

        // Đếm số lượng bài nộp hiện có để tạo submission_id
        const countSubmissionsSql = 'SELECT COUNT(*) as count FROM submissions';
        const countData = await query(countSubmissionsSql);
        const submissionId = generateSubmissionId(countData[0].count);

        const insertSql = `
            INSERT INTO submissions (submission_id, assignment_id, student_id, note, attachment_url1, attachment_url2, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, DEFAULT)`;
        const values = [
            submissionId, assignment_id, userId, note,
            attachments[0] || null, attachments[1] || null
        ];
        await query(insertSql, values);

        return res.status(201).json({ message: "Bài nộp đã được gửi", submissionId });
    } catch (error) {
        if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem bài nộp (Học viên chỉ xem được bài đã nộp của bản thân, giáo viên xem được các bài nộp trong khóa học của mình, quản trị viên xem được mọi bài nộp)
exports.getSubmissions = async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        let sql;
        let values;
        if (userRole === 'Quản trị viên') {
            sql = 'SELECT * FROM submissions WHERE assignment_id = ?';
            values = [assignment_id];
        } else if (userRole === 'Giáo viên') {
            sql = `
                SELECT s.*
                FROM submissions s
                JOIN assignments a ON s.assignment_id = a.assignment_id
                JOIN lessons l ON a.lesson_id = l.lesson_id
                JOIN courses c ON l.course_id = c.course_id
                WHERE s.assignment_id = ? AND c.teacher_id = ?`;
            values = [assignment_id, userId];
        } else {
            sql = 'SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?';
            values = [assignment_id, userId];
        }

        const submissions = await query(sql, values);
        return res.status(200).json(submissions);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Sửa bài đã nộp (Học viên chỉ có thể sửa bài của mình trước khi giáo viên chấm điểm)
exports.updateSubmission = async (req, res) => {
    try {
        const { submission_id } = req.params;
        const { note } = req.body;
        const userId = req.user.user_id;
        const files = req.files;

        // Kiểm tra xem bài nộp có thuộc về học viên không và chưa được chấm điểm
        const checkSubmissionSql = 'SELECT * FROM submissions WHERE submission_id = ? AND student_id = ? AND grade IS NULL';
        const submissionData = await query(checkSubmissionSql, [submission_id, userId]);

        if (submissionData.length === 0) {
            if (files) files.forEach(file => fs.unlinkSync(file.path));
            return res.status(403).json({ message: "Bạn chỉ có thể sửa bài của mình trước khi giáo viên chấm điểm" });
        }

        // Kiểm tra xem note và attachment_url1 có cùng để trống không
        if (!note && !files.length) {
            return res.status(400).json({ message: "Cả trường note và attachment_url1 không được để trống cùng lúc" });
        }

        let attachments = [null, null];
        if (files) {
            attachments = await Promise.all(files.map(async file => {
                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: 'auto',
                    folder: 'eduverse/submissions'
                });
                fs.unlinkSync(file.path);
                return result.secure_url;
            }));
        }

        const updateSql = `
            UPDATE submissions
            SET note = ?, attachment_url1 = COALESCE(?, attachment_url1), attachment_url2 = COALESCE(?, attachment_url2), submitted_at = CURRENT_TIMESTAMP
            WHERE submission_id = ?`;
        const values = [note, attachments[0], attachments[1], submission_id];
        await query(updateSql, values);

        return res.status(200).json({ message: "Bài nộp đã được cập nhật" });
    } catch (error) {
        if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Chấm điểm và phản hồi (Chức năng của giáo viên)
exports.gradeSubmission = async (req, res) => {
  try {
      const { submission_id } = req.params;
      const { grade, feedback } = req.body;
      const userId = req.user.user_id;
      const userRole = req.user.role;

      if (userRole !== 'Giáo viên') {
          return res.status(403).json({ message: "Chỉ giáo viên mới có thể chấm điểm và phản hồi" });
      }

      // Kiểm tra xem bài nộp có thuộc khóa học của giáo viên không
      const checkSubmissionSql = `
          SELECT s.*, c.teacher_id
          FROM submissions s
          JOIN assignments a ON s.assignment_id = a.assignment_id
          JOIN lessons l ON a.lesson_id = l.lesson_id
          JOIN courses c ON l.course_id = c.course_id
          WHERE s.submission_id = ? AND c.teacher_id = ?`;
      const submissionData = await query(checkSubmissionSql, [submission_id, userId]);

      if (submissionData.length === 0) {
          return res.status(403).json({ message: "Bạn chỉ có thể chấm điểm và phản hồi các bài nộp trong khóa học của mình" });
      }

      const updateSql = `
          UPDATE submissions
          SET grade = ?, feedback = ?
          WHERE submission_id = ?`;
      const values = [grade, feedback, submission_id];
      await query(updateSql, values);

      // Gửi thông báo cho học viên
      await notificationController.sendNotification(submissionData[0].student_id, `Bài nộp của bạn đã được chấm điểm và phản hồi.`);

      return res.status(200).json({ message: "Bài nộp đã được chấm điểm và phản hồi" });
  } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Yêu cầu phúc khảo (Chức năng của học viên)
exports.requestReevaluation = async (req, res) => {
  try {
      const { submission_id } = req.params;
      const userId = req.user.user_id;
      const userRole = req.user.role;

      if (userRole !== 'Học viên') {
          return res.status(403).json({ message: "Chỉ học viên mới có thể yêu cầu phúc khảo" });
      }

      // Kiểm tra xem bài nộp có thuộc về học viên không và chưa được yêu cầu phúc khảo quá 2 lần
      const checkSubmissionSql = 'SELECT * FROM submissions WHERE submission_id = ? AND student_id = ? AND reevaluation_count < 2';
      const submissionData = await query(checkSubmissionSql, [submission_id, userId]);

      if (submissionData.length === 0) {
          return res.status(403).json({ message: "Bạn chỉ có thể yêu cầu phúc khảo tối đa 2 lần cho mỗi bài nộp" });
      }

      const updateSql = `
          UPDATE submissions
          SET reevaluation_requested = TRUE, reevaluation_count = reevaluation_count + 1
          WHERE submission_id = ?`;
      await query(updateSql, [submission_id]);

      // Gửi thông báo cho giáo viên
      await notificationController.sendNotification(submissionData[0].teacher_id, `Học viên đã yêu cầu phúc khảo bài nộp với ID: ${submission_id}.`);

      return res.status(200).json({ message: "Yêu cầu phúc khảo đã được gửi" });
  } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật điểm và nhận xét sau phúc khảo (Chức năng của giáo viên)
exports.updateGradeAndFeedback = async (req, res) => {
  try {
      const { submission_id } = req.params;
      const { grade, feedback } = req.body;
      const userId = req.user.user_id;
      const userRole = req.user.role;

      if (userRole !== 'Giáo viên') {
          return res.status(403).json({ message: "Chỉ giáo viên mới có thể cập nhật điểm và nhận xét" });
      }

      // Kiểm tra xem bài nộp có thuộc khóa học của giáo viên không và có yêu cầu phúc khảo
      const checkSubmissionSql = `
          SELECT s.*, c.teacher_id
          FROM submissions s
          JOIN assignments a ON s.assignment_id = a.assignment_id
          JOIN lessons l ON a.lesson_id = l.lesson_id
          JOIN courses c ON l.course_id = c.course_id
          WHERE s.submission_id = ? AND c.teacher_id = ? AND s.reevaluation_requested = TRUE`;
      const submissionData = await query(checkSubmissionSql, [submission_id, userId]);

      if (submissionData.length === 0) {
          return res.status(403).json({ message: "Bạn chỉ có thể cập nhật điểm và nhận xét cho các bài nộp có yêu cầu phúc khảo" });
      }

      const updateSql = `
          UPDATE submissions
          SET grade = ?, feedback = ?, reevaluation_requested = FALSE
          WHERE submission_id = ?`;
      const values = [grade, feedback, submission_id];
      await query(updateSql, values);

      // Gửi thông báo cho học viên
      await notificationController.sendNotification(submissionData[0].student_id, `Điểm và nhận xét của bạn đã được cập nhật sau phúc khảo.`);

      return res.status(200).json({ message: "Điểm và nhận xét đã được cập nhật sau phúc khảo" });
  } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};