const db = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const fs = require('fs');

// Hàm tạo material_id theo cấu trúc M + số thứ tự
const generateMaterialId = (materialCount) => {
    const materialIdNumber = materialCount + 1;
    return `M${materialIdNumber.toString().padStart(3, '0')}`;
};

// Thêm tài liệu (Chỉ 'Giáo viên' làm chủ khóa học có chứa bài học này mới được thêm tài liệu)
exports.createMaterial = async (req, res) => {
    try {
        const { lesson_id, title, type } = req.body;
        const userId = req.user.user_id;
        const userRole = req.user.role;
        const file = req.file.path;

        // Kiểm tra xem người dùng có phải là chủ khóa học không
        const checkLessonSql = `
            SELECT l.course_id, c.teacher_id
            FROM lessons l
            JOIN courses c ON l.course_id = c.course_id
            WHERE l.lesson_id = ? AND c.teacher_id = ?`;
        const lessonData = await query(checkLessonSql, [lesson_id, userId]);
        if (lessonData.length === 0) {
            fs.unlinkSync(file);
            return res.status(403).json({ message: "Chỉ chủ khóa học mới có thể thêm tài liệu" });
        }
        // Tải lên file lên Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            resource_type: type === 'Video' ? 'video' : 'auto',
            folder: 'eduverse/materials'
        });
        // Xóa file sau khi upload
        fs.unlinkSync(file);

        // Đếm số lượng tài liệu hiện có để tạo material_id
        const countMaterialsSql = 'SELECT COUNT(*) as count FROM materials';
        const countData = await query(countMaterialsSql);
        const materialId = generateMaterialId(countData[0].count);
        const uploaded_at = new Date();
        const insertSql = 'INSERT INTO materials (material_id, lesson_id, title, type, content_url, uploaded_at) VALUES (?, ?, ?, ?, ?, DEFAULT)';
        const values = [materialId, lesson_id, title, type, result.secure_url, uploaded_at];
        console.log(values);
        await query(insertSql, values);

        return res.status(201).json({ message: "Tài liệu đã được tạo", materialId });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Xóa file nếu có lỗi
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Hiển thị tài liệu của một bài học (Giáo viên chỉ xem tài liệu trong khóa học của bản thân, Quản trị viên xem tất cả tài liệu, học viên đã đăng ký mới được xem tài liệu)
exports.getMaterialsByLesson = async (req, res) => {
  try {
      const { lesson_id } = req.params;
      const userId = req.user.user_id;
      const userRole = req.user.role;

      let sql;
      let values;
      if (userRole === 'Quản trị viên') {
          sql = 'SELECT * FROM materials WHERE lesson_id = ?';
          values = [lesson_id];
      } else if (userRole === 'Giáo viên') {
          sql = `
              SELECT m.*
              FROM materials m
              JOIN lessons l ON m.lesson_id = l.lesson_id
              JOIN courses c ON l.course_id = c.course_id
              WHERE m.lesson_id = ? AND c.teacher_id = ?`;
          values = [lesson_id, userId];
      } else {
        //   sql = `
        //       SELECT m.*
        //       FROM materials m
        //       JOIN lessons l ON m.lesson_id = l.lesson_id
        //       JOIN enrollments e ON l.course_id = e.course_id
        //       WHERE m.lesson_id = ? AND e.student_id = ?`;
        //   values = [lesson_id, userId];
          sql = `
              SELECT * FROM materials WHERE lesson_id = ?`;
          values = [lesson_id, userId];
      }

      const materials = await query(sql, values);
      return res.status(200).json(materials);
  } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//Lay ra Material khi da biet lesson_id
exports.getMaterial = async (req, res) => {
    try {
        const { material_id } = req.params;
        const sql = 'SELECT * FROM materials WHERE material_id = ?';
        db.query(sql, [material_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi server" });
            }
            return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// Cập nhật tài liệu (Chỉ 'Giáo viên' làm chủ khóa học có chứa bài học này mới được cập nhật tài liệu)
exports.updateMaterial = async (req, res) => {
    try {
        const { material_id } = req.params;
        const { title, type } = req.body;
        const userId = req.user.user_id;
        const file = req.file ? req.file.path : null;

        // Kiểm tra xem người dùng có phải là chủ khóa học không
        const checkMaterialSql = `
            SELECT l.course_id, c.teacher_id
            FROM materials m
            JOIN lessons l ON m.lesson_id = l.lesson_id
            JOIN courses c ON l.course_id = c.course_id
            WHERE m.material_id = ? AND c.teacher_id = ?`;
        const materialData = await query(checkMaterialSql, [material_id, userId]);

        if (materialData.length === 0) {
            if (file) fs.unlinkSync(file); // Xóa file đã upload tạm thời
            return res.status(403).json({ message: "Chỉ chủ khóa học mới có thể cập nhật tài liệu" });
        }

        let contentUrl;
        if (file) {
            // Tải lên file mới lên Cloudinary
            const result = await cloudinary.uploader.upload(file, {
                resource_type: type === 'Video' ? 'video' : 'auto',
                folder: 'eduverse/materials'
            });

            // Xóa file sau khi upload
            fs.unlinkSync(file);
            contentUrl = result.secure_url;
        }

        const updateSql = `
            UPDATE materials
            SET title = ?, type = ?, content_url = COALESCE(?, content_url)
            WHERE material_id = ?`;
        const values = [title, type, contentUrl, material_id];
        await query(updateSql, values);

        return res.status(200).json({ message: "Tài liệu đã được cập nhật" });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Xóa file nếu có lỗi
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa tài liệu (Chỉ 'Giáo viên' làm chủ khóa học hoặc 'Quản trị viên' mới được xóa tài liệu)
exports.deleteMaterial = async (req, res) => {
    try {
        const { material_id } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        // Kiểm tra quyền xóa tài liệu
        const checkMaterialSql = `
            SELECT l.course_id, c.teacher_id
            FROM materials m
            JOIN lessons l ON m.lesson_id = l.lesson_id
            JOIN courses c ON l.course_id = c.course_id
            WHERE m.material_id = ?`;
        const materialData = await query(checkMaterialSql, [material_id]);

        if (materialData.length === 0) {
            return res.status(404).json({ message: "Tài liệu không tồn tại" });
        }

        if (materialData[0].teacher_id !== userId && userRole !== 'Quản trị viên') {
            return res.status(403).json({ message: "Chỉ chủ khóa học hoặc Quản trị viên mới có thể xóa tài liệu" });
        }

        const deleteSql = 'DELETE FROM materials WHERE material_id = ?';
        await query(deleteSql, [material_id]);

        return res.status(200).json({ message: "Tài liệu đã được xóa" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};