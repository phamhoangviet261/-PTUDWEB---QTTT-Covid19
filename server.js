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
    secret: 'ahihi',
    resave: false,
    saveUninitialized: true
}))

app.use(express.urlencoded({extended:true}));
app.use(express.json())

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require('jsonwebtoken')
const verifyToken = require('./controllers/auth.controller')
const serverAuth = require('./server-auth')

const productModel = require('./models/product.model')

app.get('/', async (req, res) =>{ 
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

    let products = await productModel.topN(12);
    products.forEach(item => {
        item["key"] = item.MaSP.substr(3, 2) - 0
    })

    res.render('home', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        current: req.session.name,
        isLogin: req.session.user,
        notloginandsignup: 1,
        banner: banner,
        products: products,
    });
});

app.get('/login', (req, res) =>{
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


app.post('/signin', (req, res) => {
    req.session.user = req.body.user
    res.json({"user": req.session.user})
})

app.use('/product', require('./controllers/product.controller'))

app.use('/admin', require('./controllers/admin.controller'))

serverAuth.listen(3001, () => {
    console.log(`Auth Server is listening on port ${3001}`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`API Server is listening on port ${process.env.PORT || 3000}`);
});
