const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Import the Admin schema
require('dotenv').config();

async function seedAdmin() {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('Database connected successfully'))
            .catch((err) => console.error('Database connection error:', err));

        // Check if an admin user already exists
        const existingAdmin = await Admin.findOne({ email: 'restaurantproad@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            return;
        }

        // Create a new admin user
        // Password saved in .env file for security
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const admin = new Admin({
            firstName: 'Restaurant Pro',
            lastName: 'System Admin',
            email: 'restaurantproad@gmail.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedAdmin();
