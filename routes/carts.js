const express = require("express");

const Cart = require("../models/cart");
const User = require("../models/user");

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
  const cart = await Cart.find({ _id: id, isDeleted: true });
  if (!cart) return res.status(404).send("Cart is not found for this user.");

  res.status(200).send(cart);
});

//Post product to user's cart
router.post("/user/:id", validateCart, async (req, res) => {

  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");

  const user = await User.findById(id);
  if (!user) return res.status(400).send("User is not found");

  let productInCart = new Cart({
    ...req.body
  });

  const cart = await Cart.find({ userId: productInCart.userId});
  if (!cart) return res.status(400).send("User's cart is not found");

  cart.productsList.push(productInCart); //keda badef elid beta3 elcart di 3nd elref cart 3nd eluser

  await cart.save();

  res.status(200).send(productInCart);
});

//Patch user's cart
router.patch("/user/:id/product", validateCart, async (req, res) => {

  const {id } = req.params;
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");

  const user = await User.findById(id);
  if (!user) return res.status(400).send("User is not found");

  const cartOfUser = new Cart({
    ...req.body
  });

  const cart = await Cart.find({ userId: id});
  if (!cart) return res.status(400).send("User's cart is not found");


  cart = { ...cart, cartOfUser };

  await cartOfUser.save();

  res.status(200).send(user);
});

//Delete a product is user's cart
router.delete("/user/:id/product", async (req, res) => {

  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send("User id is not valid");

  const user = await User.findById(req.params.id);
    // const cart = await Cart.findById(req.params.id); ?????????
  if (!user) return res.status(400).send("User is not found");

  const cart = await Cart.find({ userId: id});
  if (!cart) return res.status(400).send("User's cart is not found");

  cart.productsList.isDeleted = true;

  await cart.save();

  res.status(200).send("Product is deleted successfully");
});

module.exports = router;
