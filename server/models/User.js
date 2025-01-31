const mongoose = require('mongoose');

const options = { discriminatorKey: 'role', timestamps: true };

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, options);

module.exports = mongoose.model('User', UserSchema);
