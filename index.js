const express = require('express');
//const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('./db/mongoose');

const prodFilter = require('./models/prodFilter');

const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const prodFilterRouter = require('./routes/prodFilter');

const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));

//app.use(cors());
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