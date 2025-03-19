// Mô hình dữ liệu cho thống kê hoạt động

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Statistic = sequelize.define('Statistic', {
  stat_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING(20),
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  activity_type: DataTypes.ENUM('Đăng nhập', 'Ghi danh', 'Nộp bài'),
  activity_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Statistic;