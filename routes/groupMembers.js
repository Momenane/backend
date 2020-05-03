var Member = require('../models').GroupMembers;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
    Member.create(req.body).then(group => res.json(group))
})

router.get('/list', function (req, res, next) {
    Member.findAll().then(members => res.json(members))
});

router.get('/get/:memberId/' , function (req , res , next) {
    Member.findByPk(req.params.memberId , {include: ['Group']}).then(function(member) {
        res.json(member);
    });
});



module.exports = router;
