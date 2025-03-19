const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm để lưu trữ file trước khi upload lên Cloudinary

router.post('/assignments', authenticate, upload.array('files', 2), assignmentController.createAssignment);
router.get('/assignments/:lesson_id', authenticate, assignmentController.getAssignmentsByLesson);
// router.put('/assignments/:assignment_id', authenticate, upload.array('files', 2), assignmentController.updateAssignment);
// router.delete('/assignments/:assignment_id', authenticate, assignmentController.deleteAssignment);
router.get('/assignments/show/:assignment_id', assignmentController.getAssignment);

module.exports = router;

// Trong trường hợp cần giới hạn kích thước file
/*const upload = multer({ 
    dest: 'uploads/', // Thư mục tạm để lưu trữ file trước khi upload lên Cloudinary
    limits: { fileSize: 20 * 1024 * 1024 } // Giới hạn kích thước từng file là 20MB
});

// Middleware kiểm tra tổng kích thước các file đính kèm
const checkTotalFileSize = (req, res, next) => {
    const files = req.files;
    if (!files) {
        return next();
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 30 * 1024 * 1024) {
        files.forEach(file => fs.unlinkSync(file.path)); // Xóa các file tạm thời nếu vượt quá giới hạn
        return res.status(400).json({ message: "Tổng dung lượng các file không được vượt quá 30MB" });
    }

    next();
};

// Thêm bài tập (Chỉ 'Giáo viên' làm chủ khóa học có chứa bài học này mới được thêm bài tập)
router.post('/assignments', authenticate, upload.array('files', 2), checkTotalFileSize, assignmentController.createAssignment);

// Xem bài tập theo bài học
router.get('/assignments/:lesson_id', authenticate, assignmentController.getAssignmentsByLesson);

// Cập nhật bài tập (Chỉ 'Giáo viên' làm chủ khóa học có chứa bài học này mới được cập nhật bài tập)
router.put('/assignments/:assignment_id', authenticate, upload.array('files', 2), checkTotalFileSize, assignmentController.updateAssignment);

// Xóa bài tập (Chỉ 'Giáo viên' làm chủ khóa học hoặc 'Quản trị viên' mới được xóa bài tập)
router.delete('/assignments/:assignment_id', authenticate, assignmentController.deleteAssignment);

module.exports = router;*/