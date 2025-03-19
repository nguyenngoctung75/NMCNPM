// Mô hình dữ liệu cho thông tin cá nhân

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Personal = sequelize.define('Personal', {
  user_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  full_name: DataTypes.STRING(255),
  email: {
    type: DataTypes.STRING(255),
    unique: true
  },
  phone: DataTypes.STRING(20),
  address: DataTypes.STRING(255),
  highest_education: DataTypes.ENUM('Tiến sĩ', 'Thạc sĩ', 'Cử nhân', 'Cao đẳng', 'Trung học phổ thông', 'Trung học cơ sở', 'Tiểu học', 'Không chính quy', 'Khác'),
  date_of_birth: DataTypes.DATE,
  gender: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
  profile_picture: DataTypes.STRING(255),
  nationality: DataTypes.STRING(50),
  facebook_profile: DataTypes.STRING(255),
  x_profile: DataTypes.STRING(255),
  linkedin_profile: DataTypes.STRING(255),
  bio: DataTypes.TEXT
});

module.exports = Personal;