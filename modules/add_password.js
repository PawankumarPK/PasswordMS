const mongoose = require("mongoose")
//paginate
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect("mongodb+srv://dbPMS:9810507699@clusterpms.u38xv.mongodb.net/dbPMS?retryWrites=true&w=majority",
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


passSchema.plugin(mongoosePaginate);

var passModel = mongoose.model("password_details", passSchema)
module.exports = passModel

