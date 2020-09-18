const mongoose = require('mongoose');

const ProdFilterSchema = new mongoose.Schema({
    prodType:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4,
    },
    filters: [
        {
            filterType: {
                type: String
            },
            filterValues: { 
                type: [String] 
            }
        }
    ]
});

module.exports = mongoose.model('ProdFilter', ProdFilterSchema);