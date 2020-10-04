const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/pms",
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection


var productSchema = new mongoose.Schema({

    product_name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
})

var productModel = mongoose.model("Product", productSchema)
module.exports = productModel