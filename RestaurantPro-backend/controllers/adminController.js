const Restaurant = require('../models/RestaurantOwner');

// Get all restaurants (both verified and unverified)
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

// Verify a restaurant
const verifyRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await Restaurant.findById(restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.isVerified = true;
        await restaurant.save();

        // You might want to send an email to the restaurant owner here
        
        res.json({ message: 'Restaurant verified successfully', restaurant });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying restaurant', error: error.message });
    }
};

// Reject and delete a restaurant
const rejectRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await Restaurant.findById(restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        await Restaurant.findByIdAndDelete(restaurantId);
        
        res.json({ message: 'Restaurant rejected and removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting restaurant', error: error.message });
    }
};

module.exports = {
    getAllRestaurants,
    verifyRestaurant,
    rejectRestaurant
};
