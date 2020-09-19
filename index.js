const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('./db/mongoose');

const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const prodFilterRouter = require('./routes/prodFilter');

const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/prodfilter', prodFilterRouter);
app.use('*', (req, res) => {
    res.sendFile(`${publicPath}/index.html`);
})


const port = process.env.PORT;

app.listen(port, () => {
    console.log("Listening on port: " + port);
})