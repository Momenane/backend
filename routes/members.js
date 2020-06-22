var Member = require('../models').GroupMember;
var { Op } = require('sequelize');
var { ViewPermission, EditPermission } = require('../models/permission');
var roleChecker = require('./permission');
var express = require('express');
var router = express.Router();

router.post('/add', /*roleChecker(EditPermission),*/(req, res) => {
  if (req.user) {
    req.body.register_id = req.user.id;
    req.body.group_id = req.user.group_id;
  }
  else {
    req.body.register_id = null;
    req.body.group_id = null;
  }
  Member.create(req.body)
    .then(group => res.status(201).json(group))
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

router.get('/list', (req, res) => {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  // todo: limit get user by group_id from user
  let options = { limit, offset };
  if (!roleChecker(ViewPermission))
    options.attributes = ['name', 'birth_date', 'location', 'job', 'monthly_salary', 'group_id', 'other_organization'];
  if (req.query.limit && req.query.offset)
    Member.findAll(options)
      .then(rows => res.json({ rows }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    Member.findAndCountAll(options)
      .then(donates => res.json(donates))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.get('/pending', roleChecker(ViewPermission), (req, res) => {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  // todo: limit get user by group_id from user
  let options = { limit, offset, where: { register_id: { [Op.eq]: null } } };
  if (req.query.limit && req.query.offset)
    Member.findAll(options)
      .then(rows => res.json({ rows }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    Member.findAndCountAll(options)
      .then(donates => res.json(donates))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.get('/id/:id', roleChecker(ViewPermission), (req, res) => {
  Member.findByPk(req.params.id, { include: ['Group'] })
    .then(member => res.json(member))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.patch('/id/:id', roleChecker(EditPermission), (req, res) => {
  let memberId = req.params.id
  Member.findByPk(memberId)
    .then(member => {
      var body = req.body;
      var keys = body.keys();
      for (let i = 0; req.body.length; i++)
        member[keys[i]] = body[keys[i]];
      member.save();
      res.json(member);
    })
    .catch(error => res.status(400).json({ error: 'update error', msg: error }));
});

router.delete('/id/:id', roleChecker(EditPermission), (req, res) => {
  let memberId = req.params.id
  Member.destroy({ where: { id: memberId } })
    .then(result => res.json({ info: 'Member deleted successfully', msg: 'ok' }))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

module.exports = router;
