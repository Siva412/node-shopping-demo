const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        maxlength: 80,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        maxlength: 10,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);