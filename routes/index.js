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
var passCatModel = require("../modules/password_category")
var passModel = require("../modules/add_password")
var getPassCat = passCatModel.find({})
var getAllPass = passModel.find({})

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem("userToken")
  try {
    var decode = jwt.verify(userToken, "loginToken")
  } catch {
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
  getPassCat.exec(function (err, data) {
    if (err) throw err
    res.render('password-category', { title: 'Password Management System', loginUser: loginUser, records: data });
  });
})

//Delete
router.get('/passwordCategory/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var passcat_id = req.params.id
  var passdelete = passCatModel.findByIdAndDelete(passcat_id)

  passdelete.exec(function (err) {
    if (err) throw err
    res.redirect("/passwordCategory")
  });
})

//Update
router.get('/passwordCategory/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var passcat_id = req.params.id
  var getPassCategory = passCatModel.findById(passcat_id)

  getPassCategory.exec(function (err, data) {
    if (err) throw err
    res.render('edit_pass_category', {
      title: 'Password Management System', errors: "", success: "",
      loginUser: loginUser, records: data, id: passcat_id
    });
  });
})

router.post('/passwordCategory/edit/', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var passcat_id = req.body.id
  var passwordCategory = req.body.passwordCategory
  var update_passcat = passCatModel.findByIdAndUpdate(passcat_id, { password_category: passwordCategory })
  update_passcat.exec(function (err, doc) {
    if (err) throw err
    res.redirect("/passwordCategory")

  })

  // getPassCategory.exec(function (err, data) {
  //   if (err) throw err
  //   res.render('edit_pass_category', { title: 'Password Management System', errors: "", success: "", loginUser: loginUser, records: data, id: passcat_id });
  // });
})


/* Add new  Category. */
router.get('/add-new-category', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: "", success: "" });
});

router.post('/add-new-category', checkLoginUser, [check("passwordCategory", "Enter Password Category Name").isLength({ min: 1 })], function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    //console.log(errors.mapped());
    res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: errors.mapped(), success: "" });
  } else {
    var passCatName = req.body.passwordCategory
    var passCatDetails = new passCatModel({
      password_category: passCatName
    })
    passCatDetails.save(function (err, doc) {
      if (err) throw err
      res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: "", success: "Password Category Inserted Successfully" });
    })

  }
});


/* Add new password. */
router.get('/add-new-password', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  getPassCat.exec(function (err, data) {
    if (err) throw err
    res.render('add-new-password', { title: 'Password Management System', loginUser: loginUser, records: data, success: "" });
  })

});
router.post('/add-new-password', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var pass_cat = req.body.pass_cat;
  var project_name = req.body.project_name;
  var pass_details = req.body.pass_details;
  var password_details = new passModel({
    password_category: pass_cat,
    project_name: project_name,
    password_detail: pass_details
  });

  password_details.save(function (err, doc) {
    getPassCat.exec(function (err, data) {
      if (err) throw err;
      res.render('add-new-password', { title: 'Password Management System', loginUser: loginUser, records: data, success: "Password Details Inserted Successfully" });

    });

  });
})

/* view all password. */
router.get('/view-all-password', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  getAllPass.exec(function (err, data) {
    if (err) throw err
    res.render('view-all-password', { title: 'Password Management System', loginUser: loginUser, records: data });
  })

});

//Delete
router.get('/password_details/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var deletePassDetailId = req.params.id
  var deletePassCategory = passModel.findByIdAndDelete(deletePassDetailId)

  deletePassCategory.exec(function (err, data) {
    if (err) throw err
    res.redirect("/view-all-password")
  })
});

//Edit
router.get("/password_details/edit/:id", checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var id = req.params.id
  var getPassDetails = passModel.findById({ _id: id })

  getPassDetails.exec(function (err, data) {
    if (err) throw err
    getPassCat.exec(function (err, data1) {
      res.render('edit_password_details', {
        title: 'Password Management System', loginUser: loginUser, record: data, records: data1, id: id, success: ""
      });
    })
  })
});

//Post
router.post("/password_details/edit/:id", checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var id = req.params.id
  var passwordCategory = req.body.pass_cat
  var projectName = req.body.project_name
  var passwordDetail = req.body.pass_details
  var updatePassDetails = passModel.findByIdAndUpdate(id, {
    password_category: passwordCategory,
    project_name: projectName,
    password_detail: passwordDetail
  })

  updatePassDetails.exec(function (err, doc) {
    if (err) throw err
    var getPassDetails = passModel.findById({ _id: id })
    getPassDetails.exec(function (err, data) {
      if (err) throw err
      getPassCat.exec(function (err, data1) {
        res.render('edit_password_details', {
          title: 'Password Management System', loginUser: loginUser, record: data,
          records: data1, id: id, success: "Password Details Update Successfully"
        });
      })

    })
  })
})


/* Logout */
router.get('/logout', function (req, res, next) {
  localStorage.removeItem("userToken")
  localStorage.removeItem("loginUser")
  res.redirect("/")
});
module.exports = router;
