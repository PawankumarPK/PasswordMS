var jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {

    try {
        var token = req.body.token.split(" ")[1]
        var decode = jwt.verify(token, 'secret')
        req.userData = decode
        console.log(token);
        next()
    } catch (error) {
        res.status(401).json({
            error: "Invalid token"

        })

    }


}