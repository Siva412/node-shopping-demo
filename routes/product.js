const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../middleware/auth');
const ProductModel = require('../models/product');
const OrderModel = require('../models/order');
const prodFunc = require('../middleware/prodFunc');
const router = new express.Router();

const productImage = multer({
    limits: 5000000 //5MB
});

router.post('', productImage.single('prodImg'), async (req, res) => {
    try {
        let buffer = undefined;
        let prodData = {};
        if (!req.file || !req.body.prodData) {
            return res.status(400).send("Product imgage is mandatory");
        }
        buffer = await sharp(req.file.buffer).png().toBuffer();
        prodData = JSON.parse(req.body.prodData);
        const prod = new ProductModel({
            name: prodData.name,
            rating: prodData.rating,
            ratingCount: prodData.ratingCount,
            price: prodData.price,
            maxQuantity: prodData.maxQuantity,
            description: prodData.description,
            url: buffer
        })
        await prod.save();
        res.status(200).send("Success")
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Fail")
    }
});

// router.get('', async (req, res) => {
//     try {
//         const products = await ProductModel.find();
//         const filteredProds = products.map(item => {
//             return {
//                 name: item.name,
//                 rating: item.rating,
//                 ratingCount: item.ratingCount,
//                 price: item.price,
//                 maxQuantity: item.maxQuantity,
//                 description: item.description,
//                 id: item._id
//             }
//         })
//         res.status(200).send({ list: filteredProds, errorcode: 0, message: "Success" });
//     }
//     catch (e) {
//         res.status(400).send("Error");
//     }
// })

router.post('/search', async (req, res) => {
    try {
        const filterData = req.body;
        if (!filterData) {
            const filterResult = await ProductModel.find();
            res.status(200).send({
                list: prodFunc(filterResult),
                errorcode: 0,
                message: "Success"
            });
            return;
        }
        if(filterData.searchText){
            const searchReg = new RegExp(filterData.searchText, 'i');
            const filterResult = await ProductModel.find({$or: [{name: {$in: searchReg}}, {description: {$in: searchReg}}]});
            res.status(200).send({
                list: prodFunc(filterResult),
                errorcode: 0,
                message: "Success"
            });
            return;
        }
        const brandArr = filterData.brand ? filterData.brand.map(a => (new RegExp(a, 'i'))) : [/(.*?)/];
        const processorArr = filterData.processor ? filterData.processor.map(a => (new RegExp(a, 'i'))) : [];
        const ramArr = filterData.ram ? filterData.ram.map(a => (new RegExp(a, 'i'))) : [];
        const descArr = [...processorArr, ...ramArr].length > 0 ? [...processorArr, ...ramArr] : [/(.*?)/];
        let filterObj = {
            name: { $in: brandArr },
            description: { $in: descArr },
            rating: { $gt: filterData.rating || 0 }
        }
        if (filterData.amountLimit && Object.keys(filterData.amountLimit).length > 0) {
            let priceFilter = {};
            filterData.amountLimit.min ? (priceFilter.$gt = +filterData.amountLimit.min) : null;
            filterData.amountLimit.max ? (priceFilter.$lt = +filterData.amountLimit.max) : null;
            filterObj.price = priceFilter;
        }
        const filterResult = await ProductModel.find(filterObj);
        res.status(200).send({
            list: prodFunc(filterResult),
            errorcode: 0,
            message: "Success"
        })
    }
    catch (e) {
        console.log(e);
        res.status(400).send({
            errorcode: 2,
            message: "Sorry something went wrong"
        });
    }
})

router.get('/img/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductModel.findById(id);
        if (!product || !product.url) {
            return res.status(400).send("Wrong id");
        }
        res.set("Content-Type", "image/png");
        res.send(product.url);
    }
    catch (e) {
        res.status(400).send("Something went wrong");
    }
})

router.post('/purchase', auth, async (req, res) => {
    try {
        const orderData = req.body;
        const orderDocList = orderData.orderList && orderData.orderList.map(item => {
            return {
                userId: req.id,
                prodData: {
                    id: item.id,
                    quantity: item.quantity,
                    address: item.address,
                    paymentType: item.paymentType,
                    name: item.name,
                    price: item.price
                }
            };
        })
        await OrderModel.create(orderDocList);
        res.status(200).send({
            errorcode: 0,
            message: "Success"
        })
    }
    catch (e) {
        console.log(e);
        res.status(400).send({
            errorcode: 2,
            message: "Sorry something went wrong"
        })
    }
})

router.get('/purchaseHistory', auth, async (req, res) => {
    try {
        const userId = req.id;
        const historyList = await OrderModel.find({ userId: userId }, null, {sort: {createdAt: -1}});
        const filteredList = historyList.map(item => {
            return {
                address: item.prodData.address,
                id: item.prodData.id,
                orderComments: item.prodData.orderComments,
                orderStatus: item.prodData.orderStatus,
                paymentType: item.prodData.paymentType,
                quantity: item.prodData.quantity,
                name: item.prodData.name,
                price: item.prodData.price
            }
        })
        res.status(200).send({
            historyList: filteredList,
            errorcode: 0,
            message: "Success"
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({
            errorcode: 2,
            message: "Sorry something went wrong"
        })
    }
})

module.exports = router;