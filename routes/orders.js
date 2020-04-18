const express = require('express');

const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');

const validateOrder = require('../helpers/ValidateOrder');
const validateObjectId = require('../helpers/ValidateObjectId');

const router = express.Router();

// get: orders/user/:id (user id)
// patch: orders/:id (state only)
// post: orders/  (checkout -> body: cart id, user id -> yfddi array elproducts eli flcart, status pending)
// delete: orders/:id (cancel order if pending)

//view user orders
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = validateObjectId(id);
    if (error) {
        return res.status(400).send("Invalid ID");
    }
    const orders = await Order.find({isCancelled: { $ne: true }, user: id});
    if (!orders) {
        return res.status(400).send('No orders found');
    }
    res.send(orders);
});

//update state only: accepted (decrease quantity from product) - rejected
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = validateObjectId(id);
    if (error) {
        return res.status(400).send("Invalid ID");
    }
    const newOrder = await Order.findByIdAndUpdate(id, {
        ...req.body
    }, {
        new: true
    });
    if(newOrder.status == "accepted"){
        newOrder.products.forEach(productObj => {
            const product = await Product.find({isDeleted: { $ne: true }, id: productObj.product})
            product.quantity -= productObj.quantity;
            await product.save();
        });
    }
    if (!newOrder) {
        return res.status(400).send('Order not found');
    }
    res.send(newOrder);
});

//checkout the cart: copy products and total price to the order, afddi elproducts array eli flcart
router.post('/', async (req, res) => { 
    const { error } = validateOrder(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    let order = new Order({
        ...req.body
    });
    
    const user = await User.findById(order.user);
    user.orders.push(order.id);
    await user.save();

    const cart = Cart.findById(user.cart);
    cart.products = [];
    cart.price = 0;
    await cart.save();

    res.send(order);
});

//cancel order if pending: 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = validateObjectId(id);
    if (error) {
        return res.status(400).send("Invalid ID");
    }
    oldOrder = await Order.findById(id);
    if (!oldOrder) {
        return res.status(400).send('Order not found');
    }
    if(oldOrder.status == "pending"){
        const deletedOrder = await Order.findByIdAndUpdate(id, {
            status: "cancelled"
        }, {
            new: true
        });
        res.send(deletedOrder);
    }
    else{
        return res.status(400).send('Cannot cancel order. Orders can be cancelled only if they are pending.');
    }
});

module.exports = router;