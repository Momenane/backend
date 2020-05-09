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
    let groupId = req.params.id
    Group.findByPk(groupId).then(
        (group) => {
            var body = req.body;
            var keys = body.keys();
            for (let i= 0;req.body.length ; i++){
                group[keys[i]] = body[keys[i]];
            }
            group.save();
            res.json({ error: 'Group updated successfully', msg: 'ok' })
        }).catch(error => res.json({ error: 'update error', msg: error }));
});

router.delete('/id/:id', (req, res) => {
    let groupId = req.params.id
    Group.destroy({ where: { id: groupId } })
        .then(result => res.json({ error: 'Group deleted successfully', msg: 'ok' }))
        .catch(error => res.json({ error: 'fetch error', msg: error }));
});

module.exports = router;
