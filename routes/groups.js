var Group = require('../models').Group;
var express = require('express');
var router = express.Router();

router.post('/add', (req, res) => {
    Group.create(req.body).then(group => res.json(group))
})

/* GET users listing. */
router.get('/list', function (req, res, next) {
    Group.findAll().then(groups => res.json(groups))
});

router.get('/get/:groupId/' , function (req , res , next) {
    Group.findByPk(req.params.groupId , {include: ['GroupMembers']}).then(function(groupWithMembers) {
        res.json(groupWithMembers);
    });
});



module.exports = router;
