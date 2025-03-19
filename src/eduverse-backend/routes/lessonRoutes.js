const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');  

// router.post('/lessons', authMiddleware.authenticate, lessonController.createLesson);
router.get('/lessons/:course_id', lessonController.getLessonsByCourse);
// router.put('/lessons/:lesson_id', authMiddleware.authenticate, lessonController.updateLesson);
// router.delete('/lessons/:lesson_id', authMiddleware.authenticate, lessonController.deleteLesson);
router.post('/create', authMiddleware.authenticate, lessonController.createLesson);
router.get('/total', lessonController.getTotalLesson);

module.exports = router;