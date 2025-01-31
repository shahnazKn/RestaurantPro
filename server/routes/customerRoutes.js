const express = require('express');
const { getCustomerDetails } = require('../controllers/customerController');
const { authenticateCustomer } = require('../middlewares/auth');

const router = express.Router();

// Get customer details
router.get('/', authenticateCustomer, getCustomerDetails);

module.exports = router;