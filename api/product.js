var express = require('express')
var router = express.Router()
var product = require("../modules/products")
var multer = require("multer")
var upload = multer({ dest: "public/uploads/" })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/")
    },
    filename: function (req, file, cb) {
        //original name comes from log see below line
        //console.log(req.file);

        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

//all varible is pre defined so make sure it will same 
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


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

router.post("/addProductItem", upload.single("productImage"), function (req, res) {

    console.log(req.file);

    var product_name = req.body.product_name
    var price = req.body.price
    var quantity = req.body.quantity

    var addProducts = new product({
        product_name: product_name,
        price: price,
        quantity: quantity,
        image: req.file.path
    })

    addProducts.save().then(data => {
        res.status(201).json({
            message: "Successfully Inserted",
            result: data
        })
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router