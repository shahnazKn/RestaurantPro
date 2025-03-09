const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customers');
const RestaurantOwner = require('../models/RestaurantOwner');
const User = require('../models/User');

// Sign in controller
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exist
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if(user.role === "RestaurantOwner" && user.isVerified === false){
            return res.status(400).json({ message: "Restaurant is not verified" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: "Sign in successful", userRole: (user.toObject()).role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Customer signup controller
exports.customerSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new customer
        const customer = new Customer({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            address
        });

        await customer.save();

        // Create JWT token
        const token = jwt.sign(
            { 
                userId: customer._id,
                role: 'Customer',
                customerId: customer._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                role: 'Customer'
            }
        });
    } catch (error) {
        console.error('Customer signup error:', error);
        res.status(500).json({ message: 'Error creating customer account' });
    }
};

// Restaurant signup controller
exports.restaurantSignup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            restaurantName,
            contactNumber,
            restaurantID,
            fssaiLicenceNumber,
            bankDetails,
            address
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new restaurant owner
        const restaurantOwner = new RestaurantOwner({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            restaurantName,
            contactNumber,
            restaurantID,
            fssaiLicenceNumber,
            isVerified: false,
            bankDetails,
            address
        });

        await restaurantOwner.save();

        // Create JWT token
        const token = jwt.sign(
            { 
                userId: restaurantOwner._id,
                role: 'RestaurantOwner',
                restaurantId: restaurantOwner._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: restaurantOwner._id,
                firstName: restaurantOwner.firstName,
                lastName: restaurantOwner.lastName,
                email: restaurantOwner.email,
                role: 'RestaurantOwner'
            }
        });
    } catch (error) {
        console.error('Restaurant signup error:', error);
        res.status(500).json({ message: 'Error creating restaurant account' });
    }
};

