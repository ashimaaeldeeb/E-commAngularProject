const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date
    },
    price: {
        type: Number,
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number
        },
        isDeleted: {
            type: Boolean
        }
    }],
    status: {
        type: String,
        enum: ["inCart", "pending", "accepted", "rejected"],
        required: true
    },
    isCancelled: {
        type: Boolean
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;