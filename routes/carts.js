const express = require("express");

const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

// const validateUser = require("../helpers/validateUser");
const validateCart = require("../helpers/validateCart");
const validateObjectId = require("../helpers/validateObjectId");

const router = express.Router();

//Get User's Cart
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");
  //   const cart = await Cart.find(p => p.id === parseInt(req.params.id) && p => p.productsList.isDeleted !== true);
  const cart = await Cart.find({ userId: id });
  console.log("prod id", cart);

  const productsId = [];
  for(let i=0; i<cart[0].productsList.length; i++){
    productsId.push(cart[0].productsList[i].productId)
  }
  console.log("prod id", productsId);
  if (!cart) return res.status(404).send("Cart is not found for this user.");

  res.status(200).send(cart);
});

//Post product to user's cart
router.post("/user/:id", validateCart, async (req, res) => {
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User is not found");

  const userCart = await Cart.findById(user.cart); //elcart beta3t eluser dah
  if (!userCart) return res.status(400).send("User's cart is not found");

  userCart.productsList.push(...req.body.productsList);

  await userCart.save();

  res.status(200).send(userCart);
});

//Patch user's cart
router.put("/user/:id/product", validateCart, async (req, res) => {
  const { id } = req.params;
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");

  const user = await User.findById(id);
  if (!user) return res.status(400).send("User is not found");

  let cart = await Cart.find({ userId: id });
  if (!cart) return res.status(400).send("User's cart is not found");

  const updateCart = await Cart.findByIdAndUpdate(user.cart, req.body, {
    new: true
  });

  await updateCart.save();

  res.status(200).send(updateCart);
});

//Delete a product is user's cart
router.delete("/user/:id/product/:productId", async (req, res) => {
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");

  const { error2 } = validateObjectId(req.params.productId);
  if (error2) return res.status(400).send("Product id is not valid");

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User is not found");

  let cart = await Cart.find({ userId: req.params.id });
  if (!cart) return res.status(400).send("User's cart is not found");

  const product = await Product.find({ id: req.params.productId });
  if (!product) return res.status(400).send("Product ID is not found");

  const newCartItems = cart[0].productsList.filter(c=> c.productId != req.params.productId);
  cart[0].productsList = [];

  for(let i=0; i<newCartItems.length; i++){
    cart[0].productsList.push(newCartItems[i]);
  }
  console.log("temp", cart[0].productsList);

  const updateCart = await Cart.findByIdAndUpdate(user.cart, [...cart], {
    new: true
  });

  await updateCart.save();
  res.status(200).send(cart);

});

module.exports = router;
