// Định tuyến cho các API liên quan đến khóa học.

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware.authenticate, courseController.createCourse);
router.get('/list', courseController.listCourses);
router.get('/me/list', authMiddleware.authenticate, courseController.listMeCourses);
router.get('/detail/:course_id', courseController.getCourseById);
router.put('/update/:course_id', authMiddleware.authenticate, courseController.updateCourse);
// router.get('/:id', courseController.getCourseById);
// router.put('/:id', authMiddleware.authenticate, courseController.updateCourse);
// router.delete('/:id', authMiddleware.authenticate, courseController.deleteCourse);

module.exports = router;