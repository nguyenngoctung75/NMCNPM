const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');  

router.post('/create-review', authMiddleware.authenticate, reviewController.createReview);
router.get('/reviews/:course_id', reviewController.getCourseReviews);
router.put('/update-review/:review_id', authMiddleware.authenticate, reviewController.updateReview);

module.exports = router;
