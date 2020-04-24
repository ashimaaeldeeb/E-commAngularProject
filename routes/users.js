const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Cart = require('../models/cart');
const validateUser = require('../helpers/ValidateUser');
const validateObjectId = require('../helpers/ValidateObjectID');
const validateEmail = require('../helpers/ValidateEmail');
const router = express.Router();

//get all users
router.get('/',async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

//get user
router.get('/:id', async (req, res) => {
    const {
        error
    } = validateObjectId(req.params.id);
    if (error) {
        return res.status(400).send(error.details);
    }
    const user = await User.findById(req.params.id);
    return res.send(user);
})

// post user
router.post('/',async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    let user = new User({
        ...req.body
    });
    let cart = new Cart({
        userId: user._id
    })
    await cart.save();
    user.cart = cart;
    user = await user.save();
    res.send(user);
});

//edit user
router.patch(':/id', async (req, res) => {
    const { id } = req.params;
    const { error } = validateObjectId(id);
    if (error) {
        return res.status(400).send("Invalid ID");
    }
    const newUser = await User.findByIdAndUpdate(id, {
        ...req.body
    }, {
        new: true
    });
    if (!newUser) {
        return res.status(400).send('User not found');
    }
    res.send(newUser);
});

//delete user method

router.delete('/:id', async (req, res) => {
    const {
        error
    } = validateObjectId(req.params.id);
    if (error)
        return res.status(400).send(error.details);
    const user = await User.findById(req.params.id);
    // console.log(user);

    if (!user)
        return res.status(404).send("User not found.");
    // await User.deleteOne({
    //     _id: user._id
    // });
    // res.status(204).json({
    //     user: user
    // }).send();
    const deletedUser = await User.findByIdAndDelete(id);
        res.send(deletedUser);
})



// //signup method 

// router.post('/signup', async (req, res) => {
//     const {
//         error
//     } = validateUser(req.body);
//     if (error) {
//         return res.status(400).send(error.details);
//     }

//     try {
//         const {
//             email,
//             userName,
//             password,
//             gender,
//             isAdmin
//         } = req.body;

//         const userExists = await User.findOne({
//             email
//         });

//         if (userExists)
//             return res.status(400).send("email already exist");
//         let user = new User({
//             userName,
//             email,
//             gender,
//             isAdmin,
//             password
//         });

//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);
//         await user.save();
//         console.log(user);
//         const payload = {
//             user: {
//                 id: user._id
//             }
//         };
//         jwt.sign(payload, "randomString", {
//             expiresIn: 10000
//         }, (err, token) => {
//             if (err)
//                 return res.status(500).send("token creation error");
//             return res.status(200).json({
//                 token,
//                 user
//             }).send()
//         })

//     } catch (error) {
//         return res.status(500).send("seving error");
//     }

// });


// //login methos

// router.post('/login', async (req, res) => {
//     const {
//         error
//     } = validateEmail(req.body.email)
//     if (error) {
//         return res.statusCode(400).send("invalid Email");
//     }
//     const {
//         email,
//         password
//     } = req.body;
//     try {
//         let user = await User.findOne({
//             email
//         });
//         if (!user)
//             return res.statusCode(404).send("email not found");

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch)
//             return res.statusCode(400).send("password is incorrect");
//         const payload = {
//             user: {
//                 id: user._id,
//             }
//         }
//         jwt.sign(payload, "secret", {
//             expiresIn: 10000
//         }, (error, token) => {
//             if (error)
//                 return res.statusCode(400).send("error in token creation");
//             return res.status(200).json({
//                 token,
//                 user
//             }).send()
//         })

//     } catch (error) {
//         return res.status(400).send("error");
//     }


// })



// //edit user's data
// router.patch('/:id', async (req, res) => {
//     const {
//         error
//     } = validateObjectId(req.params.id);
//     if (error)
//         return res.status(400).send(error.details);
//     let data = User.findById({
//         _id: req.params.id
//     })
//     const user = {
//         ...req.body
//     };
//     if (user.email) {
//         const {
//             emailError
//         } = validateEmail(user.email);
//         if (emailError)
//             return res.status(400).send("in valid email")
//         data.email = user.email;
//     }
//     if (user.userName)
//         data.userName = user.userName;
//     if (user.gender)
//         data.gender = user.gender;
//     if (user.password) {
//         const salt = await bcrypt.genSalt(10);
//         data.password = await bcrypt.hash(user.password, salt);
//     }
//     await User.updateOne({
//         _id: req.params.id
//     }, {
//         $set: {
//             userName: data.userName,
//             gender: data.gender,
//             email: data.email,
//             password: data.password,
//             image: data.image,
//             cart: data.cart,
//             orders: data.orders
//         }
//     }, async (err, resp) => {
//         if (err)
//             res.status(400).send(err.details);
//         else {
//             const user = await User.findById(req.params.id);
//             res.status(200).send(user);
//         }
//     })

// })

module.exports = router;