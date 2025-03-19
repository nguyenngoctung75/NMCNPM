// Mô hình dữ liệu cho thông báo

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  notification_id: {
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
  message: DataTypes.TEXT,
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Notification;