var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")

var passCatModel = require("../modules/password_category")
var getPassCat = passCatModel.find({})


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


//web token
//store in local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* Password Category. */
router.get('/', checkLoginUser  ,function (req, res, next) {
  var loginUser = req.session.username
  getPassCat.exec(function (err, data) {
    if (err) throw err
    res.render('password-category', { title: 'Password Management System', loginUser: loginUser, records: data });
  });
})

router.post('/', checkLoginUser, [check("passwordCategory", "Enter Password Category Name").isLength({ min: 1 })], function (req, res, next) {
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

//Delete
router.get('/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var passcat_id = req.params.id
  var passdelete = passCatModel.findByIdAndDelete(passcat_id)

  passdelete.exec(function (err) {
    if (err) throw err
    res.redirect("/passwordCategory")
  });
})

//Update
router.get('/edit/:id', checkLoginUser, function (req, res, next) {
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

router.post('/edit/', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser")
  var passcat_id = req.body.id
  var passwordCategory = req.body.passwordCategory
  var update_passcat = passCatModel.findByIdAndUpdate(passcat_id, { password_category: passwordCategory })
  update_passcat.exec(function (err, doc) {
    if (err) throw err
    res.redirect("/passwordCategory")

  })

})

module.exports = router;