var express = require("express")
var router = express.Router()
var addPassword = require("../modules/add_password")
var passwordDetails = addPassword.find({})

router.get("/passwordDetails", function (req, res) {

    passwordDetails.exec().then(data => {
        res.status(200).json({
            message: "Success",
            result: data
        })

    }).catch(err => {
        res.json(err)
    })

})

