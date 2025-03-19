// Mô hình dữ liệu cho đánh giá

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  enrollment_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Enrollments',
      key: 'enrollment_id'
    },
    unique: true
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: DataTypes.TEXT,
  review_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Review;