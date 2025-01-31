const mongoose = require('mongoose');
const User = require('./User');

const CustomerSchema = new mongoose.Schema({
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
    },
});

module.exports = User.discriminator('Customer', CustomerSchema);
