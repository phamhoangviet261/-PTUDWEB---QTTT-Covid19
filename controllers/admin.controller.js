// MODEL
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

const router = require('express').Router();

router.get('/', async (req, res) => {
    // let makeColorPeople= (lu, min) => {
    //     // change key CMND/CCCD --> CCCD
    //     let newLu = lu.slice(min, min+10)

    //     newLu.forEach((item)=>item.NgaySinh = item.NgaySinh.toDateString().split(' ')[2]+'/'+(item.NgaySinh.getMonth()+1)+'/'+item.NgaySinh.toDateString().split(' ')[3])
        
    //     newLu.forEach((item)=>{
    //         return delete Object.assign(item, {['CCCD']: item['CMND/CCCD'] })['CMND/CCCD'];
    //     })
    //     return newLu;
        
    // }
    // let lu = await covidPeopleModel.all()
    
    // res.render('admin/account', {
    //     cssP: () => 'css',
    //     scriptsP: () => 'script',
    //     navP: () => 'nav',
    //     footerP: () => 'footer',
    //     isManageAccount: true,
    //     listUser: makeColorPeople(lu, 0)
    // });
    res.redirect('/admin/manage-account?page=0')
})

router.get('/manage-account', async (req, res) => {
    
    let makeColorPeople= (lu, min=0) => {
        // change key CMND/CCCD --> CCCD
        let newLu = lu.slice(min, min+10)
        console.log(newLu)
        newLu.forEach((item)=>item.NgaySinh = item.NgaySinh.toDateString().split(' ')[2]+'/'+(item.NgaySinh.getMonth()+1)+'/'+item.NgaySinh.toDateString().split(' ')[3])
        
        newLu.forEach((item)=>{
            return delete Object.assign(item, {['CCCD']: item['CMNDCCCD'] })['CMNDCCCD'];
        })
        return newLu;
        
    }
    let lu = await covidPeopleModel.all()
    let dspx = await wardModel.all();
    let dsqh = await districtModel.all();
    let dsttp = await cityModel.all()

    let manlqMax = 'NLQ'+  (lu.slice(-1)[0]['MaNLQ'].slice(3,7)-0+1)

    res.render('admin/account', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        isManageAccount: true,
        listUser: makeColorPeople(lu, parseInt(req.query.page)*10),
        pageNow: parseInt(req.query.page),
        maxPage: lu.length/10+1,
        dspx: dspx,
        dsqh: dsqh,
        dsttp: dsttp,
        manlqMAX: manlqMax,
    });
})

router.post('/manage-account/add', async (req, res) =>{
    let p = await covidPeopleModel.add(req.body)
    res.json(req.body)
})

router.get('/manage-account/account', async (req, res)=>{
    let makeColorPeople= (newLu) => {
        // change key CMND/CCCD --> CCCD
        newLu.forEach((item)=>item.NgaySinh = item.NgaySinh.toDateString().split(' ')[2]+'/'+(item.NgaySinh.getMonth()+1)+'/'+item.NgaySinh.toDateString().split(' ')[3])
        
        newLu.forEach((item)=>{
            return delete Object.assign(item, {['CCCD']: item['CMNDCCCD'] })['CMNDCCCD'];
        })
        return newLu;
        
    }
    if(req.query.manlq){    
        let u = await covidPeopleModel.get(req.query.manlq)
        u.NgaySinh = u.NgaySinh.toDateString().split(' ')[2]+'/'+(u.NgaySinh.getMonth()+1)+'/'+u.NgaySinh.toDateString().split(' ')[3]
        Object.assign(u, {['CCCD']: u['CMNDCCCD'] })['CMNDCCCD'];
        
        let f0 = []
        let f1 = await covidPeopleModel.findF1(req.query.manlq)
        let f2 = await covidPeopleModel.findF2(req.query.manlq)

        let px = await wardModel.get(u['MaPhuongXa'])
        let qh = await districtModel.get(px['MaQuanHuyen'])
        let ttp = await cityModel.get(qh['MaTinhTP'])

        u['TenPhuongXa'] = px['TenPhuongXa']
        u['TenQuanHuyen'] = qh['TenQuanHuyen']
        u['TenTinhTP'] = ttp['TenTinhTP']

        let dspx = await wardModel.all();
        let dsqh = await districtModel.all();
        let dsttp = await cityModel.all()
        console.log(u)
        res.render('admin/accountDetail', {
            cssP: () => 'css',
            scriptsP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
            isManageAccount: true,
            user: u,
            listF0: makeColorPeople(f0),
            listF1: makeColorPeople(f1),
            listF2: makeColorPeople(f2),
            dspx: dspx,
            dsqh: dsqh,
            dsttp: dsttp,
        });
    } else {
        res.json({})
    }
    
})

router.get('/manage-product', async (req, res) => {
    let lp = await productModel.all()
    lp.map(product => {
        let temp = product.MaSP.substring(product.MaSP.length - 3) - 0;
        product["key"] = temp;
    })
    res.render('admin/index', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        isManageProduct: true,
        products: lp,
        newProductID: lp[lp.length-1].MaSP.substring(0, lp[lp.length-1].MaSP.length - 3) + '0' + (lp.length + 1).toString()
    });
})

router.post('/manage-product/add', async (req, res) => {
    let product = req.body;
    console.log(product);
    let temp = await productModel.add(product);
    console.log(product);
    res.json(product);
})

router.get('/manage-neccessary', async (req, res) => {
    let ln = await packageModel.all()

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
    let n = await packageModel.get(req.params.id)
    
    let ln = await packageModel.all()
    let nd = await packageDetailModel.get(req.params.id)
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
    let x = await packageDetailModel.add(req.body)
    res.json(req.body)
})

router.post('/api/neccessaryDetail/update', async (req, res) => {
    // let x = await neccessaryuDetailModel.add(req.body)
    res.json(req.body)
})

router.post('/api/neccessary/add', async (req, res) => {
    let x = await packageModel.add(req.body)
    res.json(req.body)
})

router.post('/api/neccessary/update', async (req, res) => {
    // get list neccessary -> get 1 neccessary to edit
    let n = await packageModel.get(req.body['MaNYP'])
    
    let x = await packageModel.update(n['MaNYP'], req.body)
    res.json(req.body)
})

router.get('/api/product/getAll', async (req, res) => {
    let p = await productModel.all();
    return res.json(p)
})

module.exports = router;