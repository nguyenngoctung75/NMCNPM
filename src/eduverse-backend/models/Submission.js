// Mô hình dữ liệu cho nộp bài

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  submission_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  assignment_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Assignments',
      key: 'assignment_id'
    }
  },
  student_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  grade: DataTypes.DECIMAL(5, 2),
  feedback: DataTypes.TEXT
});

module.exports = Submission;