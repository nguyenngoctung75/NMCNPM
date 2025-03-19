const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');  

router.post('/create-invoice', authMiddleware.authenticate, paymentController.createInvoice);
router.post('/process-payment/:payment_id', authMiddleware.authenticate, paymentController.processPayment);
router.get('/payments', authMiddleware.authenticate, paymentController.listPayments);

module.exports = router;
