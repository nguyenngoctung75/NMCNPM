// Mô hình dữ liệu cho chứng chỉ

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certificate = sequelize.define('Certificate', {
  certificate_id: {
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
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Certificate;