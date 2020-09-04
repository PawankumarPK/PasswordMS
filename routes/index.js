var express = require('express');
var router = express.Router();

var bcrypt = require("bcryptjs")

var jwt = require("jsonwebtoken")

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
    var decode = jwt.verify(userToken, "loginToken")
  } catch{
    res.redirect("/")
  }
  next()

}

/* GET login page. */
router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  if (loginUser) {
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
      res.redirect("/dashboard")
    } else {
      res.render('index', { title: 'Password Management System', msg: "Invalid username and password" });
    }
  })
});

/* GET dashboard page. */
router.get('/dashboard', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  res.render('dashboard', { title: 'Password Management System', loginUser: loginUser, msg: " " });
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
  if (loginUser) {
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

/* Password Category. */
router.get('/passwordCategory', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  res.render('password-category', { title: 'Password Management System', loginUser: loginUser });
});

/* Add new  Category. */
router.get('/add-new-category', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser });
});


/* Add new password. */
router.get('/add-new-password', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  res.render('add-new-password', { title: 'Password Management System', loginUser: loginUser });
});


/* view all password. */
router.get('/view-all-password', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  res.render('view-all-password', { title: 'Password Management System', loginUser: loginUser });
});

/* Logout */
router.get('/logout', function (req, res, next) {
  localStorage.removeItem("userToken")
  localStorage.removeItem("loginUser")
  res.redirect("/")
});
module.exports = router;
