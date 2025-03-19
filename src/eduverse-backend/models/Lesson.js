// Mô hình dữ liệu cho bài học

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lesson = sequelize.define('Lesson', {
  lesson_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  course_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Courses',
      key: 'course_id'
    }
  },
  title: DataTypes.STRING(255),
  content: DataTypes.TEXT,
  lesson_order: DataTypes.INTEGER
});

module.exports = Lesson;