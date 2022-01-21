const router = require('express').Router();
const shajs = require('sha.js')
// MODEL
const accountModel = require('../models/account.model')
const activityHistoryModel = require('../models/activityHistory.model')
const cityModel = require('../models/city.model')
const covidPeopleModel = require('../models/covidPeople.model')
const districtModel = require('../models/district.model')
const invoiceModel = require('../models/invoice.model')
const invoiceDetailModel = require('../models/invoiceDetail.model')
const managementHistoryModel = require('../models/managementHistory.model')
const managerModel = require('../models/manager.model')
const packageModel = require('../models/package.model')
const packageDetailModel = require('../models/packageDetail.model')
const paymentAccountModel = require('../models/paymentAccount.model')
const productModel = require('../models/product.model')
const statusHistoryModel = require('../models/statusHistory.model')
const treatmentPlaceModel = require('../models/treatmentPlace.model')
const treatmentPlaceHistoryModel = require('../models/treatmentPlaceHistory.model')
const wardModel = require('../models/ward.model')

router.use(async function (req, res, next) {
    let adm = await accountModel.getAdmin();
    
    if(adm[0].count == 0){
        // tao tai khoan admin
        return res.render('admin/register', {
            cssP: () => 'css',
            scriptsP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',   
            mess: "",     
        });
    } else {
        if(req.body.username && req.body.password){
            const pwdHasedLen = 64
            let adm = await accountModel.getAccountAdmin();
            
            const salt = req.body.password.substring(pwdHasedLen)
            const passwordHased = shajs('sha256').update(req.body.password + salt).digest('hex') + salt
            console.log("p1: ", passwordHased);
            console.log("p2: ", adm[0].password);
            if(req.body.username == adm[0].username && passwordHased == adm[0].password){
                console.log("ADMIN is logging in...")
                res.cookie('admin-access-token', req.body.username, { expires: new Date(Date.now() + 900000), httpOnly: true })
                next()
            } else {
                res.render('admin/login', {
                    cssP: () => 'css',
                    scriptsP: () => 'script',
                    navP: () => 'nav',
                    footerP: () => 'footer',   
                    mess: "Từ chối đăng nhập",     
                });
            }
        } else {
            if(!req.cookies['admin-access-token']){
                res.render('admin/login', {
                    cssP: () => 'css',
                    scriptsP: () => 'script',
                    navP: () => 'nav',
                    footerP: () => 'footer',        
                });
            } else {
                next()
            }
        }  
    }
      
})

router.post('/admin/login', (req, res, next) => {
    res.redirect('/admin')
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

router.post('/admin/changelimit', async (req, res, next) => {
    console.log(req.body);
    let nap = await paymentAccountModel.changelimit(req.body.money, req.body.MaTKTT);
    return res.json({status: true})
})

module.exports = router;