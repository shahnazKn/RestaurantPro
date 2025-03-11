const express = require('express');
const router = express.Router();
const { authenticateRestaurantOwner, authenticateCustomer } = require('../middlewares/auth');
const { 
    getRestaurantOrders, 
    updateOrderStatus, 
    getOrderDetails,
    getMyOrders 
} = require('../controllers/orderController');

// Restaurant order management routes
router.get('/restaurant-orders', authenticateRestaurantOwner, getRestaurantOrders);
router.put('/update-status/:orderId', authenticateRestaurantOwner, updateOrderStatus);
router.get('/details/:orderId', authenticateRestaurantOwner, getOrderDetails);

// Customer order routes
router.get('/my-orders', authenticateCustomer, getMyOrders);

module.exports = router;
