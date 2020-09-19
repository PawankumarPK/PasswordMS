var express = require("express")
var router = express.Router()
var passCatModel = require("../modules/password_category")
var getPassCat = passCatModel.find({}, { "password_category": 1 })

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
        if (err) throw err
        res.send("Data insert successfull")
    })
})

router.put("/add-updated-category/:id", function (req, res) {
    var id = req.params.id
    var passCategory = req.body.pass_cat

    passCatModel.findById(id, function (err, data) {
        data.password_category = passCategory ? passCategory : data.password_category

        data.save(function (err) {
            if (err) throw err
            res.send("Update Data Successfully Using PUT Method")
        })
    })

})

router.patch("/update-category/:id", function (req, res) {
    var id = req.params.id
    var passCategory = req.body.pass_cat

    passCatModel.findById(id, function (err, data) {
        data.password_category = passCategory ? passCategory : data.password_category

        data.save(function (err) {
            if (err) throw err
            res.send("Update data successfully using PATCH method")
        })
    })

})

router.delete("/delete-category/",function(req,res){
    var cat_id = req.body.cat_id
    passCatModel.findByIdAndRemove(cat_id,function(err,data){
        if(err) throw err
        res.send("Delete Item Successfully")
    })
})

module.exports = router

