var User  = require('../models').User;
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  User.create(req.body).then(user => res.json(user))
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll().then(users => res.json(users))
});

module.exports = router;
