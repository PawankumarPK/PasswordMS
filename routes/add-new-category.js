var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

var userModule = require("../modules/user")
var passCatModel = require("../modules/password_category")
var passModel = require("../modules/add_password")


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


function checkUsername(req, res, next) {
    var uname = req.body.uname;
    var checkexitemail = userModule.findOne({ username: uname });
    checkexitemail.exec((err, data) => {
        if (err) throw err;
        if (data) {

            return res.render('signup', { title: 'Password Management System', msg: 'Username Already Exit' });

        }
        next();
    });
}

function checkEmail(req, res, next) {
    var email = req.body.email
    var checkExitsEmail = userModule.findOne({ email: email })
    checkExitsEmail.exec((err, data) => {
        if (err) throw err
        if (data) {
            return res.render('signup', { title: 'Password Management System', msg: "Email Already Exist" });
        }
        next()

    })
}

/* Add new  Category. */
router.get('/', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: "", success: "" });
});

router.post('/', checkLoginUser, [check("passwordCategory", "Enter Password Category Name").isLength({ min: 1 })], function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser")
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        //console.log(errors.mapped());
        res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: errors.mapped(), success: "" });
    } else {
        var passCatName = req.body.passwordCategory
        var passCatDetails = new passCatModel({
            password_category: passCatName
        })
        passCatDetails.save(function (err, doc) {
            if (err) throw err
            res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: "", success: "Password Category Inserted Successfully" });
        })

    }
});




module.exports = router;