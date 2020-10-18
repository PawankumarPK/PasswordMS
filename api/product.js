var express = require('express')
var router = express.Router()
var product = require("../modules/products")
var checkAuth = require("../api/middleware/auth")
const productController = require("./controller/product")

router.get('/allProducts', checkAuth, productController.getAllProducts)

router.post("/addProductItem", checkAuth, productController.addProducts)

module.exports = router