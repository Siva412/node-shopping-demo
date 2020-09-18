const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB connection success");
}).catch(() => {
    console.log("DB connection fail");
})