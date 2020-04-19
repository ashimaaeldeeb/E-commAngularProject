const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validateUser = require('../helpers/ValidateUser');
const validateObjectId = require('../helpers/ValidateObjectID');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const {
        error
    } = validateObjectId(req.params.id);
    if (error) {
        return res.status(400).send(error.details);
    }
    const user = await User.find({
        user: req.params.id
    });
    req.send(user);
})


//login 
//user/edit patch 
//user/delete/:id
//user/:id/orders
//register

router.post('/', async (req, res) => {
    const {
        error
    } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    let user = new User({
        ...req.body
    });

})


module.exports = router;