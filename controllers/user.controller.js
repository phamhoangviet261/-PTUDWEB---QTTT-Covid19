const router = require('express').Router();
const userM = require('../models/user.model');
const paymentAccountModel = require('../models/paymentAccount.model')
const donNapTienModel = require('../models/donNapTien.model')
const shajs = require('sha.js');
const passwordHashedLen = 64;
let userRemem = '';
let passRemem = '';

router.use('/', async (req, res, next) => {
    if (!req.session.user){
        return res.redirect('/login')
    }
    else {
        next();
    }
})

router.get('/info/:id',async (req, res, next) => {
    let userInfo = await userM.getUserInfo(req.params.id);
    userInfo.forEach((item) => {
        // let i = item.ThoiGian
        // item.ThoiGian = i.toString().substring(0,i.toString().indexOf(' GMT'))
        item.NgaySinh = item.NgaySinh.toDateString().split(' ')[2]+'/'+(item.NgaySinh.getMonth()+1)+'/'+item.NgaySinh.toDateString().split(' ')[3]
    })
    console.log(userInfo)
    res.render('user/information',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Thông tin",
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
        userInfo,
    })
})

router.get('/my-order', async (req, res, next) => {
    // let listOrder = await userM.getListOrder(req.session.user.username)
    let listOrder = await userM.getListOrder(req.session.username)
    listOrder.forEach((item) => {
        
        item.ThoiGian = item.ThoiGian.toTimeString().split(' ')[0] + ' - '+ item.ThoiGian.toDateString().split(' ')[2]+'/'+(item.ThoiGian.getMonth()+1)+'/'+item.ThoiGian.toDateString().split(' ')[3]
    })
    res.render('user/myOrder',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Đơn hàng của tôi",
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
        listOrder,
    })
})

router.get('/my-order/:id', async (req, res, next) => {
    let listDetailOrder = await userM.getListDetailOrder(req.params.id)
    let listOrder = await userM.getListOrder('NLQ0001')
    listOrder.forEach((item) => {
        item.ThoiGian = item.ThoiGian.toTimeString().split(' ')[0] + ' - '+ item.ThoiGian.toDateString().split(' ')[2]+'/'+(item.ThoiGian.getMonth()+1)+'/'+item.ThoiGian.toDateString().split(' ')[3]
    })
    res.render('user/myOrder',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Thông tin",
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
        listOrder,
        listDetailOrder,
    })
})

router.get('/history-management/:id', async (req, res, next) => {
    let listHistoryManagement = await userM.getHistoryManagement(req.params.id)
    let listHistoryStatus = await userM.getHistoryStatus(req.params.id)
    let listHistoryHospital = await userM.getHistoryHospital(req.params.id)
    listHistoryManagement.forEach((item) => {
        item.NgayTao = item.NgayTao.toTimeString().split(' ')[0] + ' - '+ item.NgayTao.toDateString().split(' ')[2]+'/'+(item.NgayTao.getMonth()+1)+'/'+item.NgayTao.toDateString().split(' ')[3]
    })
    listHistoryStatus.forEach((item) => {
        item.NgayTao = item.NgayTao.toTimeString().split(' ')[0] + ' - '+ item.NgayTao.toDateString().split(' ')[2]+'/'+(item.NgayTao.getMonth()+1)+'/'+item.NgayTao.toDateString().split(' ')[3]
    })
    listHistoryHospital.forEach((item) => {
        item.NgayTao = item.NgayTao.toTimeString().split(' ')[0] + ' - '+ item.NgayTao.toDateString().split(' ')[2]+'/'+(item.NgayTao.getMonth()+1)+'/'+item.NgayTao.toDateString().split(' ')[3]
    })
    res.render('user/historyManagement',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Lịch sử quản lý",
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
        listHistoryManagement,
        listHistoryStatus,
        listHistoryHospital,
    })
})


router.get('/change-password', async (req, res, next) => {
    res.render('user/changePassword',{
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Lịch sử quản lý",
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
    })
});

router.post('/signin', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (req.body.remember){
        userRemem = username;
        passRemem = password;
    }
    
    //const salt = Date.now().toString(16);
    const user = await userM.get(username);
    if (!user) {
        res.redirect('./signin');
        return;
    }
    const salt = user.f_Password.substring(passwordHashedLen);
    const passwordHashed = shajs('sha256').update(password + salt).digest('hex');
    if (passwordHashed + salt === user.f_Password) {
        console.log('Login Successfully!');
        req.session.user = user;
        req.session.name = user.f_Name;
        res.render('account/signin', {
            cssP: () => 'css',
            scriptsP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
            msg: "Login Successfully!",
            color: "success",
            user: userRemem,
            pass: passRemem,
            current: req.session.name,
            isLogin: req.session.user,
            abcd: "Hello Signin",
        });
        return;
    }
    else {
        res.render('account/signin', {
            cssP: () => 'css',
            scriptsP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
            msg: "Login Fail!",
            color: "danger",
            current: req.session.name,
            isLogin: req.session.user,
            abcd: "Hello Signin",
        });
        console.log('Dang Nhap Sai');
        return;
    }
});

router.get('/payment', async (req, res, next) => {
    if(req.cookies['username']){
        console.log("user", req.cookies['username'].slice(3,7));
        let xx = await paymentAccountModel.get("TKTT"+req.cookies['username'].slice(3, 7))
        console.log("xx", xx.SoDu);
        let his = await donNapTienModel.getByMaTKTT("TKTT"+req.cookies['username'].slice(3, 7))
        console.log("his", his);
        his.forEach((item)=>item.ThoiGian = item.ThoiGian.toDateString().split(' ')[2]+'/'+(item.ThoiGian.getMonth()+1)+'/'+item.ThoiGian.toDateString().split(' ')[3])
        return res.render('user/payment',{
            cssP: () => 'css',
            scriptsP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
            title: "Tài khoản của tôi",
            current: req.session.name,
            isLogin: req.session.user,
            notloginandsignup: 1,
            soDu: xx.SoDu,
            lichSu: his,
        })
    }
    return res.redirect('/')
})

module.exports = router;
