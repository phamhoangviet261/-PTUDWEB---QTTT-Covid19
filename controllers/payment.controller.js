const router = require('express').Router();

const paymentAccountModel = require('../models/paymentAccount.model')

router.use(function (req, res, next) {
    next();
})

// Phan he nguoi dung
router.get('/', async (req, res, next) => {
    res.render('payment/user/index',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Trang Thanh Toán",
    })
})



// Phan he admin
router.get('/admin', async (req, res, next) => {
    let la = await paymentAccountModel.all()
    res.render('payment/admin/index',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Trang Admin",
        listAccount: la
    })
})

router.post('/admin/naptien', async (req, res, next) => {
    console.log(req.body);
    let nap = await paymentAccountModel.naptien(req.body.money, req.body.MaTKTT);
    return res.json({status: true})
})

module.exports = router;