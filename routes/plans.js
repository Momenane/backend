var GroupPlans = require('../models').GroupPlans;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
  GroupPlans.create(req.body)
    .then(plan => res.json(plan))
    .catch(error => {});
})

router.get('/list', function (req, res, next) {
  // todo: pagination
  GroupPlans.findAll()
    .then(plans => res.json(plans))
    .catch(error => {});
});

router.get('/id/:id/', function (req, res, next) {
  GroupPlans.findByPk(req.params.id)
    .then(plan => res.json(plan))
    .catch(error => {});
});

router.patch('/id/:id', (req, res) => {
});

router.delete('/id/:id', (req, res) => {
});

module.exports = router;
