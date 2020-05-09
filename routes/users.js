var User = require('../models').User;
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

// todo: use require('express-validator');

router.post('/add', (req, res) => {
  // check for input data and validate constraint
  req.body.salt = User.newSalt();
  req.body.password = User.getStorePassword(req.body.password, req.body.salt);
  User.create(req.body)
    .then(user => res.json(user))
    .catch(error => res.json({ error: 'insert error', msg: error }));
});

/* GET users listing. */
router.get('/list', (req, res) => {
  if (req.session.passport == null)
    return res.redirect('/login');
  let user = req.session.passport.user || { id: -1, role: 'None' };
  let admin = (user.role || '') == 'Admin';
  console.log('user list:', admin, user);
  if (admin) {
    let limit = req.body.limit || 10;
    let offset = req.body.offset || 0;
    if (req.body.limit && req.body.offset)
      User.findAll({ limit, offset })
        .then(users => res.json({ rows: users }))
        .catch(error => res.json({ error: 'fetch error', msg: error }));
    else
      User.findAndCountAll({ limit, offset })
        .then(users => res.json(users))
        .catch(error => res.json({ error: 'fetch error', msg: error }));
  }
  else
    res.json({ error: 'Permission Denied' });
});

router.get('/id/:id', (req, res) => {
  let userId = req.params.id;
  console.log('get user by id ', req.session, userId);
  if (req.session.passport == null)
    return res.redirect('/login');
  let user = req.session.passport.user || { id: -1, role: 'None' };
  if (req.session && user &&
    (userId == user.id || user.role == 'Admin'))
    User.findOne({ where: { id: userId } })
      .then(user => res.json(user))
      .catch(error => res.json({ error: 'fetch error', msg: error }));
  else
    res.json({ error: 'Permission Denied' });
});

router.patch('/id/:id', (req, res) => {
  let userId = req.params.id
  User.findByPk(userId).then(
      (user) => {
        var body = req.body;
        var keys = body.keys();
        for (let i= 0;req.body.length ; i++){
          user[keys[i]] = body[keys[i]];
        }
        user.save();
        res.json({ error: 'plan updated successfully', msg: 'ok' })
      }).catch(error => res.json({ error: 'update error', msg: error }));
});

router.delete('/id/:id', (req, res) => {
  let userId = req.params.id;
  console.log('get user by id ', req.session, userId);
  if (req.session.passport == null)
    return res.redirect('/login');
  let user = req.session.passport.user || { id: -1, role: 'None' };
  if (req.session && user &&
      (userId == user.id || user.role == 'Admin'))
    User.destroy({ where: { id: userId } })
        .then(result => res.json({ error: 'user deleted successfully', msg: 'ok' }))
        .catch(error => res.json({ error: 'fetch error', msg: error }));
  else
    res.json({ error: 'Permission Denied' });

});

module.exports = router;
