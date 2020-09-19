var express = require("express")
var router = express.Router()
var passCatModel = require("../modules/password_category")
var getPassCat = passCatModel.find({},{"password_category":1,"_id":0})

router.get("/", function (req, res) {

    getPassCat.exec(function (err, data) {
        if (err) throw err
        res.send(data)
    })
})

module.exports = router

