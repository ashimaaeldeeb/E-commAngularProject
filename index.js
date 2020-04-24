const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const cartsRouter = require("./routes/carts");

const app = express();

// const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongoose-demo';
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/database', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Failed to connect to Mongodb,', err.message));
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

app.use(express.json());
app.use(cors());

app.options('*', cors());
// cors({credentials: true, origin: true})

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/carts', cartsRouter);

app.listen(port, () => console.log(`Server listens on port ${port}`));