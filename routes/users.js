var User = require('../models').User;
var express = require('express');
var router = express.Router();
var roleChecker = require('./permission');
const { check, validationResult } = require('express-validator');

// todo: use require('express-validator');

router.post('/add', (req, res) => {
  // check for input data and validate constraint
  req.body.salt = User.newSalt();
  req.body.password = User.getStorePassword(req.body.password, req.body.salt);
  // todo: check role not is 'Admin'
  User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

/* GET users listing. */
router.get('/list', roleChecker('Admin'), (req, res) => {
  let limit = req.body.limit || 10;
  let offset = req.body.offset || 0;
  if (req.body.limit && req.body.offset)
    User.findAll({ limit, offset })
      .then(users => res.json({ rows: users }))
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
