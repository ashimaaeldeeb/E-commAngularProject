const express = require('express');

const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

const validateUser = require('../helpers/validateUser');
const validateProduct = require('../helpers/validateProduct');
const validateOrder = require('../helpers/validateOrder');
const validateObjectId = require('../helpers/validateObjectId');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        const orders = await Order.find({isCancelled: { $ne: true }});
        res.send(orders);
    })
    .post(async (req, res) => { //add product to order
        const { error } = validateOrder(req.body);
        if (error) {
            return res.status(400).send(error.details);
        }
        let order = new Order({
            ...req.body
        });
        //calculate price of order ????????????????????
        var totalPrice = 0;
        order.products.forEach(async productFromOrderList => {
            let productFromDB = await Product.findById(productFromOrderList.product);
            if(!productFromOrderList.isDeleted && !productFromDB.isDeleted){
                totalPrice += (productFromDB.price)*(productFromOrderList.quantity);
            }
        });
        order.price = totalPrice;
        order = await order.save();
        //add this order to the user's orders list
        const user = await User.findById(order.user);
        user.orders.push(order.id);
        await user.save();

        res.send(order);
    });

router.route('/:id')
    .get(async (req,res)=>{
        const { id } = req.params;
        const { error } = validateObjectId(id);
        if (error) {
            return res.status(400).send("Invalid ID");
        }
        const order = await Order.findById(id);
        if (!order || order.isCancelled) {
            return res.status(400).send('Order not found');
        }
        res.send(order);
    })
    .delete(async (req, res) => { //TODO: if status (accepted), then add quantity back again
        const { id } = req.params;
        const { error } = validateObjectId(id);
        if (error) {
            return res.status(400).send("Invalid ID");
        }
        // const order = await Order.findById(id);//.populate('products'); 
        // if (!order) {
        //     return res.status(400).send('Order not found');
        // }
        // const deletedOrder = await Order.findByIdAndDelete(id);
        // const deletedOrder = await Order.findById(id);
        // res.send(deletedOrder);
        const deletedOrder = await Order.findByIdAndUpdate(id, {
            isCancelled: true
        }, {
            new: true
        });
        // if(deletedOrder.status == "accepted"){
        //     let productQuantity = await Product.findById(deletedOrder.id);
        //     productQuantity = productQuantity.quantity;
        //     const product = await Product.findByIdAndUpdate(deletedOrder.id,{
        //         quantity: productQuantity+deletedOrder.pro
        //     })
        // }
        if (!deletedOrder) {
            return res.status(400).send('Order not found');
        }
        res.send(deletedOrder);
    })
    .patch(async (req, res) => { //TODO: recalculate price, if status(accepted) decrease quantity of product
        const { id } = req.params;
        const { error } = validateObjectId(id);
        if (error) {
            return res.status(400).send("Invalid ID");
        }
        // const oldOrder = await Order.findById(id);
        const newOrder = await Order.findByIdAndUpdate(id, { //NOTE: someone can update cancelled orders this way
            ...req.body
        }, {
            new: true
        });
        // if(oldOrder.status != "accepted" && newOrder.status == "accepted"){
        //     const newNewOrder = await Order.findByIdAndUpdate(id,{

        //     },{
        //     new: true
        // })
        // }
        if (!newOrder) {
            return res.status(400).send('Order not found');
        }
        res.send(newOrder);
    });

router.get('/:id/user', async (req,res)=>{
    const {id} = req.params;
    const {error} = validateObjectId(id);
    if(error){
        return res.status(400).send("Invalid ID");
    }
    const order = await Order.findById(id).populate('user');
    if(!order || order.isCancelled){
        return res.status(400).send('Order not found');
    }
    res.send(order.user);
});

module.exports = router;