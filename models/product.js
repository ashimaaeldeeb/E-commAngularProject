const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    isPromoted: {
        type: Boolean
    },
    promotion: {
        type: Number
    },
    details: {
        type: String
    },
    quantity: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;