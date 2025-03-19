// Xử lý logic cho các yêu cầu liên quan đến người dùng.

const User = require('../models/User');
const Personal = require('../models/Personal');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id, {
      include: [Personal]
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.update(req.body, { where: { user_id: req.params.user_id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};