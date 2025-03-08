const express = require('express');
const router = express.Router();
const { authenticateCustomer } = require('../middlewares/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// Create Razorpay order
router.post('/create-order', authenticateCustomer, createOrder);

// Verify payment
router.post('/verify-payment', authenticateCustomer, verifyPayment);

module.exports = router; 