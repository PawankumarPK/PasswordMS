
var addPassword = require("../../modules/add_password")
var passCatModel = require("../../modules/password_category")
var getPassCat = passCatModel.find({}, { "password_category": 1 })



exports.passwordDetails = function (req, res) {
    var passwordDetails = addPassword.find()
        .select("_id password_category project_name password_detail")
        .populate("password_category")

    passwordDetails.exec().then(data => {
        res.status(200).json({
            message: "Success",
            result: data
        })

    }).catch(err => {
        res.json(err)
    })

}

exports.getCategory = function (req, res) {

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

}