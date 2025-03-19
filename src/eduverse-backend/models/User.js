// Mô hình dữ liệu cho người dùng.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  name: DataTypes.STRING(255),
  email: {
    type: DataTypes.STRING(255),
    unique: true
  },
  password: DataTypes.STRING(255),
  role: DataTypes.ENUM('Học viên', 'Giáo viên', 'Quản trị viên', 'Khác'),
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: DataTypes.DATE
});

module.exports = User;
