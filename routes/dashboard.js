var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

var userModule = require("../modules/user")


function checkLoginUser(req, res, next) {
    var userToken = localStorage.getItem("userToken")
    try {
        var decode = jwt.verify(userToken, "loginToken")
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
    var loginUser = localStorage.getItem("loginUser")
    res.render('dashboard', { title: 'Password Management System', loginUser: loginUser, msg: " " });
});


module.exports = router;