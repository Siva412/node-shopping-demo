const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    prodData: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        paymentType: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: String,
            default: 'payment'
        },
        orderComments: {
            type: String,
            default: 'Payment Done'
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);