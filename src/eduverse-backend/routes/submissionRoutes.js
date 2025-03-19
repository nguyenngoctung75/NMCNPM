const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
// const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm để lưu trữ file trước khi upload lên Cloudinary

// // Nộp bài (Chức năng của học viên)
// router.post('/submissions', authMiddleware.authenticate, upload.array('files', 2), submissionController.submitAssignment);

// // Xem bài nộp theo bài tập
// router.get('/submissions/:assignment_id', authMiddleware.authenticate, submissionController.getSubmissions);

// // Sửa bài đã nộp (Chức năng của học viên)
// router.put('/submissions/:submission_id', authMiddleware.authenticate, upload.array('files', 2), submissionController.updateSubmission);

// // Chấm điểm và phản hồi (Chức năng của giáo viên)
// router.post('/submissions/:submission_id/grade', authMiddleware.authenticate, submissionController.gradeSubmission);

// // Yêu cầu phúc khảo (Chức năng của học viên)
// router.post('/submissions/:submission_id/request-reevaluation', authMiddleware.authenticate, submissionController.requestReevaluation);

// // Cập nhật điểm và nhận xét sau phúc khảo (Chức năng của giáo viên)
// router.post('/submissions/:submission_id/update-grade-feedback', authMiddleware.authenticate, submissionController.updateGradeAndFeedback);

router.post('/submissions', upload.single('file'), submissionController.submitAssignment);
module.exports = router;