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

const cors = require('cors')
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(require('./controllers/payment.controller'))

module.exports = app;