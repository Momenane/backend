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
    let memberId = req.params.id
    Member.findByPk(memberId).then(
        (member) => {
            var body = req.body;
            var keys = body.keys();
            for (let i= 0;req.body.length ; i++){
                member[keys[i]] = body[keys[i]];
            }
            member.save();
            res.json({ error: 'Member updated successfully', msg: 'ok' })
        }).catch(error => res.json({ error: 'update error', msg: error }));
});

router.delete('/id/:id', (req, res) => {
    let memberId = req.params.id
    Member.destroy({ where: { id: memberId } })
        .then(result => res.json({ error: 'Member deleted successfully', msg: 'ok' }))
        .catch(error => res.json({ error: 'fetch error', msg: error }));
});

module.exports = router;