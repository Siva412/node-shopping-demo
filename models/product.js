const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    ratingCount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxQuantity: {
        type: Number,
        required: true
    },
    description: {
        type: [String],
        required: true
    },
    url: {
        type: Buffer
    }
});

module.exports = mongoose.model('Product', productSchema);