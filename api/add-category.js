var express = require("express")
var router = express.Router()
var passCatModel = require("../modules/password_category")
var getPassCat = passCatModel.find({})

router.get("/", function (req, res) {

    getPassCat.exec(function (err, data) {
        res.send(data)
    })
})

module.exports = router

