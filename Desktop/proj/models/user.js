const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
        // unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        //string
        data: Buffer,
        contentType: String
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    isAdmin: {
        type: Boolean
    }
    //ref order
});
const User = mongoose.model('User', userSchema);
module.exports = User;