var express = require('express')
var router = express.Router()
var product = require("../modules/products")
var multer = require("multer")
var upload = multer({dest:"public/uploads/"})


router.get('/allProducts', function (req, res) {
    var allProducts = product.find()

    allProducts.exec().then(data => {
        res.status(200).json({
            message: "Success",
            result: data
        })
    }).catch(err => {
        res.json(err)
    })
})

router.post("/addProductItem",upload.single("productImage"), function (req, res) {

    console.log(req.file);

    var product_name = req.body.product_name
    var price = req.body.price
    var quantity = req.body.quantity

    var addProducts = new product({ product_name: product_name, price: price, quantity: quantity })

    addProducts.save().then(data =>{
        res.status(201).json({
            message : "Successfully Inserted",
            result : data
        })
    }).catch(err =>{
        res.json(err)
    })
})

module.exports = router