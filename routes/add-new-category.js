var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

const {colorCode}  = require("../modules/middlewareID/userID")
var passCatModel = require("../modules/password_category");
//var {colorCode}  = require('../modules/middlewareID/userID');

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

/* Add new  Category. */
router.get('/', checkLoginUser, function (req, res, next) {
    var loginUser = req.session.username
    res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: "", success: "" });
});

router.post('/', checkLoginUser, [check("passwordCategory", "Enter Password Category Name").isLength({ min: 1 })], function (req, res, next) {
    var loginUser = req.session.username
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        //console.log(errors.mapped());
        res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: errors.mapped(), success: "" });
    } else {
        var passCatName = req.body.passwordCategory
        var uId = colorCode.uId
        
        var passCatDetails = new passCatModel({
            password_category: passCatName,
            user_id: uId
        })
        passCatDetails.save(function (err, doc) {
            if (err) throw err
            console.log("=====ID",uId);
            res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: "", success: "Password Category Inserted Successfully" });
            
        })

    }
});

module.exports = router;