/**
 * Created by k1 on 12/10/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var passport = require('passport');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())return next();
    res.sendStatus(401);
}


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

router.post('/login', passport.authenticate('local'), function (req, res) {
    console.log(req);
    res.json(req.user, {'message': "login successfully !!!"});
});

router.get('/currentuser', isAuthenticated, function (req, res) {
    res.json(req.user);
});

router.post('/register', function (req, res) {

    /*var user = new User();
     user.username = req.body.username;
     user.password = req.body.password;

     user.save(function (err) {
     if (err) {
     res.json({'message': 'Registration error'});
     } else {
     res.json(req.user, {'message': 'Registration success'});
     }
     });*/

    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            req.flash('signupMessage', 'That email is already taken.');
        }
        passport.authenticate('local')(req, res, function () {
            res.json(user, {'message': 'Registration success'});
        });
    });


});

router.get('/logout', function (req, res) {
    req.logout();
    res.send(200);
});


module.exports = router;