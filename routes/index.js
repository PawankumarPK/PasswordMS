var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

//web token
//store in local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var userModule = require("../modules/user")

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem("userToken")
  try {
    if (req.session.username) {
      var decode = jwt.verify(userToken, "loginToken")
    } else {
      res.redirect("/")
    }
  } catch {
    res.redirect("/")
  }
  next()

}

/* GET login page. */
router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  if (req.session.username) {
    res.redirect("./dashboard")
  } else {
    res.render('index', { title: 'Password Management System', msg: " " });
  }
});

router.post('/', function (req, res, next) {

  var username = req.body.uname
  var password = req.body.password
  var checkUser = userModule.findOne({ username: username })

  checkUser.exec((err, data) => {
    if (err) throw err

    var getUserID = data._id
    var getPassword = data.password
    if (bcrypt.compareSync(password, getPassword)) {
      //we can add any value from userID
      var token = jwt.sign({ userID: getUserID }, "loginToken")
      //store data locally 
      localStorage.setItem("userToken", token)
      localStorage.setItem("loginUser", username)
      req.session.username = username
      res.redirect("/dashboard")
    } else {
      res.render('index', { title: 'Password Management System', msg: "Invalid username and password" });
    }
  })
});

function checkEmail(req, res, next) {
  var email = req.body.email
  var checkExitsEmail = userModule.findOne({ email: email })
  checkExitsEmail.exec((err, data) => {
    if (err) throw err
    if (data) {
      return res.render('signup', { title: 'Password Management System', msg: "Email Already Exist" });
    }
    next()

  })
}

function checkUsername(req, res, next) {
  var username = req.body.uname
  var checkExitsUsername = userModule.findOne({ username: username })
  checkExitsUsername.exec((err, data) => {
    if (err) throw err
    if (data) {
      return res.render('signup', { title: 'Password Management System', msg: "Username Already Exist" });
    }
    next()

  })
}

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  if (req.session.username) {
    res.redirect("./dashboard")
  } else {
    res.render('signup', { title: 'Password Management System', msg: " " });
  }
});

router.post('/signup', checkUsername, checkEmail, function (req, res, next) {

  var username = req.body.uname
  var email = req.body.email
  var password = req.body.password
  var confpassword = req.body.confpassword

  if (password != confpassword) {
    res.render('signup', { title: 'Password Management System', msg: "Password not matched" });
  } else {
    password = bcrypt.hashSync(req.body.password, 10)
    var userDetail = new userModule({
      username: username,
      email: email,
      password: password
    })

    userDetail.save((err, doc) => {
      if (err) throw err
      res.render('signup', { title: 'Password Management System', msg: "User Register Successfully" });
    })

  }

});







/* view all password. and pagination*/

/**
router.get('/view-all-password', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")

  var perPage = 5
  var page = req.params.page || 1

  getAllPass.skip((perPage * page) - perPage).limit(perPage).exec(function (err, data) {
    if (err) throw err
    passModel.countDocuments({}).exec((err, count) => {
      res.render('view-all-password', {
        title: 'Password Management System',
        loginUser: loginUser,
        records: data,
        current: page,
        pages: Math.ceil(count / perPage)

      });
    })
  })

});

//get data into page using pagination code
router.get('/view-all-password/:page', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")

  var perPage = 5
  var page = req.params.page || 1

  getAllPass.skip((perPage * page) - perPage).limit(perPage).exec(function (err, data) {
    if (err) throw err
    passModel.countDocuments({}).exec((err, count) => {
      res.render('view-all-password', {
        title: 'Password Management System',
        loginUser: loginUser,
        records: data,
        current: page,
        pages: Math.ceil(count / perPage)

      });
    })
  })

});
 */



/* Logout */
router.get('/logout', function (req, res, next) {
  
  req.session.destroy(function (err) {
    if (err) {
      res.redirect("/")
    }
  })
  localStorage.removeItem("userToken")
  localStorage.removeItem("loginUser")
  res.redirect("/")
});
module.exports = router;
