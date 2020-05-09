var Group = require('../models').Group;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
  Group.create(req.body)
    .then(group => res.json(group))
    .catch(error => {});
})

router.get('/list', function (req, res) {
  // todo: pagination
  Group.findAll()
    .then(groups => res.json(groups))
    .catch(error => {});
});

router.get('/id/:id/', function (req, res) {
  Group.findByPk(req.params.id, { include: ['GroupMembers'] })
    .then(function (groupWithMembers) {
      res.json(groupWithMembers);
    })
    .catch(error => {});
});

router.patch('/id/:id', (req, res) => {
});

router.delete('/id/:id', (req, res) => {
});

module.exports = router;
