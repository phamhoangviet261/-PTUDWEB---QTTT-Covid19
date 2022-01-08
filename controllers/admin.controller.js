// MODEL
const activityHistoryModel = require('../models/activityHistory.model')
const cityModel = require('../models/city.model')
const covidPeopleModel = require('../models/covidPeople.model')
const districtModel = require('../models/district.model')
const invoiceModel = require('../models/invoice.model')
const invoiceDetailModel = require('../models/invoiceDetail.model')
const managementHistoryModel = require('../models/managementHistory.model')
const managerModel = require('../models/manager.model')
const neccessaryModel = require('../models/neccessary.model')
const neccessaryuDetailModel = require('../models/neccessaryDetail.model')
const paymentAccountModel = require('../models/paymentAccount.model')
const productModel = require('../models/product.model')
const statusHistoryModel = require('../models/statusHistory.model')
const treatmentPlaceModel = require('../models/treatmentPlace.model')
const treatmentPlaceHistoryModel = require('../models/treatmentPlaceHistory.model')
const wardModel = require('../models/ward.model')

const router = require('express').Router();

router.get('/', async (req, res) => {
    res.render('admin/index', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        isManageAccount: true,
    });
})

router.get('/manage-product', async (req, res) => {
    res.render('admin/index', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        isManageProduct: true,
    });
})

router.get('/manage-neccessary', async (req, res) => {
    let ln = await neccessaryModel.all()

    // let nd = await neccessaryuDetailModel.all()

    // let listProduct = await productModel.all()
    // res.render('admin/index', {
    //     cssP: () => 'css',
    //     scriptsP: () => 'script',
    //     navP: () => 'nav',
    //     footerP: () => 'footer',
    //     isManageNeccessary: true,

    //     listNeccessary: ln,


    // });
    res.redirect('/admin/manage-neccessary/'+ln[0]['MaNYP'])
})

router.get('/manage-neccessary/:id', async (req, res) => {
    let n = await neccessaryModel.get(req.params.id)
    
    let ln = await neccessaryModel.all()
    let nd = await neccessaryuDetailModel.get(req.params.id)
    let listProduct = await productModel.all()
    let id_next = ln.length
    let xx = "NYP" + ((parseInt(id_next+1) <= 9 ? ("00" + (parseInt(id_next)+1)) : ("0" + (parseInt(id_next)+1))))
    
    res.render('admin/index', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        isManageNeccessary: true,
        neccessary: n,
        listNeccessary: ln,
        neccessaryDetail: nd,
        listProduct: listProduct,
        next_gnyp: xx,
    });
})

router.post('/api/neccessaryDetail/add', async (req, res) => {
    let x = await neccessaryuDetailModel.add(req.body)
    res.json(req.body)
})

router.post('/api/neccessaryDetail/update', async (req, res) => {
    // let x = await neccessaryuDetailModel.add(req.body)
    res.json(req.body)
})

router.post('/api/neccessary/add', async (req, res) => {
    let x = await neccessaryModel.add(req.body)
    res.json(req.body)
})

router.post('/api/neccessary/update', async (req, res) => {
    // get list neccessary -> get 1 neccessary to edit
    let n = await neccessaryModel.get(req.body['MaNYP'])
    
    let x = await neccessaryModel.update(n['MaNYP'], req.body)
    res.json(req.body)
})

router.get('/api/product/getAll', async (req, res) => {
    let p = await productModel.all();
    return res.json(p)
})

module.exports = router;