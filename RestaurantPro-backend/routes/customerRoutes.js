const express = require('express');
const { 
    getCustomerDetails,
    updateCustomerDetails
 } = require('../controllers/customerController');
const { authenticateCustomer } = require('../middlewares/auth');

const router = express.Router();

// Get customer details
router.get('/', authenticateCustomer, getCustomerDetails);

// Update customer details
router.put('/update',authenticateCustomer, updateCustomerDetails);

module.exports = router;