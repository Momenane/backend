var User = require('../models').User;
var express = require('express');
const passport = require('passport');
const crypto = require('crypto');
var router = express.Router();

router.post('/register', (req, res) => {
  // check for input data and validate constraint
  req.body.salt = User.newSalt();
  req.body.password = User.getStorePassword(req.body.password, req.body.salt);
  User.create(req.body).then(user => res.json(user))
})

/* GET users listing. */
router.get('/list', function (req, res, next) {
  User.findAll().then(users => res.json(users))
});

// app.post('/login', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login' }));
router.post('/login',
  passport.authenticate('local', {  failureRedirect: '/login' }),
  (req, res) => {
    // can use req.user.id & req.user.role
    res.redirect('/');
    // res.redirect('/users/' + req.user.username);
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
