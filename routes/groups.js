var { User, Group } = require('../models');
var { ViewPermission, EditPermission } = require('../models/permission');
var roleChecker = require('./permission');
var express = require('express');
var router = express.Router();

router.post('/', roleChecker(EditPermission), (req, res) => {
  req.body.head_id = req.user.id;
  Group.create(req.body)
    .then(group => {
      User.findByPk(req.user.id)
        .then(user => { user.group_id = group.id; user.save(); })
        .catch(error => {/*todo*/ });
      res.status(201).json(group);
    })
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

router.get('/', roleChecker(ViewPermission), (req, res) => {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  if (req.query.limit && req.query.offset)
    Group.findAll({ limit, offset })
      .then(rows => res.json({ rows }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    Group.findAndCountAll({ limit, offset })
      .then(donates => res.json(donates))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.get('/:id', roleChecker(ViewPermission), (req, res) => {
  Group.findByPk(req.params.id, { include: ['GroupMembers'] })
    .then(groupWithMembers => res.json(groupWithMembers))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.patch('/:id', roleChecker(EditPermission), (req, res) => {
  let groupId = req.params.id
  Group.findByPk(groupId)
    .then(group => {
      var body = req.body;
      var keys = body.keys();
      for (let i = 0; req.body.length; i++)
        group[keys[i]] = body[keys[i]];
      group.save();
      res.json(group)
    })
    .catch(error => res.status(400).json({ error: 'update error', msg: error }));
});

router.delete('/:id', roleChecker(EditPermission), (req, res) => {
  let groupId = req.params.id
  Group.destroy({ where: { id: groupId } })
    .then(result => res.json({ info: 'Group deleted successfully', msg: 'ok' }))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

module.exports = router;
