var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System' });
});

/* Password Category. */
router.get('/passwordCategory', function(req, res, next) {
  res.render('password-category', { title: 'Password Management System' });
});

/* Add new  Category. */
router.get('/add-new-category', function(req, res, next) {
  res.render('addNewCategory', { title: 'Password Management System' });
});


/* Add new password. */
router.get('/add-new-password', function(req, res, next) {
  res.render('add-new-password', { title: 'Password Management System' });
});


/* view all password. */
router.get('/view-all-password', function(req, res, next) {
  res.render('view-all-password', { title: 'Password Management System' });
});
module.exports = router;
