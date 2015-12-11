/**
 * Created by k1 on 12/10/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

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

// /api/posts/
router.get('/posts', function (req, res) {
    Post.find(function (err, posts) {
        res.send(posts);
    });
});

// /api/posts/:userId
router.get('/posts/:userId', function (req, res) {
    Post.find({user_id: req.params.userId}, function (err, posts) {
        Post.populate(posts, {path: 'user_id'}, function (err, posts) {
            res.send(posts);
        });
    });
});


module.exports = router;