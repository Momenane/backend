var User = require('../models').User;
var roleChecker = require('./permission');
var perm = require('../models/permission');
var express = require('express');
var router = express.Router();

// todo: use require('express-validator');
// var nodemailer = require("nodemailer");

router.post('/add', (req, res, next) => {
  // check for input data and validate constraint
  req.body.salt = User.newSalt();
  req.body.password = User.getStorePassword(req.body.password, req.body.salt);
  req.body.role = perm.GroupAdmin;
  // todo: check role not is 'Admin'
  const isJson = req.is('application/json');
  User.create(req.body)
    .then(user => {
      req.login(user, (err) => {
        if (err) next(err);
        else if (isJson)
          res.status(201).json({ id: user.id });
        else
          res.redirect('/user/id/' + user.id);
      });
    })
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

/* GET users listing. */
router.get('/list', roleChecker('Admin'), (req, res) => {
  let limit = req.params.limit || 10;
  let offset = req.params.offset || 0;
  if (req.query.limit && req.query.offset)
    User.findAll({ limit, offset })
      .then(rows => res.json({ rows }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    User.findAndCountAll({ limit, offset })
      .then(users => res.json(users))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.get('/id/:id', (req, res) => {
  let userId = req.params.id;
  if (req.user && (userId == req.user.id || req.user.role == 'Admin'))
    User.findOne({ where: { id: userId } })
      .then(user => res.json(user))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    res.status(401).json({ error: 'Permission Denied' });
});

router.patch('/id/:id', (req, res) => {
  let userId = req.params.id
  if (req.user && (userId == req.user.id || req.user.role == 'Admin'))
    User.findByPk(userId)
      .then(user => {
        var body = req.body;
        var keys = body.keys();
        // fixme: remove id and constant item
        for (let i = 0; req.body.length; i++)
          user[keys[i]] = body[keys[i]];
        user.save();
        res.json(user)
      })
      .catch(error => res.status(400).json({ error: 'update error', msg: error }));
  else
    res.status(401).json({ error: 'Permission Denied' });
});

router.delete('/id/:id', (req, res) => {
  let userId = req.params.id;
  if (req.user && (userId == req.user.id || req.user.role == 'Admin'))
    User.destroy({ where: { id: userId } })
      .then(result => res.json({ info: 'user deleted successfully', msg: 'ok' }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    res.status(401).json({ error: 'Permission Denied' });

});

module.exports = router;
