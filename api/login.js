var express = require('express')
var router = express.Router()
const mongoose = require("mongoose")
var userModel = require("../modules/user")
const bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")


router.post("/login", function (req, res) {

    var username = req.body.username
    var password = req.body.password

    userModel.find({ username: username })
        .exec()
        .then(user => {

            if (user.length < 1) {
                res.status(404).json({
                    message: "Auth Failed",
                })
            } else {
                bcrypt.compare(password, user[0].password, function (err, result) {
                    if (err) {
                        res.status(404).json({
                            message: "Auth Failed"
                        })
                    }
                    if (result) {
                        var token = jwt.sign({
                            username: user[0].username,
                            userId: user[0]._id
                        },
                            'secret', {
                            expiresIn: "1h"
                        }
                        )

                        res.status(200).json({
                            message: "User Found",
                            token: token
                        })
                    } else {
                        res.status(404).json({
                            message: "Auth Failed",
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
})


router.post("/signup", function (req, res) {

    console.log(req.file);

    var username = req.body.username
    var email = req.body.email

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

