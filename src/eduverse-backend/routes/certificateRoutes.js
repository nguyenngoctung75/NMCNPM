const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middlewares/authMiddleware');  

router.post('/issue-certificate', authMiddleware.authenticate, certificateController.issueCertificate);
router.get('/certificates/:user_id?', authMiddleware.authenticate, certificateController.listCertificates);
router.delete('/certificate/:certificate_id', authMiddleware.authenticate, certificateController.deleteCertificate);

module.exports = router;
