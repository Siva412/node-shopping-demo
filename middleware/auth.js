const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorisation').replace('Bearer ', '');
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;
        req.email = decoded.email;
        next();
    }
    catch(e){
        console.log(e);
        res.status(200).send({
            errorcode: 3,
            message: "Not Autorized"
        })
    }
};

module.exports = auth;