const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Customer = require('../models/Customers');
const RestaurantOwner = require('../models/RestaurantOwner');

// Sign in
exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exist
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: "Sign in successful", userRole: (user.toObject()).role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Customer signup
exports.customerSignup = async (req, res) => {
    const { firstName,
        lastName,
        email,
        address: {
            street,
            city,
            state,
            postalCode,
            country
        }
    } = req.body;
    let password = req.body.password;
    // Check if the customer already exists
    const customerExists = await User.findOne({ email });
    if (customerExists) {
        return res.status(400).json({ message: 'Customer already exists' });
    }
    password = await bcrypt.hash(password, 10);
    // Create a new customer
    const customer = new Customer({
        firstName,
        lastName,
        email,
        password,
        address: {
            street,
            city,
            state,
            postalCode,
            country,
        }
    });

    try {
        await customer.save();
        const token = jwt.sign(
            { customerId: customer._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ message: 'Customer created', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating customer' });
    }
};

// Reastaurant Owner signup
exports.restaurantOwnerSignup = async (req, res) => {
    const { firstName,
        lastName,
        email,
        contactNumber,
        restaurantID,
        fssaiLicenceNumber,
        bankDetails: {
            accountNumber,
            ifscCode,
            bankName,
        },
        address: {
            street,
            city,
            state,
            zipCode,
        },
        country
    } = req.body;
    let password = req.body.password,
        isVerified = false;

    // Check if the Restaurant already exists
    const restaurantExists = await User.findOne({ email });
    if (restaurantExists) {
        return res.status(400).json({ message: 'Restaurant profile already exists' });
    }
    password = await bcrypt.hash(password, 10);
    // Create a new Restaurant profile
    const restaurant = new RestaurantOwner({
        firstName,
        lastName,
        email,
        password,
        deliveryAvailable: false,
        takeAwayAvailable: false,
        dineInAvailable: false,
        dineInCapacity: 0,
        contactNumber,
        restaurantID,
        fssaiLicenceNumber,
        isVerified,
        bankDetails: {
            accountNumber,
            ifscCode,
            bankName,
        },
        address: {
            street,
            city,
            state,
            zipCode,
            country
        }
    });

    try {
        await restaurant.save();
        const token = jwt.sign(
            { restaurantId: restaurant._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ message: 'Restaurant profile created', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating restaurant profile' });
    }
};

