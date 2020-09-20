const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/pms", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
var conn = mongoose.connection

//live db credential
//mongodb+srv://dbPMS:9810507699@clusterpms.u38xv.mongodb.net/dbPMS?retryWrites=true&w=majority

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


var userModel = mongoose.model("users",userSchema)
module.exports = userModel

