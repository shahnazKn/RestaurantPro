const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes
router.post('/signin', authController.signin);
router.post('/signup/customer', authController.customerSignup);
router.post('/signup/restaurant', authController.restaurantSignup);

module.exports = router;