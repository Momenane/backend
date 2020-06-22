var Plan = require('../models').GroupPlan;
var { ViewPermission, EditPermission } = require('../models/permission');
var roleChecker = require('./permission');
var express = require('express');
var router = express.Router();

router.post('/add', roleChecker(EditPermission), (req, res) => {
  req.body.group_id = req.user.id;
  Plan.create(req.body)
    .then(plan => res.status(201).json(plan))
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

router.get('/list', roleChecker(ViewPermission), (req, res) => {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  if (req.query.limit && req.query.offset)
    Plan.findAll({ limit, offset })
      .then(rows => res.json({ rows }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    Plan.findAndCountAll({ limit, offset })
      .then(plans => res.json(plans))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.get('/id/:id', roleChecker(ViewPermission), (req, res) => {
  Plan.findByPk(req.params.id)
    .then(plan => res.json(plan))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.patch('/id/:id', roleChecker(EditPermission), (req, res) => {
  let planId = req.params.id
  Plan.findByPk(planId)
    .then(plan => {
      var body = req.body;
      var keys = body.keys();
      for (let i = 0; req.body.length; i++) {
        plan[keys[i]] = body[keys[i]];
      }
      plan.save();
      res.json(plan)
    })
    .catch(error => res.status(400).json({ error: 'update error', msg: error }));
});

router.delete('/id/:id', roleChecker(EditPermission), (req, res) => {
  let GroupId = req.params.id
  Plan.destroy({ where: { id: GroupId } })
    .then(result => res.json({ info: 'Group plan deleted successfully', msg: 'ok' }))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

module.exports = router;
