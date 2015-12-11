/**
 * Created by k1 on 12/10/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');

router.get('/users', function (req, res) {
    User.find(function (err, users) {
        res.send(users);
    });
});

router.get('/messages', function (req, res) {
    Message.find(function (err, comments) {
        res.send(comments);
    });
});

router.get('/messages/:userId', function (req, res) {
    Message.find({user_id: req.params.userId}, function (err, comments) {
        Message.populate(comments, {path: 'user_id'}, function (err, comments) {
            res.send(comments);
        });
    });
});


module.exports = router;