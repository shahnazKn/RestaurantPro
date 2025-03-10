const express = require('express');
const router = express.Router();
const { authenticateRestaurantOwner } = require('../middlewares/auth');
const { 
    getRestaurantOrders, 
    updateOrderStatus, 
    getOrderDetails 
} = require('../controllers/orderController');

// Restaurant order management routes
router.get('/restaurant-orders', authenticateRestaurantOwner, getRestaurantOrders);
router.put('/update-status/:orderId', authenticateRestaurantOwner, updateOrderStatus);
router.get('/details/:orderId', authenticateRestaurantOwner, getOrderDetails);

module.exports = router;
