const express = require('express');
const prodFilter = require('../models/prodFilter');

const router = new express.Router();

router.post('', async (req, res) => {
    try {
        const newProdFilter = new prodFilter(req.body);
        await newProdFilter.save();
        res.status(200).send({
            errorcode: 0,
            message: "Added successfully"
        })
    }
    catch (e) {
        console.log(e);
        res.status(200).send({
            errorcode: 1,
            message: 'Sorry something went wrong'
        });
    }
});

router.get('/:prodType', async (req, res) => {
    if (!req.params.prodType) {
        return res.status(400).send({
            errorcode: 2,
            message: "Please provide product type"
        })
    }
    try {
        const reqFilter = await prodFilter.findOne({ prodType: req.params.prodType });
        if (!reqFilter) {
            res.status(200).send({
                errorcode: 3,
                message: "No message found"
            })
        }
        const filterList = reqFilter.filters.map(item => {
            return {
                filterType: item.filterType,
                filterValues: item.filterValues
            }
        });
        reqFilter.filters = filterList;
        res.status(200).send({
            filterData: {
                rating: reqFilter.rating,
                filters: filterList
            },
            errorcode: 0,
            message: "Success"
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({
            errorcode: 2,
            message: "Sorry something wrong"
        })
    }
})

module.exports = router;