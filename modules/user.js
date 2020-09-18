const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/pms", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
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


var userModel = mongoose.model("users",userSchema)
module.exports = userModel

