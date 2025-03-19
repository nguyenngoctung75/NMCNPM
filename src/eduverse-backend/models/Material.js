// Mô hình dữ liệu cho tài liệu.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Material = sequelize.define('Material', {
  material_id: {
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
  type: DataTypes.ENUM('Tài liệu', 'Video'),
  content_url: DataTypes.STRING(255),
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Material;