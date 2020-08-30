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
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System' });
});

module.exports = router;
