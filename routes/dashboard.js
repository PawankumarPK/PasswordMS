var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');

var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});


function checkLoginUser(req, res, next) {
    var userToken = localStorage.getItem("userToken")
    try {
        if (req.session.username) {
            var decode = jwt.verify(userToken, "loginToken")
        } else {
            res.redirect("/")
        }
    } catch {
        res.redirect("/")
    }
    next()

}

//web token
//store in local storage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

/* GET dashboard page. */
router.get('/', checkLoginUser, function (req, res, next) {
    var loginUser = req.session.username
    passModel.countDocuments({}).exec((err, count) => {
        passCatModel.countDocuments({}).exec((err, countasscat) => {
            res.render('dashboard', {
                title: 'Password Management System', loginUser: loginUser, msg: '',
                totalPassword: count, totalPassCat: countasscat
            });
        });

    })
})
module.exports = router;