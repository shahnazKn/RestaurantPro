const express = require('express');
const router = express.Router();
const { getAllRestaurants, verifyRestaurant, rejectRestaurant } = require('../controllers/adminController');
const { authenticateAdmin } = require('../middlewares/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Get all restaurants
router.get('/restaurants', getAllRestaurants);

// Verify a restaurant
router.put('/verify-restaurant/:restaurantId', verifyRestaurant);

// Reject and delete a restaurant
router.delete('/reject-restaurant/:restaurantId', rejectRestaurant);

module.exports = router;
