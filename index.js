const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require("./routes/users");
const app = express();

// const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongoose-demo';
const port = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost:27017/database', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Failed to connect to Mongodb,', err.message));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/users', usersRouter);

app.listen(port, () => console.log(`Server listens on port ${port}`));