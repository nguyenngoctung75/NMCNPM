// Mô hình dữ liệu cho bài tập

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
  assignment_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  lesson_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Lessons',
      key: 'lesson_id'
    }
  },
  title: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  due_date: DataTypes.DATE,
  point: DataTypes.DECIMAL(5, 2)
});

module.exports = Assignment;