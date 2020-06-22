var Donate = require('../models').DonateHistory;
var { ViewPermission, EditPermission } = require('../models/permission');
var roleChecker = require('./permission');
var express = require('express');
var router = express.Router();

router.post('/', roleChecker(EditPermission), (req, res) => {
  req.body.group_id = req.user.group_id;
  Donate.create(req.body)
    .then(donate => res.status(201).json(donate))
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

router.get('/', roleChecker(ViewPermission), (req, res) => {
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  if (req.query.limit && req.query.offset)
    Donate.findAll({ limit, offset })
      .then(donates => res.json({ rows: donates }))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
  else
    Donate.findAndCountAll({ limit, offset })
      .then(donates => res.json(donates))
      .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));

});

router.get('/:id', roleChecker(ViewPermission), (req, res) => {
  Donate.findByPk(req.params.id)
    .then(donate => res.json(donate))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

router.patch('/:id', roleChecker(EditPermission), (req, res) => {
  let doanteId = req.params.id
  Donate.findByPk(doanteId)
    .then(donate => {
      var body = req.body;
      var keys = body.keys();
      for (let i = 0; req.body.length; i++)
        donate[keys[i]] = body[keys[i]];
      donate.save();
      res.json(donate);
    })
    .catch(error => res.status(400).json({ error: 'update error', msg: error }));
});

router.delete('/:id', roleChecker(EditPermission), (req, res) => {
  let donateId = req.params.id
  Donate.destroy({ where: { id: donateId } })
    .then(result => res.json({ info: 'Donate History deleted successfully', msg: 'ok' }))
    .catch(error => res.status(400).json({ error: 'fetch error', msg: error }));
});

module.exports = router;
