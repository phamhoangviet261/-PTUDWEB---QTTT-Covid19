require('dotenv').config()
const express = require('express'),
app = express(),
exphbs = require('express-handlebars');
const hbs = exphbs.create({
    defaultLayout: 'home',
    extname: 'hbs',
    helpers: {
        ifStr(s1, s2, options) {
            if (s1 === s2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        isLogout(value, options) {
            if (value){
                return options.inverse(this);
            }
            return options.fn(this);
        },
        inc(value, options) {
            return parseInt(value)+1;
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('views/images'));

const session = require('express-session');
app.use(session({
    secret: 'v8bRRj7XVC6Dvp',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge:900000} //here ,15 min session time
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json())

const cors = require('cors')
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require('jsonwebtoken')
const verifyToken = require('./controllers/auth.controller')
const serverAuth = require('./server-auth')
const serverPayment = require('./server-payment')
const productModel = require('./models/product.model')

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
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huy???n s???c h???i ng?? n???ng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ??, ??, ??, ??, ??
    return str;
}


// route check token == null => need change password
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', async (req, res, next) =>{ 
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("Full url: ", fullUrl)
    if(req.originalUrl.includes('&token')){
        res.cookie('access-token', req.query.token, { expires: new Date(Date.now() + 900000), httpOnly: true })
        res.cookie('refresh-token', req.query.refreshToken, { expires: new Date(Date.now() + 900000), httpOnly: true })        
        res.redirect(req.originalUrl.split("?").shift());
        return;
    }
    if(!req.cookies['access-token']){
        return res.redirect('/login')
    } else {
        // check token is expired?
        console.log("Token cookie:  ", req.cookies['access-token'])
        req.headers['Authorization'] = req.cookies['access-token'];
        
        const token = req.cookies['access-token']

        try {
			const decoded = jwt.verify(token, "abc")

			const userId = decoded.username
            const userPw = decoded.password
			
            console.log("User ID: ", userId)
            console.log("User PW: ", userPw)
            req.session.name = userId;
            req.session.user = decoded;
            res.cookie('username', userId, { expires: new Date(Date.now() + 900000), httpOnly: true })
		} catch (error) {
			if(error.expiredAt){
                console.log("Expired: ", error.expiredAt)
                console.log("Send Refresh token to auth server to reset token.")
            }
            // token expired
            // clear cookie
            res.clearCookie("access-token");
			return res.redirect('/login')
		}
    }
    console.log(req.session.name, req.session.user)
    let banner = [
        "/home-banner-1.jpg",
        "/home-banner-2.jpeg",
        "/home-banner-3.jpg",
        "/home-banner-4.jpg"
    ]

    // San pham ua thich
    let products = await productModel.topN(12);
    products.forEach(item => {
        item["key"] = item.MaSP.substr(3, 2) - 0
        item['link'] = nonAccentVietnamese(item.TenSP).split(" ").join("-")+"-"+item["key"]
    })

    // San pham ban chay
    let productsHalfRun = await productModel.topN(12);
    productsHalfRun.forEach(item => {
        item["key"] = item.MaSP.substr(3, 2) - 0
        item['link'] = nonAccentVietnamese(item.TenSP).split(" ").join("-")+"-"+item["key"]
    })

    res.render('home', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        title: "Trang ch???",
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
        banner: banner,
        products: products,
        productsHalfRun: productsHalfRun,
    });    
});

app.get('/login', (req, res, next) =>{
    if(req.cookies['access-token']){
        return res.redirect('/')
    }
    res.render('account/login', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        current: req.session.name,
        isLogin: req.session.user,
        abcd: "Hello",
    });
});

app.get('/change-password', (req, res, next) => {
    console.log(req.body);
    
    return res.render('account/changePassword', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        username: req.query.username,
    });
})

app.post('/change-password', (req, res, next) => {
    return res.json(req.body)
})

app.post('/signin', (req, res) => {
    req.session.user = req.body.user
    res.json({"user": req.session.user})
})

app.get('/signout', (req, res) => {
    req.session.destroy();
    res.clearCookie("refresh-token") 
    res.clearCookie("access-token") 
    res.clearCookie("username") 
    res.redirect('/login')
})


app.use('/product', require('./controllers/product.controller'))
app.use('/package', require('./controllers/package.controller'))
app.use('/cart', require('./controllers/cart.controller'))
app.use('/admin', require('./controllers/admin.controller'))
app.use('/user', require('./controllers/user.controller'))

serverAuth.listen(3001, () => {
    console.log(`Auth Server is listening on port ${3001}`);
});

serverPayment.listen(3002, () => {
    console.log(`Payment Server is listening on port ${3002}`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`API Server is listening on port ${process.env.PORT || 3000}`);
});
