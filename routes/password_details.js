var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

var passCatModel = require("../modules/password_category")
var passModel = require("../modules/add_password")
var getPassCat = passCatModel.find({})

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


//Delete
router.get('/delete/:id', checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser")
    var deletePassDetailId = req.params.id
    var deletePassCategory = passModel.findByIdAndDelete(deletePassDetailId)

    deletePassCategory.exec(function (err, data) {
        if (err) throw err
        res.redirect("/view-all-password")
    })
});

//Edit
router.get("/edit/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser")
    var id = req.params.id
    var getPassDetails = passModel.findById({ _id: id })

    getPassDetails.exec(function (err, data) {
        if (err) throw err
        getPassCat.exec(function (err, data1) {
            res.render('edit_password_details', {
                title: 'Password Management System', loginUser: loginUser, record: data, records: data1, id: id, success: ""
            });
        })
    })
});

//Post
router.post("/edit/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser")
    var id = req.params.id
    var passwordCategory = req.body.pass_cat
    var projectName = req.body.project_name
    var passwordDetail = req.body.pass_details
    var updatePassDetails = passModel.findByIdAndUpdate(id, {
        password_category: passwordCategory,
        project_name: projectName,
        password_detail: passwordDetail
    })

    updatePassDetails.exec(function (err, doc) {
        if (err) throw err
        var getPassDetails = passModel.findById({ _id: id })
        getPassDetails.exec(function (err, data) {
            if (err) throw err
            getPassCat.exec(function (err, data1) {
                res.render('edit_password_details', {
                    title: 'Password Management System', loginUser: loginUser, record: data,
                    records: data1, id: id, success: "Password Details Update Successfully"
                });
            })

        })
    })
})

module.exports = router;