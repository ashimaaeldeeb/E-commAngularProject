const express = require('express');
const Product = require('../models/product');
const validateProduct= require('../helpers/validateProduct');
const validateObjectId = require('../helpers/validateObjectId');

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find({isDeleted:{$ne: true}});
    if (!products) return res.status(404).send('Product not found');
    res.send(products);
});

router.get('/search', async (req, res) => {
    console.log("hi2");
    console.log(req.query);
    console.log(req.query.brand);
    //const products = await Product.find({"title":{ $regex:req.query.title}},{"isDeleted": false});
    const products = await Product.find({"details.brand":req.query.brand},{"isDeleted": false});
    console.log(req.originalUrl);
    //console.log(products)
    if (!products) return res.status(404).send('Product not found');
    res.send(products);
});

router.get('/promoted', async (req, res) => {
    const products = await Product.find({ isPromoted:true}, {isDeleted:false} );
    if (!products) return res.status(404).send('Product not found');
    res.send(products);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = validateObjectId(id);
    if (error) return res.status(400).send('Invalid Product');
    //find->filter is delelted and by id 
    const product = await Product.find({$and :[{'_id':id}, {isDeleted:{$ne: true}}]});
    if (!product) return res.status(404).send('Product not found');
    
    res.send(product);
});

router.delete('/:id', async (req, res) => {
    //make delete true not deleted
    const { id } = req.params;
    const { error } = validateObjectId(id);
    if (error) return res.status(400).send('Invalid Product');
    const product = await Product.findByIdAndUpdate(id,{ $set: { isDeleted: true}});
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = validateObjectId(req.body.id);
    if (error) return res.status(400).send(error.details);
    //const myproduct = await Product.find({$and :[{'_id':id}, {isDeleted:{$ne: true}}]});
    //console.log(myproduct)
    let product = req.body;
    // if(!req.body.details.brand)
    // product.details.brand=myproduct.details.brand;

    // if(req.body.details.processor=="undefined")
    // product.details.processor=myproduct.details.processor;

    // if(req.body.details.ram=="undefined")
    // product.details.ram=myproduct.details.ram;

    // if(req.body.details.hardDisk=="undefined")
    // product.details.hardDisk=myproduct.details.hardDisk;

    // if(req.body.details.graphicsCard=="undefined")
    // product.details.graphicsCard=myproduct.details.graphicsCard;

    // if(req.body.details.color=="undefined")
    // product.details.color=myproduct.details.color;
    
    product = await Product.findByIdAndUpdate(req.params.id, product,{new:true});
    res.send(product);
});

router.post('/', async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details);
    let product = new Product({ ...req.body });
    product.isDeleted=false;
    if(product.ratioOfPromotion)
        product.isPromoted=true;
    product = await product.save();
    res.send(product);
});

//1)->search by title query string



module.exports = router;