const router = require('express').Router();
const productModel = require('../models/product.model')


router.get('/api/getAll', async (req, res) => {
    let p = await productModel.topN(12);
    return res.json(p)
})

module.exports = router;