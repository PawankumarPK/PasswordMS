const mongoose = require("mongoose")
//paginate
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect("mongodb://localhost:27017/pms",
 { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection

var passSchema = new mongoose.Schema({
    password_category: {
        type: String,
        required: true,
    },
    project_name: {
        type: String,
        required: true,
    },
    password_detail: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

conn.on("connected",function(){
    console.log("Connected Successfully");
})

conn.on("disconnected",function(){
    console.log("Disonnected Successfully");
})


passSchema.plugin(mongoosePaginate);

var passModel = mongoose.model("password_details", passSchema)
module.exports = passModel

