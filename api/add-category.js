var express = require("express")
var router = express.Router()
var passCatModel = require("../modules/password_category")
var getPassCat = passCatModel.find({}, { "password_category": 1, "_id": 0 })

router.get("/getCategory", function (req, res) {

    getPassCat.exec(function (err, data) {
        if (err) throw err
        res.send(data)
    })
})

router.post("/add-category", function (req, res) {
    var passCategory = req.body.pass_cat
    var passCatDetail = new passCatModel({ password_category: passCategory })
    passCatDetail.save(function (err, data) {
        if(err) throw err
        res.send("Data insert successfull")
    })
})

module.exports = router

