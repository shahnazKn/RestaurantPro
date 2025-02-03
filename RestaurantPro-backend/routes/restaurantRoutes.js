const express = require('express');
const { 
    getRestaurantDetails,
    updateRestaurantDetails,
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    getMenuItem, 
    getMenuItemById,
    addStaffMember,
    getStaffCount,
    deleteStaffMember,
    editStaffMember,
    addReservationDetails,
    updateReservation,
    getStaffMember,
    searchRestaurants,
    searchMenuItems } = require('../controllers/restaurantController');
const { authenticateRestaurantOwner } = require('../middlewares/auth');

const router = express.Router();

//Get restaurant details
router.get('/', authenticateRestaurantOwner, getRestaurantDetails);

// Update restaurant details 
router.put("/update", authenticateRestaurantOwner, updateRestaurantDetails);

// Add a new menu item
router.post('/menu', authenticateRestaurantOwner, addMenuItem);

// Update a menu item
router.put('/menu/:menuId', authenticateRestaurantOwner, updateMenuItem);

// Delete a menu item
router.delete('/menu/:menuId', authenticateRestaurantOwner, deleteMenuItem);

// Get menu items for restaurant owners
router.get('/menu',authenticateRestaurantOwner, getMenuItem);

// Get menu items by id
router.get('/menu/:restaurantId', getMenuItemById);

// Add staff member
router.post("/staff", authenticateRestaurantOwner, addStaffMember);

// Get staff memeber
router.get("/staff", authenticateRestaurantOwner, getStaffMember);

// Get staff count - by taking count of delivery staff
router.get("/staff/count", authenticateRestaurantOwner, getStaffCount); 

// Delete staff member
router.delete("/staff/:staffId", authenticateRestaurantOwner, deleteStaffMember);

// Edit staff member
router.put("/staff/:staffId", authenticateRestaurantOwner, editStaffMember);

// Add reservation details
router.post("/reservation", authenticateRestaurantOwner, addReservationDetails);

// Update reservation details
router.put("/reservation/:reservationId", authenticateRestaurantOwner, updateReservation);

// Search restaurants by name
router.get('/search', searchRestaurants);

// Search menu items within a selected restaurant
router.get('/:restaurantId/menu/search', searchMenuItems);

module.exports = router;
