const router = require('express').Router();
router.use(require('express').urlencoded({extended:true}));
router.use(require('express').json())

const packageModel = require('../models/package.model')
const productModel = require('../models/product.model')
const paymentAccountModel = require('../models/paymentAccount.model')
const cartModel = require('../models/cart.model')
const invoiceModel = require('../models/invoice.model')
const invoiceDetailModel = require('../models/invoiceDetail.model')

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
//     We can also use this instead of from line 11 to line 17
//     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
//     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
//     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
//     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
//     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
//     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
//     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

router.use('/', async (req, res, next) => {
    if (!req.session.user){
        return res.redirect('/login')
    }
    else {
        next();
    }
})

async function fgetPrice(listcart){
    await listcart.forEach(async item => {
        let temp = await packageModel.getPrice(item.MaNYP)
        console.log(temp);
        item["GiaTien"] = temp[0].TongTien;
        item["TenGoi"] = temp[0].TenGoi;
    });
    return listcart;
}

router.get('/', async (req, res, next) => {
    let listCart = await cartModel.ofOne(req.session.name);
    let Total = await cartModel.getTotal(req.session.name);
    return res.render('cart/index', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        current: req.session.name,
        isLogin: req.session.user,
        listCart,
        title: "Giỏ Hàng",
        Total: Total[0].TongTien,
        notloginandsignup: 1,
    });
})

router.post('/add-to-cart', async (req, res, next) => {
    let a = await cartModel.ofOne(req.body.MaNLQ);
    let dup = false;
    a.forEach(item => {
        if (req.body.MaNYP == item.MaNYP){
            dup = true
        }
    })
    if(dup){
        return res.json({
            status: false
        })
    } else {
        let temp = await packageModel.getPrice(req.body.MaNYP)
        let c = await cartModel.addToCart(req.body.MaNLQ, req.body.MaNYP, temp[0].TongTien, temp[0].TenGoi);
        console.log("Body: ", req.body);
        return res.json({
            status: true
        })
    }
    
})

router.post('/delete', async (req, res, next) => {
    let a = await cartModel.delete(req.body.MaGH);
    res.json(req.body)
})

router.post('/plus', async (req, res, next) => {
    let p = await packageModel.getNYPfromGH(req.body.MaGH);
    let temp = await packageModel.getPrice(p[0].MaNYP);
    let limit = p[0].GioiHanGoiNguoi;
    if (req.body.SoLuong == limit){
        res.json(req.body)
    }
    else {
        let a = await cartModel.plus(req.body.MaGH, temp[0].TongTien);
        res.json(req.body)
    }
})

router.post('/minus', async (req, res, next) => {
    let p = await packageModel.getNYPfromGH(req.body.MaGH);
    let temp = await packageModel.getPrice(p[0].MaNYP);
    if (req.body.SoLuong == '1'){
        res.json(req.body)
    }
    else {
        let a = await cartModel.minus(req.body.MaGH, temp[0].TongTien);
        res.json(req.body)
    }
})

router.post('/checkout', async (req, res, next) => {
    // kiem tra so du tai khoan
    console.log(req.body);
    let pa = await paymentAccountModel.get("TKTT"+req.body.MaNLQ.slice(3,7))
    let soDu = pa.SoDu 
    if(parseInt(soDu) < parseInt(req.body.total)){
        return res.json({status: false})
    }
    // cong tien vao tai khoan admin
    let congTien = await paymentAccountModel.naptien(parseInt(req.body.total), "admin")

    // tru tien o tai khoan thanh toan
    let tinhTien = await paymentAccountModel.tinhTien( parseInt(soDu) - parseInt(req.body.total), "TKTT"+req.body.MaNLQ.slice(3,7))
    // luu xuong table don hang
    let maxListDH = await (await invoiceModel.all()).pop()['MaDH']
    let listNYP = await cartModel.getByMaNLQ(req.body.MaNLQ)
    
    listNYP.forEach(async item => {
        let data = {
            "MaDH": "DH"+(parseInt(maxListDH.slice(2, maxListDH.length))+1),
            "TongTien": item.TongTien, 
            "ThoiGian": new Date(Date.now()),
            "MaNLQ": req.body.MaNLQ,
            "MaNYP": item.MaNYP,
        }
        
        let donHang = await invoiceModel.add(data);
    })
    
    // luu xuong table chi tiet don hang
    listNYP.forEach(async item => {
        console.log("item: ", item);
        let madh = "DH"+(parseInt(maxListDH.slice(2, maxListDH.length))+1)

        let getAllSPinNYP = await packageModel.getSPfromNYP(item.MaNYP)
        console.log("getAllSPinNYP", getAllSPinNYP);
        getAllSPinNYP.forEach(async i => {
            let ctdh = await invoiceDetailModel.addNewRow(madh, i.MaSP, i.SoLuongBan)
        })
        
    })
    // xoa tat ca row trong gio hang    
    let clearCart = await cartModel.clearCart(req.body.MaNLQ)
    return res.json({status: true})
})
module.exports = router;