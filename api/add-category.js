var express = require("express")
var router = express.Router()
var passCatModel = require("../modules/password_category")
var getPassCat = passCatModel.find({}, { "password_category": 1 })

router.get("/getCategory", function (req, res) {

    /*
    getPassCat.exec(function (err, data) {
        if (err) throw err
        res.status(200).json({
            message: "success",
            result: data
        })

        */

    getPassCat.exec().then(data => {
        res.status(200).json({
            message: "success",
            result: data
        })
    }).catch(err => {
        res.json(err)
    })

})

router.post("/add-category", function (req, res) {
    var passCategory = req.body.pass_cat
    var passCatDetail = new passCatModel({ password_category: passCategory })
    // passCatDetail.save(function (err, data) {
    //     if (err) throw err
    //     //res.send("Data insert successfull")
    //     res.status(201).json({
    //         message: "Insert data successfully",
    //         result: data
    //     })
    // })

    passCatDetail.save().then(doc => {
        res.status(201).json({
            message: "Insert data successfully",
            result: doc
        })
    })
        .catch(err => {
            res.json(err)
        })

})

router.put("/add-updated-category/:id", function (req, res) {
    var id = req.params.id
    var passCategory = req.body.pass_cat

    passCatModel.findById(id, function (err, data) {
        data.password_category = passCategory ? passCategory : data.password_category

        // data.save(function (err) {
        //     if (err) throw err
        //     res.status(201).json({
        //         message: "Update data successfully using PUT",
        //         result: data
        //     })
        //     //res.send("Update Data Successfully Using PUT Method")
        // })

        data.save().then(data => {
            res.status(201).json({
                message: "Update data successfully using PUT",
                result: data
            })
        })
            .catch(err => {
                res.json(err)
            })
    })

})

router.patch("/update-category/:id", function (req, res) {
    var id = req.params.id
    var passCategory = req.body.pass_cat

    passCatModel.findById(id, function (err, data) {
        data.password_category = passCategory ? passCategory : data.password_category
        /*
                data.save(function (err) {
                    if (err) throw err
                    res.status(201).json({
                        message: "Update data successfully using PATCH",
                        result: data
                    })
                    //  res.send("Update data successfully using PATCH method")
                })
                */

        data.save().then(data => {
            res.status(201).json({
                message: "Update data successfully using PATCH method",
                result: data
            })
        })
            .catch(err => {
                res.json(err)
            })
    })

})

router.delete("/delete-category/", function (req, res) {
    var cat_id = req.body.cat_id

    /*
    passCatModel.findByIdAndRemove(cat_id, function (err, data) {
        if (err) throw err
        res.status(201).json({
            message: "Delete Item Successfully",
            result: data
        })
        */

    passCatModel.findByIdAndRemove(cat_id).then(data => {
        res.status(201).json({
            message: "Delete Item Successfully",
            result: data
        })

    }).catch(err => {
        res.json(err)
    })

})

module.exports = router

