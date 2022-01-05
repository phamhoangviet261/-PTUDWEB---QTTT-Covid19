const router = require('express').Router();
const userM = require('../models/user.model');
const shajs = require('sha.js');
const passwordHashedLen = 64;
let userRemem = '';
let passRemem = '';

router.get('/signin', async (req, res) => {
    if (req.session.user) {
            res.redirect('../categories/category');
        return;
    }
    res.render('account/signin', {
        cssP: () => 'css',
        scriptsP: () => 'script',
        navP: () => 'nav',
        footerP: () => 'footer',
        user: userRemem,
        pass: passRemem,
        current: req.session.name,
        isLogin: req.session.user,
        signin: 1,
        abcd: "Hello Signin",
    });
});

router.post('/signin', async (req, res) => {
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
