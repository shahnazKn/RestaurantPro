const jwt = require('jsonwebtoken');
const RestaurantOwner = require('../models/RestaurantOwner');
const Customer = require('../models/Customers');
const Admin = require('../models/Admin');

const authenticateRestaurantOwner = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Find the restaurant owner by ID from the decoded token
        const restaurantOwner = await RestaurantOwner.findById(decoded.id);
        if (!restaurantOwner) {
            return res.status(404).json({ message: 'Restaurant owner not found' });
        }

        // Attach the restaurant owner ID to the request object for further use
        req.user = { restaurantId: restaurantOwner._id };

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

const authenticateCustomer = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Find the customer by ID from the decoded token
        const customer = await Customer.findById(decoded.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer details not found' });
        }

        // Attach the customer id to the request object for further use
        req.user = { customerId: customer._id };

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

const authenticateAdmin = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Find the admin by ID from the decoded token
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({ message: 'User is not an admin' });
        }

        // Attach the customer id to the request object for further use
        req.user = { adminId: admin._id };

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};


module.exports = { authenticateRestaurantOwner, authenticateCustomer };
