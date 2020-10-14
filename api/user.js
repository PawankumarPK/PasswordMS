var express = require('express')
var router = express.Router()
const mongoose = require("mongoose")
var userModel = require("../modules/user")
const bcrypt = require("bcrypt")

router.post("/signup", function (req, res) {

    console.log(req.file);

    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    var confirmPassword = req.body.confirmPassword

    if (password !== confirmPassword) {
        res.json({
            message: "Password Not Matched!",
        })
    } else {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                return res.json({
                    message: "Something went wrong",
                    error: err
                })
            } else {
                var userDetails = new userModel({
                    username: username,
                    email: email,
                    password: hash
                }) 
                userDetails.save().then(data => {
                    res.status(201).json({
                        message: "User Register Successfully",
                        result: data
                    })
                }).catch(err => {
                    res.json(err)
                })

            }
        })
    }
})
module.exports = router

