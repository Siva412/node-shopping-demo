const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = require('../models/user');

const router = new express.Router();

router.post('', async (req, res) => {
    try {
        const hashPwd = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName || '',
            email: req.body.email,
            mobile: req.body.mobile,
            password: hashPwd
        })
        await user.save();
        res.status(200).send({
            errorcode: 0,
            message: 'Successfully registered'
        })
    }
    catch (e) {
        if(e && e.keyPattern && e.keyPattern.email){
            return res.status(200).send({
                errorcode: 2,
                message: 'Email already registered'
            }) 
        }
        res.status(400).json({
            errorcode: 1,
            message: "Something went wrong"
        })
    }
})

router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(200).send({
            errorcode: 2,
            message: "Please provide username and password"
        });
        return;
    }
    try {
        const user = await User.findOne({ email: req.body.username.toLowerCase() });
        if (!user) {
            res.status(200).send({
                errorcode: 2,
                message: "Mail is not registered"
            });
            return;
        }
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            res.status(200).send({
                errorcode: 3,
                message: "Invalid password"
            });
            return;
        }
        const userToken = await jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET);
        res.status(200).send({
            errorcode: 0,
            token: userToken,
            message: "Successfully logged in",
            name: user.firstName
        })
    }
    catch(e){
        res.status(400).send({
            errorcode: 1,
            message: "Sorry something went wrong"
        })
    }
})

router.post('/purchase', auth, (req, res) => {
    console.log(req.body);
})

module.exports = router;