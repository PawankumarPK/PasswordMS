const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://dbPMS:9810507699@clusterpms.u38xv.mongodb.net/dbPMS?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection

var passcatSchema = new mongoose.Schema({
    password_category: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

conn.on("connected",function(){
    console.log("Connected Successfully");
})


var passCatModel = mongoose.model("password_categories", passcatSchema)
module.exports = passCatModel

