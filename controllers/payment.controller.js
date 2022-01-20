
const router = require('express').Router();

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
    res.render('payment/admin/index',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Trang Admin",
    })
})

module.exports = router;