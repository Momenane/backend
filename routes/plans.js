var GroupPlans = require('../models').GroupPlans;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
  GroupPlans.create(req.body)
    .then(plan => res.status(201).json(plan))
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

router.get('/list', function (req, res, next) {
  // todo: pagination
  GroupPlans.findAll()
    .then(plans => res.json(plans))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.get('/id/:id/', function (req, res, next) {
  GroupPlans.findByPk(req.params.id)
    .then(plan => res.json(plan))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.patch('/id/:id', (req, res) => {
  let planId = req.params.id
  GroupPlans.findByPk(planId).then(
    (plan) => {
      var body = req.body;
      var keys = body.keys();
      for (let i = 0; req.body.length; i++) {
        plan[keys[i]] = body[keys[i]];
      }
      plan.save();
      res.json(plan)
    }).catch(error => res.status(400).json({ error: 'update error', msg: error }));
});

router.delete('/id/:id', (req, res) => {
  let GroupId = req.params.id
  GroupPlans.destroy({ where: { id: GroupId } })
    .then(result => res.json({ info: 'Group plan deleted successfully', msg: 'ok' }))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

module.exports = router;
