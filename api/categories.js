var express = require('express')
var router = express.Router()

var passCatModel = require("../modules/password_category")


router.get('/allCategories', function (req, res, next) {

    var id = req.body.id
    var getPassCat = passCatModel.find({ user_id: id })
    getPassCat.exec().then(data => {
        res.status(200).json({
            message: "Successfull",
            result: data
        })
        //res.render('password-category', { title: 'Password Management System', loginUser: loginUser, records: data });
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router
