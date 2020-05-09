var Member = require('../models').GroupMembers;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
  Member.create(req.body)
    .then(group => res.json(group))
    .catch(error=>{});
})

router.get('/list', function (req, res, next) {
  Member.findAll()
    .then(members => res.json(members))
    .catch(error=>{});
});

router.get('/id/:id/', function (req, res, next) {
  Member.findByPk(req.params.id, { include: ['Group'] })
    .then(function (member) {
      res.json(member);
    })
    .catch(error=>{});
});

router.patch('/id/:id', (req, res) => {
});

router.delete('/id/:id', (req, res) => {
});

module.exports = router;
