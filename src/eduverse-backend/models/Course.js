// Mô hình dữ liệu cho khóa học.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  title: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  teacher_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  price: DataTypes.DECIMAL(10, 2),
  duration: DataTypes.INTEGER,
  category: DataTypes.STRING(100),
  cover_image: DataTypes.STRING(255),
  status: DataTypes.ENUM('Đang hoạt động', 'Không hoạt động', 'Sắp ra mắt', 'Đã xóa')
});

module.exports = Course;