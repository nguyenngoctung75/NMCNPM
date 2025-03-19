// Xử lý logic cho các yêu cầu liên quan đến báo cáo.

const Statistic = require('../models/Statistic');

exports.getActivityReport = async (req, res) => {
  try {
    const reports = await Statistic.findAll({ where: { user_id: req.params.user_id } });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgressReport = async (req, res) => {
  try {
    const progress = await Statistic.findAll({ where: { activity_type: 'Ghi danh' } });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};