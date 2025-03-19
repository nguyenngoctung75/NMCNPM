// Mô hình dữ liệu cho thanh toán

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  student_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  course_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Courses',
      key: 'course_id'
    }
  },
  amount: DataTypes.DECIMAL(12, 2),
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Payment;