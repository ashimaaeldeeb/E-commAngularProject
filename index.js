const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

const app = express();

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce-laptops';
// const mongoURL = "mongodb+srv://Basma:Basma@1234@cluster0-c2omc.mongodb.net/test?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB"))
.catch((err) => console.log("Failed to connect to DB ", err.message));

app.use(express.json());
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.listen(port, () => console.log(`Express listener on port ${port}`));