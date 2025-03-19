const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// Hàm tạo review_id theo cấu trúc R + số thứ tự
const generateReviewId = (reviewCount) => {
    const reviewIdNumber = reviewCount + 1;
    return `R${reviewIdNumber.toString().padStart(3, '0')}`;
};

// Tạo đánh giá (Chỉ 'Học viên' đã ghi danh ít nhất 15 ngày mới có thể đánh giá)
exports.createReview = async (req, res) => {
    try {
        const { enrollment_id, rating, comment } = req.body;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        // Kiểm tra vai trò người dùng
        if (userRole !== 'Học viên') {
            return res.status(403).json({ message: "Chỉ học viên mới có thể đánh giá" });
        }

        // Kiểm tra xem học viên đã ghi danh ít nhất 15 ngày chưa
        const checkEnrollmentSql = 'SELECT enrolled_at FROM enrollments WHERE enrollment_id = ? AND student_id = ?';
        const enrollmentData = await query(checkEnrollmentSql, [enrollment_id, userId]);

        if (enrollmentData.length === 0) {
            return res.status(404).json({ message: "Ghi danh không tồn tại hoặc không thuộc về bạn" });
        }

        const enrolledAt = new Date(enrollmentData[0].enrolled_at);
        const now = new Date();
        const diffDays = Math.ceil((now - enrolledAt) / (1000 * 60 * 60 * 24));

        if (diffDays < 15) {
            return res.status(400).json({ message: "Bạn phải ghi danh ít nhất 15 ngày mới có thể đánh giá" });
        }

        // Kiểm tra xem học viên đã đánh giá khóa học này chưa
        const checkReviewSql = 'SELECT * FROM reviews WHERE enrollment_id = ?';
        const reviewExists = await query(checkReviewSql, [enrollment_id]);

        if (reviewExists.length > 0) {
            return res.status(400).json({ message: "Bạn đã đánh giá khóa học này rồi" });
        }

        // Đếm số lượng đánh giá hiện có để tạo review_id
        const countReviewsSql = 'SELECT COUNT(*) as count FROM reviews';
        const countData = await query(countReviewsSql);
        const reviewId = generateReviewId(countData[0].count);

        const insertSql = 'INSERT INTO reviews (review_id, enrollment_id, rating, comment, review_date) VALUES (?, ?, ?, ?, DEFAULT)';
        const values = [reviewId, enrollment_id, rating, comment];
        await query(insertSql, values);

        return res.status(201).json({ message: "Đánh giá đã được tạo", reviewId });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xem đánh giá của một khóa học (mọi người đều có thể xem)
exports.getCourseReviews = async (req, res) => {
    try {
        const { course_id } = req.params;
        const sql = `
            SELECT r.review_id, r.rating, r.comment, r.review_date, u.name as student_name
            FROM reviews r
            JOIN enrollments e ON r.enrollment_id = e.enrollment_id
            JOIN users u ON e.student_id = u.user_id
            WHERE e.course_id = ?`;
        const reviews = await query(sql, [course_id]);

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật đánh giá (Chỉ học viên có thể cập nhật đánh giá của bản thân)
exports.updateReview = async (req, res) => {
    try {
        const { review_id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.user_id; // Giả sử req.user chứa thông tin người dùng đã xác thực
        const userRole = req.user.role;

        // Kiểm tra vai trò người dùng
        if (userRole !== 'Học viên') {
            return res.status(403).json({ message: "Chỉ học viên mới có thể cập nhật đánh giá" });
        }

        // Kiểm tra xem đánh giá có tồn tại và thuộc về học viên không
        const checkReviewSql = `
            SELECT r.review_id
            FROM reviews r
            JOIN enrollments e ON r.enrollment_id = e.enrollment_id
            WHERE r.review_id = ? AND e.student_id = ?`;
        const reviewData = await query(checkReviewSql, [review_id, userId]);

        if (reviewData.length === 0) {
            return res.status(404).json({ message: "Đánh giá không tồn tại hoặc không thuộc về bạn" });
        }

        const updateSql = 'UPDATE reviews SET rating = ?, comment = ? WHERE review_id = ?';
        const values = [rating, comment, review_id];
        await query(updateSql, values);

        return res.status(200).json({ message: "Đánh giá đã được cập nhật" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};