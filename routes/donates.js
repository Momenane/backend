var DonateHistory = require('../models').DonateHistory;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
  DonateHistory.create(req.body)
    .then(donate => res.json(donate))
    .catch(error => {});
})

router.get('/list', function (req, res, next) {
  // todo: pagination
  DonateHistory.findAll()
    .then(donates => res.json(donates))
    .catch(error => {});
});

router.get('/id/:id/', function (req, res, next) {
  DonateHistory.findByPk(req.params.id)
    .then(donate => res.json(donate))
    .catch(error => {});
});

router.patch('/id/:id', (req, res) => {
});

router.delete('/id/:id', (req, res) => {
  let donateId = req.params.id
  DonateHistory.destroy({ where: { id: donateId } })
      .then(result => res.json({ error: 'Donate History deleted successfully', msg: 'ok' }))
      .catch(error => res.json({ error: 'fetch error', msg: error }));
});

module.exports = router;
